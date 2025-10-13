
// ==== Optional autosave to a chosen JSON file (Chrome, secure context) ====
(function(){
  const DB_NAME = 'impact-share';
  const STORE = 'fsHandles';
  const KEY = 'backup';

  function toastSafe(m){ try{ toast(m); }catch(_){ console.log('[backup]', m); } }

  function idbOpen(){
    return new Promise((resolve, reject)=>{
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = ()=>{
        const db = req.result;
        if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
  }
  function idbPut(key, val){
    return idbOpen().then(db=> new Promise((resolve, reject)=>{
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(val, key);
      tx.oncomplete = ()=> resolve();
      tx.onerror = ()=> reject(tx.error);
    }));
  }
  function idbGet(key){
    return idbOpen().then(db=> new Promise((resolve, reject)=>{
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    }));
  }

  async function pickFile(){
    if(!window.isSecureContext || !window.showSaveFilePicker){
      toastSafe('파일 자동 저장은 HTTPS 또는 localhost에서만 가능합니다.');
      throw new Error('FS API unavailable');
    }
    const handle = await showSaveFilePicker({
      suggestedName: `임팩트_공유_백업_${new Date().toISOString().slice(0,10)}.json`,
      types: [{ description:'JSON', accept: {'application/json':['.json']} }]
    });
    await idbPut(KEY, handle);
    return handle;
  }
  async function getSavedHandle(){
    try{ return await idbGet(KEY); }catch(_){ return null; }
  }
  async function ensurePerm(handle){
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if ((await handle.requestPermission(opts)) === 'granted') return true;
    return false;
  }
  async function writeJSON(handle, data){
    const ok = await ensurePerm(handle);
    if(!ok) throw new Error('permission denied');
    const file = await handle.createWritable();
    await file.write(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}));
    await file.close();
  }

  let currentHandle = null;
  async function autosave(reason='autosave'){
    try{
      if(!currentHandle || !Array.isArray(window.view)) return;
      await writeJSON(currentHandle, window.view);
      toastSafe(`백업 저장됨 (${reason})`);
    }catch(e){
      console.warn('[backup] save failed', e);
    }
  }

  function injectButton(){
    const toolbar = document.querySelector('.toolbar .rightTools') || document.querySelector('.toolbar');
    if(!toolbar || document.getElementById('setupBackup')) return;
    const btn = document.createElement('button');
    btn.id = 'setupBackup';
    btn.type = 'button';
    btn.className = 'btn ghost';
    btn.textContent = '자동 백업 설정';
    btn.title = '선택한 JSON 파일로 자동 저장합니다(HTTPS/localhost 필요)';
    btn.addEventListener('click', async ()=>{
      try{
        currentHandle = await pickFile();
        await autosave('초기');
      }catch(_){}
    });
    toolbar.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    injectButton();
    if(window.isSecureContext){
      try{
        const h = await getSavedHandle();
        if(h){ currentHandle = h; await autosave('시작'); }
      }catch(_){}
    }
  });

  const _saveEdits = window.saveEdits;
  window.saveEdits = function(){
    if(typeof _saveEdits==='function') _saveEdits();
    autosave('saveEdits');
  };
  setInterval(()=> autosave('주기'), 5000);
  window.addEventListener('beforeunload', ()=> autosave('종료'));
})();
