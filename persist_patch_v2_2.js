// ==== Stable persistence + autosave patch v2.2 ====
// - 고정 키(APP_ID 기반) + 앱 기본 키(SAVE_KEY/PREF_KEY) 양쪽 동시 운용
// - 초기/지연 복원 시 window.loadEdits() 우선 호출
// - 주기적 자동 저장: 원본 saveEdits() 호출 후 양쪽 키에 미러
// - 빈 배열 복원/저장 방지
(function(){
  const APP_ID     = document.querySelector('meta[name="app-id"]')?.getAttribute('content') || 'impact-share-center-v1';
  const FIX_ITEMS  = `${APP_ID}:items`;
  const FIX_PREFS  = `${APP_ID}:prefs`;
  const APP_ITEMS  = (typeof window.SAVE_KEY==='string' ? window.SAVE_KEY : 'complaints_edits_v35');
  const APP_PREFS  = (typeof window.PREF_KEY==='string' ? window.PREF_KEY : 'complaints_prefs_v35');
  const ls = (()=>{ try{ return window.localStorage; }catch(_){ return null; } })();
  if(!ls) return;

  const safe = { parse(s){ try{ return JSON.parse(s); }catch(_){ return null; } }, str(o){ try{ return JSON.stringify(o); }catch(_){ return '[]'; } } };

  function notEmptyArray(a){ return Array.isArray(a) && a.length>0; }

  function readAppItems(){
    const raw = ls.getItem(APP_ITEMS);
    const data = safe.parse(raw);
    return (data && Array.isArray(data.items)) ? data.items : null;
  }
  function writeAppItems(items){
    if(!notEmptyArray(items)) return;
    ls.setItem(APP_ITEMS, safe.str({items, savedAt:new Date().toISOString()}));
  }
  function readFixItems(){
    return safe.parse(ls.getItem(FIX_ITEMS));
  }
  function writeFixItems(items){
    if(!notEmptyArray(items)) return;
    ls.setItem(FIX_ITEMS, safe.str(items));
  }

  // --- 초기 복원: 앱의 loadEdits()를 우선 호출, 그 다음 고정키에서 보강 ---
  function initialHydrate(force=false){
    try{ if(typeof window.loadEdits==='function') window.loadEdits(); }catch(_){}
    // 만약 view가 비어있으면 고정키에서 복원
    const v = window.view;
    if(!(Array.isArray(v) && v.length>0)){
      const fix = readFixItems();
      if(notEmptyArray(fix)){
        if(Array.isArray(window.view)){ window.view.length=0; fix.forEach(x=>window.view.push(x)); }
        else { window.view = fix; }
        if(typeof window.render==='function') try{ window.render(); }catch(_){}
      }
    }
    // 양방향 동기화: 앱 키가 비었고 고정키가 있으면 앱 키도 채워둠
    const appItems = readAppItems();
    const fixItems = readFixItems();
    if(!notEmptyArray(appItems) && notEmptyArray(fixItems)) writeAppItems(fixItems);
    if(!notEmptyArray(fixItems) && notEmptyArray(appItems)) writeFixItems(appItems);
  }

  document.addEventListener('DOMContentLoaded', ()=> initialHydrate(false));
  window.addEventListener('load', ()=> setTimeout(()=> initialHydrate(true), 500));

  // --- 저장 경로 래핑: 원본 saveEdits 호출 후 양쪽 키 저장 ---
  const _saveEdits = window.saveEdits;
  window.saveEdits = function(){
    if(typeof _saveEdits==='function'){ try{ _saveEdits(); }catch(_){ } }
    try{
      const items = Array.isArray(window.view) ? window.view.map(v=>({idx:v.idx, q:v.q, a:v.a, cat:v.cat, sel:!!v.sel, st:v.st})) : null;
      if(notEmptyArray(items)){
        writeAppItems(items);
        writeFixItems(items);
      }
    }catch(_){}
  };

  // --- 주기적 자동 저장(3초) + 종료 시 저장 ---
  setInterval(()=>{ try{ window.saveEdits(); }catch(_){} }, 3000);
  window.addEventListener('beforeunload', ()=>{ try{ window.saveEdits(); }catch(_){} });
  document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden'){ try{ window.saveEdits(); }catch(_){} } });

  // --- [강제 복원] 버튼 ---
  function injectForceRestore(){
    const toolbar = document.querySelector('.toolbar .rightTools') || document.querySelector('.toolbar');
    if(!toolbar || document.getElementById('forceRestore')) return;
    const btn = document.createElement('button');
    btn.id='forceRestore'; btn.type='button'; btn.className='btn ghost'; btn.textContent='강제 복원';
    btn.title = '저장된 데이터를 즉시 복원합니다.';
    btn.addEventListener('click', initialHydrate);
    toolbar.appendChild(btn);
  }
  document.addEventListener('DOMContentLoaded', injectForceRestore);
})();