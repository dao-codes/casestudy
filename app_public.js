/* =========================================================================
   app_public.js — Robust JSON loader (dao-codes/Impact)
   - cases.json 경로 자동탐색: 절대경로 → 상대경로 후보 → 실패 시 알림
   - 검색/칩/페이지네이션 & GitHub Issues 연동
   - 화면 우하단 배지로 로드 건수 표시(3초)
   ====================================================================== */

// 절대 경로(프로젝트 페이지 기준) — 먼저 시도
const CASES_URL_ABSOLUTE = "https://dao-codes.github.io/Impact/cases.json";

/* ---------------- 표준 응답 템플릿 ---------------- */
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

/* ---------------- 요소/상태 ---------------- */
const CATS = ["운영시간/공간","선발/절차","개인정보/마케팅","프로그램 품질","공정성/청렴성","상담","연락/소통","자료/콘텐츠","공간/환경","일정/기한","기관 신뢰성","참여 자격","리워드/경품","보안/시스템","기타"];

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

let page = 1;
let pageSize = Number(els.pageSize?.value)||50;
let activeCats = new Set();
let view = [];

/* ---------------- GitHub Issues ---------------- */
const GH_OWNER = document.querySelector('meta[name="gh-owner"]')?.getAttribute('content')?.trim() || '';
const GH_REPO  = document.querySelector('meta[name="gh-repo"]')?.getAttribute('content')?.trim() || '';
const GH_LABEL = encodeURIComponent(document.querySelector('meta[name="gh-label"]')?.getAttribute('content')?.trim() || 'feedback');

function ghIssuesListURL(){
  return `https://github.com/${GH_OWNER}/${GH_REPO}/issues?q=is%3Aissue+label%3A${GH_LABEL}`;
}
function ghNewIssueURL(row){
  const title = encodeURIComponent(`[${row.cat}] 문의/피드백: ${row.q}`.slice(0,250));
  const body = encodeURIComponent(`다음 항목에 대한 의견/보완 제안을 남겨주세요.

- 카테고리: ${row.cat}
- 질문: ${row.q}
- 가이드(초안):
${row.a}

메모: (자유 기재)

페이지: ${location.href}
시간: ${new Date().toLocaleString('ko-KR', {hour12:false})}`);
  const base = `https://github.com/${GH_OWNER}/${GH_REPO}/issues/new`;
  return `${base}?title=${title}&body=${body}&labels=${GH_LABEL}`;
}

/* ---------------- 유틸 ---------------- */
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
function parseSearch(q){
  q = (q||'').trim();
  const cat = []; const not = []; const words=[];
  const re = /(\b카테고리:"([^"]+)"|\-키워드:"([^"]+)"|("[^"]+"|\S+))/g;
  let m;
  while((m=re.exec(q))){
    if(m[2]) cat.push(m[2].trim());
    else if(m[3]) not.push(m[3].trim().toLowerCase());
    else{
      const w = m[1].replace(/^"|"$|^'|'$/g,'').trim();
      if(w) words.push(w.toLowerCase());
    }
  }
  return {cat,not,words};
}
function highlight(html, terms){
  if(!terms || !terms.length) return html;
  let out = html;
  terms.forEach(t=>{
    const safe = t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    out = out.replace(new RegExp(safe,'gi'), m=>`<mark>${m}</mark>`);
  });
  return out;
}
function filteredRows(){
  const termRaw = (els.search?.value||"").trim();
  const parsed = parseSearch(termRaw);
  const terms = (parsed.words||[]).filter(Boolean);
  const rows = view.filter(r=>{
    if(activeCats.size && !activeCats.has(r.cat)) return false;
    if(parsed.cat.length && !parsed.cat.includes(r.cat)) return false;
    const hay = (r.q+" "+r.a+" "+r.cat).toLowerCase();
    if(parsed.not.some(n=>hay.includes(n))) return false;
    if(!terms.length) return true;
    return terms.every(w=>hay.includes(w));
  });
  return {rows,terms};
}

/* ---------------- 렌더 ---------------- */
function renderChips(){
  if(!els.chips) return;
  els.chips.innerHTML = `<button class="chip" id="chipReset" type="button">필터 해제</button>` +
    CATS.map(c=>`<button class="chip" data-cat="${c}" type="button">${c}</button>`).join('');
  document.getElementById('chipReset')?.addEventListener('click', ()=>{ activeCats.clear(); syncChips(); page=1; render(); });
  els.chips.querySelectorAll('.chip[data-cat]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const c = btn.dataset.cat;
      activeCats.has(c) ? activeCats.delete(c) : activeCats.add(c);
      syncChips(); page=1; render();
    });
  });
  syncChips();
}
function syncChips(){
  els.chips?.querySelectorAll('.chip[data-cat]').forEach(b=> b.classList.toggle('active', activeCats.has(b.dataset.cat)));
}
function rowHtml(r, terms){
  const qHtml = highlight(escapeHTML(r.q), terms);
  const aHtml = highlight(escapeHTML(r.a||'').replace(/\n/g,'<br>'), terms);
  return `<tr>
    <td data-h="#">${r.idx}</td>
    <td data-h="민원 사례"><span class="q">${qHtml}</span> <span class="cat">${r.cat}</span></td>
    <td data-h="가이드"><div class="resp">${aHtml}</div></td>
    <td data-h="의견">
      <div class="row-actions">
        <button class="btn primary open-issue" data-idx="${r.idx}" type="button">의견 남기기</button>
        <a class="btn outlined" href="${ghIssuesListURL()}" target="_blank" rel="noopener">피드백 보기</a>
      </div>
    </td>
  </tr>`;
}
function bindRowEvents(){
  document.querySelectorAll('.open-issue').forEach(b=>{
    b.addEventListener('click', ()=>{
      const idx = Number(b.dataset.idx);
      const row = view.find(v=>v.idx===idx);
      if(!row) return;
      if(!GH_OWNER || !GH_REPO){
        alert('깃허브 저장소 메타(meta[gh-owner], meta[gh-repo])를 설정해 주세요.');
        return;
      }
      window.open(ghNewIssueURL(row), '_blank', 'noopener');
    });
  });
}
function render(){
  const {rows, terms} = filteredRows();
  els.total && (els.total.textContent = view.length);
  els.shown && (els.shown.textContent = rows.length);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  if(page > pages) page = pages;
  const start = (page-1) * pageSize;
  const slice = rows.slice(start, start + pageSize);

  els.tbody.innerHTML = slice.map(r=>rowHtml(r, terms)).join('') ||
    `<tr><td colspan="4" style="padding:18px">검색 조건에 맞는 결과가 없습니다.</td></tr>`;
  els.pageInfo && (els.pageInfo.textContent = `${page}/${pages}`);
  if(els.prev) els.prev.disabled = (page<=1);
  if(els.next) els.next.disabled = (page>=pages);

  bindRowEvents();
}

/* ---------------- 진단 배지 ---------------- */
function badge(text, ok=true){
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = `position:fixed;right:10px;bottom:10px;z-index:9999;
    background:${ok?'#0B57D0':'#B3261E'};color:#fff;padding:6px 10px;border-radius:12px;
    font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.2)`;
  document.body.appendChild(el); setTimeout(()=>el.remove(), 3000);
}

/* ---------------- cases.json 로더(경로 자동 탐색) ---------------- */
async function tryFetch(url){
  try{
    const r = await fetch(url, {cache:'no-store'});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if(Array.isArray(data) && data.length) return data;
    throw new Error('empty array');
  }catch(e){
    console.warn('[Impact] fetch failed:', url, e);
    return null;
  }
}

async function loadCases(){
  const owner = GH_OWNER || location.hostname.split('.')[0]; // dao-codes
  const repo  = GH_REPO  || location.pathname.split('/').filter(Boolean)[0] || 'Impact';
  const abs   = `https://${owner}.github.io/${repo}/cases.json`;

  const basePath = location.pathname.replace(/[^/]+$/, ''); // 현재 폴더
const candidates = [
  CASES_URL_ABSOLUTE,      // ← 1순위: 절대경로
  abs,                     // 기존 자동 추정 절대경로
  './cases.json',
  'cases.json',
  `${basePath}cases.json`,
  `${location.origin}${basePath}cases.json`
].filter((v,i,arr)=>arr.indexOf(v)===i);

  for(const u of candidates){
    const data = await tryFetch(u);
    if(data){
      console.info('[Impact] cases loaded from:', u, 'count=', data.length);
      badge(`로딩: ${data.length}건`, true);
      return data;
    }
  }
  badge('cases.json 로드 실패(콘솔 확인)', false);
  alert('cases.json을 찾지 못했습니다. index.html과 같은 폴더에 두셨는지 확인해 주세요.');
  return [];
}

/* ---------------- 이벤트 ---------------- */
els.search?.addEventListener('input', ()=>{ page=1; render(); });
els.prev?.addEventListener('click', ()=>{ if(page>1){ page--; render(); } });
els.next?.addEventListener('click', ()=>{ page++; render(); });
els.pageSize?.addEventListener('change', ()=>{ pageSize = Number(els.pageSize.value)||50; page=1; render(); });
els.toggleTheme?.addEventListener('click', ()=>{
  const root = document.documentElement;
  const mode = root.getAttribute('data-theme');
  root.setAttribute('data-theme', mode==='dark' ? 'auto' : 'dark');
});
els.openIssues?.addEventListener('click', ()=>{
  if(!GH_OWNER || !GH_REPO){ alert('깃허브 저장소 메타(meta[gh-owner], meta[gh-repo])를 설정해 주세요.'); return; }
  window.open(ghIssuesListURL(), '_blank', 'noopener');
});

/* ---------------- 시작 ---------------- */
renderChips();
loadCases().then(cases=>{
  view = cases.map((d,i)=>({idx:i+1, q:d.q, cat:d.cat, a:RESPONSES[d.cat]||RESPONSES["기타"]}));
  page = 1;
  render();
});
