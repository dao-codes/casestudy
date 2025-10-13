/* =========================================================================
   app_public.js — SAFE OFFLINE BUILD (114건 내장)
   - 외부 fetch, cases.json 의존 완전 제거
   - 검색/칩/페이지네이션 유지
   - 카드 액션: [복사하기] (의견/피드백 버튼 제거)
   ====================================================================== */

/* ---------- 표준 응답 템플릿 ---------- */
const RESPONSES = {
  "운영시간/공간": `[사과] 이용 시간으로 불편을 드려 죄송합니다.
[근거] 예산·인력·안전 지침에 따라 현 시간대를 운영 중입니다.
[대안] 야간·주말 확대 수요를 수집하여 차기 편성에 반영하겠습니다.`,
  "선발/절차": `[사과] 기대에 미치지 못해 죄송합니다.
[근거] 공지된 기준(우선·추첨·가점 등)에 따라 진행했습니다.
[대안] 다음 모집 일정·준비 팁을 안내드리며, 요청 시 개인정보를 제외한 요약 사유를 제공하겠습니다.`,
  "개인정보/마케팅": `[안내] 최소 수집·암호화 보관·접근 통제로 보호합니다.
[조치] 수신 거부·삭제 요청 즉시 처리하고 결과를 안내드리겠습니다.`,
  "프로그램 품질": `[사과] 품질이 기대에 미치지 못했습니다.
[조치] 강의 속도·자료·Q&A를 보완하고 필요 시 보완 세션/자료를 제공합니다.`,
  "공정성/청렴성": `[안내] 이해충돌 방지·협찬 표기·청렴 지침을 준수합니다.
[조치] 사실관계를 점검하고 필요한 경우 시정 조치를 시행하겠습니다.`,
  "상담": `[원칙] 비밀보장·최소 열람 원칙을 준수합니다.
[대안] 상담사 변경 가능하며 기록 범위를 재설정해 진행하겠습니다.`,
  "연락/소통": `[사과] 연락 지연에 대해 사과드립니다.
[대안] 전화/우편 등 대체 수단 제공, 24~48시간 내 회신 원칙을 재안내하겠습니다.`,
  "자료/콘텐츠": `[안내] 운영 기간 내 자료 제공이 원칙입니다.
[대안] 권한 복구·재전달 가능 범위를 검토하고 링크를 갱신하겠습니다.`,
  "공간/환경": `[사과] 시설·환경으로 불편을 드렸습니다.
[조치] 즉시 점검하고 혼잡 시간·대체 좌석 등을 안내하겠습니다.`,
  "일정/기한": `[사과] 일정 표기 혼선 개선하겠습니다.
[원칙] 마감은 절대시각(예: 금 18:00) 기준이며 리마인드를 강화하겠습니다.`,
  "기관 신뢰성": `[안내] (구/시) 위탁 공공기관으로 특정 종교·영리와 무관합니다.
[근거] 운영 주체·사업 공고문을 안내하겠습니다.`,
  "참여 자격": `[안내] 공고 범위 내 광역·타지역 청년 참여가 가능합니다.
[조치] 세부 요건을 다시 안내드리겠습니다.`,
  "리워드/경품": `[안내] 소액 기념품은 지침 범위 내 운영합니다.
[근거] 지급 기준·절차를 공개하고 오해가 없도록 고지 문구를 보완하겠습니다.`,
  "보안/시스템": `[사과] 시스템 불편을 확인했습니다.
[조치] 원인을 파악·복구하고 자동저장/대체 경로를 안내하겠습니다.`,
  "기타": `[사과] 관련 기준과 사실관계를 확인해 가장 빠른 방법으로 조치하고 결과를 안내드리겠습니다.`
};

/* ---------- 114건 내장 데이터 ---------- */
const CASES = [ /* (생략) — 사용자가 제공한 114건 배열 그대로 유지 */ 
  {"q":"프로그램은 왜 주말에 안하나요?","cat":"운영시간/공간"},
  {"q":"다른 센터는 저녁에도 대관이 가능한데 왜 안되나요?","cat":"운영시간/공간"},
  /* ... 중간 동일 ... */
  {"q":"민원·제안 접수 현황을 월별로 공개해 주세요.","cat":"기타"}
];

/* ---------- 실행(DOMContentLoaded 보장) ---------- */
document.addEventListener('DOMContentLoaded', () => {

  // 리스트 UI 모드 활성화
  document.body.classList.add('list-mode');

  /* 요소 수집 */
  const els = {
    search: document.getElementById('search'),
    chips: document.getElementById('chips'),
    tbody: document.getElementById('tbody'),
    shown: document.getElementById('shown'),
    total: document.getElementById('total'),
    prev: document.getElementById('prev'),
    next: document.getElementById('next'),
    pageSize: document.getElementById('pageSize'),
    pageInfo: document.getElementById('pageInfo'),
    toggleTheme: document.getElementById('toggleTheme'),
    openIssues: document.getElementById('openIssues'),
  };

  /* 상태 */
  const CATS = ["운영시간/공간","선발/절차","개인정보/마케팅","프로그램 품질","공정성/청렴성","상담","연락/소통","자료/콘텐츠","공간/환경","일정/기한","기관 신뢰성","참여 자격","리워드/경품","보안/시스템","기타"];
  let page = 1;
  let pageSize = Number(els.pageSize?.value)||50;
  let activeCats = new Set();
  let view = CASES.map((d,i)=>({idx:i+1,q:d.q,cat:d.cat,a:RESPONSES[d.cat]||RESPONSES["기타"]}));

  /* 유틸 */
  const escapeHTML = (s)=> String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  const parseSearch = (q)=>{
    q=(q||'').trim(); const cat=[],not=[],words=[];
    const re=/(\b카테고리:"([^"]+)"|\-키워드:"([^"]+)"|("[^"]+"|\S+))/g; let m;
    while((m=re.exec(q))){
      if(m[2]) cat.push(m[2].trim());
      else if(m[3]) not.push(m[3].trim().toLowerCase());
      else{ const w=m[1].replace(/^"|"$|^'|'$/g,'').trim(); if(w) words.push(w.toLowerCase()); }
    }
    return {cat,not,words};
  };
  const highlight=(html,terms)=>{
    if(!terms||!terms.length) return html;
    let out=html; terms.forEach(t=>{ const safe=t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); out=out.replace(new RegExp(safe,'gi'), m=>`<mark>${m}</mark>`); });
    return out;
  };
  const filteredRows=()=>{
    const termRaw=(els.search?.value||"").trim();
    const parsed=parseSearch(termRaw);
    const terms=(parsed.words||[]).filter(Boolean);
    const rows=view.filter(r=>{
      if(activeCats.size && !activeCats.has(r.cat)) return false;
      if(parsed.cat.length && !parsed.cat.includes(r.cat)) return false;
      const hay=(r.q+" "+r.a+" "+r.cat).toLowerCase();
      if(parsed.not.some(n=>hay.includes(n))) return false;
      if(!terms.length) return true;
      return terms.every(w=>hay.includes(w));
    });
    return {rows,terms};
  };

  /* 칩 렌더 */
  const renderChips=()=>{
    if(!els.chips) return;
    els.chips.innerHTML = `<button class="chip" id="chipReset" type="button">필터 해제</button>` + CATS.map(c=>`<button class="chip" data-cat="${c}" type="button">${c}</button>`).join('');
    document.getElementById('chipReset')?.addEventListener('click', ()=>{ activeCats.clear(); syncChips(); page=1; render(); });
    els.chips.querySelectorAll('.chip[data-cat]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const c=btn.dataset.cat;
        activeCats.has(c)?activeCats.delete(c):activeCats.add(c);
        syncChips(); page=1; render();
      });
    });
    syncChips();
  };
  const syncChips=()=> els.chips?.querySelectorAll('.chip[data-cat]').forEach(b=> b.classList.toggle('active', activeCats.has(b.dataset.cat)));

  /* 행/렌더 */
  const rowHtml=(r,terms)=>{
    const qHtml=highlight(escapeHTML(r.q),terms);
    const aHtml=highlight(escapeHTML(r.a||'').replace(/\n/g,'<br>'),terms);
    return `<tr>
      <td data-h="#">${r.idx}</td>
      <td data-h="민원 사례"><span class="q">${qHtml}</span> <span class="cat">${r.cat}</span></td>
      <td data-h="가이드"><div class="resp">${aHtml}</div></td>
      <td data-h="복사">
        <div class="row-actions">
          <button class="btn copy" type="button" data-copy data-idx="${r.idx}" aria-label="이 카드 내용 복사">복사하기</button>
        </div>
      </td>
    </tr>`;
  };

  const render=()=>{
    const {rows,terms}=filteredRows();
    if(els.total) els.total.textContent = view.length;
    if(els.shown) els.shown.textContent = rows.length;

    const pages=Math.max(1, Math.ceil(rows.length / pageSize));
    if(page>pages) page=pages;
    const start=(page-1)*pageSize;
    const slice=rows.slice(start, start+pageSize);

    els.tbody.innerHTML = slice.map(r=>rowHtml(r,terms)).join('') || `<tr><td colspan="4" style="padding:18px">검색 조건에 맞는 결과가 없습니다.</td></tr>`;
    if(els.pageInfo) els.pageInfo.textContent = `${page}/${pages}`;
    if(els.prev) els.prev.disabled = (page<=1);
    if(els.next) els.next.disabled = (page>=pages);
  };

  /* 이벤트 */
  els.search?.addEventListener('input', ()=>{ page=1; render(); });
  els.prev?.addEventListener('click', ()=>{ if(page>1){ page--; render(); } });
  els.next?.addEventListener('click', ()=>{ page++; render(); });
  els.pageSize?.addEventListener('change', ()=>{ pageSize=Number(els.pageSize.value)||50; page=1; render(); });
  els.toggleTheme?.addEventListener('click', ()=>{
    const root=document.documentElement;
    root.setAttribute('data-theme', root.getAttribute('data-theme')==='dark' ? 'auto' : 'dark');
  });

  // [복사하기] 버튼: 이벤트 위임으로 처리
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-copy]');
    if (!btn) return;
    const tr   = btn.closest('tr');
    const qEl  = tr?.querySelector('.q');
    const catEl= tr?.querySelector('.cat');
    const aEl  = tr?.querySelector('.resp');

    const q    = (qEl?.innerText || '').trim();
    const cat  = (catEl?.innerText || '').trim();
    const ans  = (aEl?.innerText || '').trim();

    const text = [
      `민원: ${q}${cat ? ` (${cat})` : ''}`,
      '',
      '가이드:',
      ans
    ].join('\n');

    copyToClipboard(text).then(() => showToast('복사했습니다.'));
  });

  // 클립보드 + 토스트
  function copyToClipboard(text){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      resolve();
    });
  }
  function showToast(msg){
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('show'), 1200);
  }

  /* Sticky 오프셋 자동 보정 */
  function updateStickyOffset(){
    const tb = document.querySelector('.toolbar');
    const fl = document.querySelector('.filters');
    const root = document.documentElement;
    const tbH = tb ? tb.offsetHeight : 0;
    const flH = fl ? fl.offsetHeight : 0;
    root.style.setProperty('--sticky-toolbar', tbH + 'px');
    root.style.setProperty('--sticky-filters', flH + 'px');
  }
  window.addEventListener('resize', updateStickyOffset);
  new ResizeObserver(updateStickyOffset).observe(document.body);
  updateStickyOffset();

  /* 시작 */
  renderChips();
  render();
});
