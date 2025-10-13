
/* ================= 템플릿(표준문안) ================= */
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

/* ================= 데이터(100건) ================= */
const CASES = [
  {q:"프로그램은 왜 주말에 안하나요?",cat:"운영시간/공간"},
  {q:"다른 센터는 저녁에도 대관이 가능한데 왜 안되나요?",cat:"운영시간/공간"},
  {q:"프로그램이 주말에 없어서 들을 수 없어요",cat:"운영시간/공간"},
  {q:"점심시간에도 상담이 가능했으면 합니다",cat:"운영시간/공간"},
  {q:"공휴일에 문을 열 수 없나요?",cat:"운영시간/공간"},
  {q:"스터디룸은 왜 평일 9~18시까지만 운영하나요?",cat:"운영시간/공간"},
  {q:"공간이 작아 이용이 어려워요",cat:"운영시간/공간"},
  {q:"성수역에서 오기 힘든 위치예요",cat:"운영시간/공간"},
  {q:"혼잡 시간대가 너무 붐빕니다",cat:"운영시간/공간"},
  {q:"대관 안내가 부족합니다",cat:"운영시간/공간"},
  {q:"왜 프로그램 선발이 되지 않았나요?",cat:"선발/절차"},
  {q:"프로그램 신청했는데 왜 탈락했죠? 매달 지원했는데도요?",cat:"선발/절차"},
  {q:"합격 기준이 모호해요",cat:"선발/절차"},
  {q:"선발 결과를 빨리 알고 싶어요",cat:"선발/절차"},
  {q:"가점 기준을 공개해 주세요",cat:"선발/절차"},
  {q:"선발 과정을 공개하지 않으면 민원을 넣겠습니다",cat:"선발/절차"},
  {q:"전 기수 참여자는 지원하면 안 되는 거 아닌가요?",cat:"선발/절차"},
  {q:"지인 추천 있나요? 불공정한 것 같아요",cat:"선발/절차"},
  {q:"특정 학교만 유리한가요?",cat:"선발/절차"},
  {q:"추첨 방식이 공정한가요?",cat:"선발/절차"},
  {q:"구직신청서는 왜 받는거죠? 개인정보가 보호되나요?",cat:"개인정보/마케팅"},
  {q:"프로그램에 선정되지 않았으니 신청서류를 바로 삭제해 주세요",cat:"개인정보/마케팅"},
  {q:"(마케팅 동의 잊음) 프로그램 광고 문자가 와요",cat:"개인정보/마케팅"},
  {q:"동의 철회했는데 또 연락이 와요",cat:"개인정보/마케팅"},
  {q:"포털 도메인 이메일로 받으면 보안이 안전한가요?",cat:"개인정보/마케팅"},
  {q:"서류는 어디에 보관하나요?",cat:"개인정보/마케팅"},
  {q:"파기 시점이 궁금합니다",cat:"개인정보/마케팅"},
  {q:"개인정보 열람 범위가 불안합니다",cat:"개인정보/마케팅"},
  {q:"마케팅 수신 동의 내역을 확인할 수 있나요?",cat:"개인정보/마케팅"},
  {q:"수신 거부는 어떻게 하나요?",cat:"개인정보/마케팅"},
  {q:"메이크업 시간이 짧고 생각보다 별로예요",cat:"프로그램 품질"},
  {q:"강의 속도가 너무 빨라요",cat:"프로그램 품질"},
  {q:"실습 자료가 부족해요",cat:"프로그램 품질"},
  {q:"Q&A 시간이 짧아요",cat:"프로그램 품질"},
  {q:"강사님 예시가 지나치게 광고 같아요",cat:"프로그램 품질"},
  {q:"콘텐츠 난이도가 맞지 않아요",cat:"프로그램 품질"},
  {q:"교육 목표가 불명확해요",cat:"프로그램 품질"},
  {q:"현장 운영이 혼잡했어요",cat:"프로그램 품질"},
  {q:"사전 안내와 실제가 달라요",cat:"프로그램 품질"},
  {q:"온라인 접속 품질이 떨어졌어요",cat:"프로그램 품질"},
  {q:"강사님 포트폴리오에 본인 온라인 강의/저서가 있어요. 광고인가요?",cat:"공정성/청렴성"},
  {q:"리워드(기프티콘) 주면 공공기관이 문제 아닌가요? 선거법 위반 같아요",cat:"공정성/청렴성"},
  {q:"협찬 표기가 안 보였어요",cat:"공정성/청렴성"},
  {q:"이해충돌 관리가 되는지 궁금해요",cat:"공정성/청렴성"},
  {q:"평가/감사는 누가 하나요?",cat:"공정성/청렴성"},
  {q:"지인에게 유리하게 운영하는 것 같아요",cat:"공정성/청렴성"},
  {q:"나랏돈인데 간식 먹으면 안 되는 거 아닌가요?",cat:"공정성/청렴성"},
  {q:"광고/홍보가 과합니다",cat:"공정성/청렴성"},
  {q:"후원사 공개가 필요해요",cat:"공정성/청렴성"},
  {q:"선거기간에 홍보 문구 괜찮나요?",cat:"공정성/청렴성"},
  {q:"상담사가 젊어서 신뢰가 안가요. 자격 있는 분 맞나요?",cat:"상담"},
  {q:"상담사가 제 이야기를 너무 많이 알아서 불안해요. 변경해 주세요",cat:"상담"},
  {q:"후속 상담 예약은 어떻게 하나요?",cat:"상담"},
  {q:"상담 시간이 너무 짧았어요",cat:"상담"},
  {q:"맞춤 조언이 부족했어요",cat:"상담"},
  {q:"기록은 얼마나 보관하나요?",cat:"상담"},
  {q:"대면 대신 전화 상담 가능한가요?",cat:"상담"},
  {q:"상담 전 설문이 너무 깁니다",cat:"상담"},
  {q:"상담 리포트 공유해 주세요",cat:"상담"},
  {q:"상담 중 녹음 가능한가요?",cat:"상담"},
  {q:"연락이 잘 안 돼서 민원 넣었습니다. 연락이 잘 되어야죠",cat:"연락/소통"},
  {q:"카카오톡을 안 쓰고 전화만 가능합니다. 전화로 안내해 주세요",cat:"연락/소통"},
  {q:"강사님께 질문 있어요. 전화번호 알려주세요",cat:"연락/소통"},
  {q:"강사님이 기프티콘 보내신다 했는데 삭제했어요. 재연락 부탁",cat:"연락/소통"},
  {q:"이메일 답변이 늦어요",cat:"연락/소통"},
  {q:"문자 알림이 오지 않았어요",cat:"연락/소통"},
  {q:"휴관 중 문의 대응이 느렸어요",cat:"연락/소통"},
  {q:"공지 채널이 너무 많아요",cat:"연락/소통"},
  {q:"전화 연결이 어렵습니다",cat:"연락/소통"},
  {q:"우편 안내를 받고 싶어요",cat:"연락/소통"},
  {q:"(스터디 종료 후 슬랙 삭제) 백업 못했어요. 파일 보내주세요",cat:"자료/콘텐츠"},
  {q:"수업 녹화본을 볼 수 있나요?",cat:"자료/콘텐츠"},
  {q:"교안이 열리지 않아요",cat:"자료/콘텐츠"},
  {q:"링크가 만료됐어요",cat:"자료/콘텐츠"},
  {q:"배포 자료의 저작권이 걱정돼요",cat:"자료/콘텐츠"},
  {q:"과제 제출 형식이 어려워요",cat:"자료/콘텐츠"},
  {q:"재수강 자료 제공 가능한가요?",cat:"자료/콘텐츠"},
  {q:"요약본만 받을 수 있나요?",cat:"자료/콘텐츠"},
  {q:"자료 출처 표기가 부족해요",cat:"자료/콘텐츠"},
  {q:"콘텐츠 접근성이 떨어져요(자막 등)",cat:"자료/콘텐츠"},
  {q:"더워서 상담 받기 어려워요. 내일 가도 되나요?",cat:"공간/환경"},
  {q:"의자가 불편해요",cat:"공간/환경"},
  {q:"와이파이가 자주 끊겨요",cat:"공간/환경"},
  {q:"소음이 심해요",cat:"공간/환경"},
  {q:"청결 관리가 아쉽습니다",cat:"공간/환경"},
  {q:"장애인 접근성이 부족해요",cat:"공간/환경"},
  {q:"콘센트가 부족합니다",cat:"공간/환경"},
  {q:"화장실 안내가 부족합니다",cat:"공간/환경"},
  {q:"출입 인증이 번거로워요",cat:"공간/환경"},
  {q:"사물함 이용 안내가 필요합니다",cat:"공간/환경"},
  {q:"금일까지 제출이라 했는데 왜 늦었다고 하나요? 금-일 아닌가요?",cat:"일정/기한"},
  {q:"일정이 자주 바뀌어요",cat:"일정/기한"},
  {q:"캘린더 연동이 되나요?",cat:"일정/기한"},
  {q:"리마인드가 부족해요",cat:"일정/기한"},
  {q:"타임존 표기가 헷갈립니다",cat:"일정/기한"},
  {q:"현장/온라인 전환 안내가 늦었습니다",cat:"일정/기한"},
  {q:"모집 기간이 너무 짧아요",cat:"일정/기한"},
  {q:"결과 발표 시간이 불명확해요",cat:"일정/기한"},
  {q:"변경 이력 공지가 필요합니다",cat:"일정/기한"},
  {q:"휴일 접수 기준을 알려주세요",cat:"일정/기한"},
  {q:"이 사업은 어디서 받은 건가요?",cat:"기관 신뢰성"},
  {q:"여기 신천지예요?",cat:"기관 신뢰성"},
  {q:"운영 주체가 어디인가요?",cat:"기관 신뢰성"},
  {q:"후원사는 누군가요?",cat:"기관 신뢰성"},
  {q:"평가 결과를 공개하나요?",cat:"기관 신뢰성"},
  {q:"민원 처리 체계를 알고 싶어요",cat:"기관 신뢰성"},
  {q:"홈페이지 정보가 부정확합니다",cat:"기관 신뢰성"},
  {q:"포스터의 교육단체는 뭐하는 곳이죠?",cat:"기관 신뢰성"},
  {q:"담당자 익명성이 필요한가요?",cat:"기관 신뢰성"},
  {q:"예산 집행 내역을 보고 싶어요",cat:"기관 신뢰성"},
  {q:"다른 지역 사람이 있는데 서울 사람만 참여 아닌가요?",cat:"참여 자격"},
  {q:"나이 제한이 있나요?",cat:"참여 자격"},
  {q:"재참여 가능한가요?",cat:"참여 자격"},
  {q:"타지역인데 참여해도 되나요?",cat:"참여 자격"},
  {q:"학생도 참여 가능합니까?",cat:"참여 자격"},
  {q:"재직자도 참여 가능한가요?",cat:"참여 자격"},
  {q:"휴학생은 어떻게 되나요?",cat:"참여 자격"},
  {q:"외국인은 참여할 수 있나요?",cat:"참여 자격"},
  {q:"대리 신청이 가능한가요?",cat:"참여 자격"},
  {q:"가족이 대신 듣고 인증해도 되나요?",cat:"참여 자격"},
  {q:"기념품 수령 방법이 궁금해요",cat:"리워드/경품"},
  {q:"세금 처리가 필요한가요?",cat:"리워드/경품"},
  {q:"추첨 방식이 공정한가요?",cat:"리워드/경품"},
  {q:"기프티콘 재전송 가능할까요?",cat:"리워드/경품"},
  {q:"리워드 단가가 적정한가요?",cat:"리워드/경품"},
  {q:"지급 기한이 궁금합니다",cat:"리워드/경품"},
  {q:"현물/현금 전환이 가능한가요?",cat:"리워드/경품"},
  {q:"후원 리워드 표기는 어떻게 하나요?",cat:"리워드/경품"},
  {q:"리워드 대상 기준을 알려주세요",cat:"리워드/경품"},
  {q:"선거기간 리워드 지급 괜찮나요?",cat:"리워드/경품"},
  {q:"구글폼에 들어갔는데 안 들어가져요",cat:"보안/시스템"},
  {q:"구글폼 작성했는데 내용이 날아갔어요",cat:"보안/시스템"},
  {q:"폼 저장이 안돼요",cat:"보안/시스템"},
  {q:"모바일에서 화면이 깨져 보여요",cat:"보안/시스템"},
  {q:"접속이 자주 끊겨요",cat:"보안/시스템"},
  {q:"인증 메일이 오지 않습니다",cat:"보안/시스템"},
  {q:"파일 업로드가 실패합니다",cat:"보안/시스템"},
  {q:"링크가 비공개로 되어 있어요",cat:"보안/시스템"},
  {q:"포털 로그인 보안이 걱정됩니다",cat:"보안/시스템"},
  {q:"시스템 점검 시간 공지가 필요합니다",cat:"보안/시스템"}
];

/* ================= 상태/뷰 ================= */
const CATS = ["운영시간/공간","선발/절차","개인정보/마케팅","프로그램 품질","공정성/청렴성","상담","연락/소통","자료/콘텐츠","공간/환경","일정/기한","기관 신뢰성","참여 자격","리워드/경품","보안/시스템","기타"];
const STATUS = ["대기","진행","완료"]; // 뱃지용

const T = document.getElementById('tbody');
const Q = document.getElementById('q');
const QHIST = document.getElementById('qhist');
const COUNT = document.getElementById('count');
const VER = document.getElementById('ver');
const LOGO = document.getElementById('logo');
const ORG_TITLE = document.getElementById('orgTitle');
const TOAST = document.getElementById('toast');
const CHIPS = document.getElementById('chips');
const ACTIVE = document.getElementById('activeFilters');
const statsList = document.getElementById('statsList');
const kpiTotal = document.getElementById('kpiTotal');
const kpiSelected = document.getElementById('kpiSelected');
const bellBadge = document.getElementById('bellBadge');
const FAB = document.getElementById('fab');

let editMode = false;
let adminMode = false;
let activeCats = new Set();
let lastEdited = null;
let undoTimer = null;
let lastSnapshot = null;

/* 페이징 */
let page = 1;
let pageSize = 25;

/* 뷰 모델 (상태 필드 추가) */
function responseFor(cat){ return RESPONSES[cat] || RESPONSES["기타"]; }
function sanitizeQuestion(t){ return String(t||"").replace(/^\s*\[?문의\]?\s*:?/i,'').trim(); }
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
let view = [...CASES].map((d,i)=>({idx:i+1, q:d.q, cat:d.cat, a:responseFor(d.cat), sel:false, st:"대기"}));

/* ================= 저장/불러오기 ================= */
const SAVE_KEY = 'complaints_edits_v35';
const PREF_KEY = 'complaints_prefs_v35';
const QHIST_KEY = 'complaints_qhist_v35';
function saveEdits(){
  try{
    const data = { items:view.map(v=>({idx:v.idx, q:v.q, a:v.a, cat:v.cat, sel:v.sel, st:v.st})), savedAt:new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }catch(e){ toast('저장 공간 접근에 문제가 있습니다. 브라우저 설정을 확인해 주세요.'); }
}
function loadEdits(){
  try{
    const raw = localStorage.getItem(SAVE_KEY); if(!raw) return;
    const data = JSON.parse(raw);
    if(!Array.isArray(data.items)) return;
    const map = new Map(data.items.map(x=>[x.idx,x]));
    view = view.map(v=>{ const m=map.get(v.idx); return m?{...v,a:m.a??v.a,sel:!!m.sel,st:m.st||"대기"}:v; });
    lastEdited = data.savedAt ? new Date(data.savedAt) : null;
  }catch(e){}
}
function clearEdits(){
  snapshot(); // undo backup
  localStorage.removeItem(SAVE_KEY);
  view = [...CASES].map((d,i)=>({idx:i+1, q:d.q, cat:d.cat, a:responseFor(d.cat), sel:false, st:"대기"}));
  toast('자동저장된 편집본을 초기화했습니다. (5초 내 취소 가능)');
  startUndo();
  render();
}
function savePrefs(){
  const data = {
    org: els.orgInp.value || '',
    brandMain: els.brandMain.value,
    brandSub: els.brandSub.value,
    theme: document.documentElement.getAttribute('data-theme') || 'auto',
    pageSize,
    adminMode
  };
  localStorage.setItem(PREF_KEY, JSON.stringify(data));
  toast('설정을 저장했습니다.');
}
function loadPrefs(){
  try{
    const raw = localStorage.getItem(PREF_KEY); if(!raw) return;
    const d = JSON.parse(raw);
    els.orgInp.value = d.org || '';
    els.brandMain.value = d.brandMain || '#0B57D0';
    els.brandSub.value = d.brandSub || '#6C92F4';
    ORG_TITLE.firstChild.nodeValue = (d.org || '청년센터 컴플레인 사례집 ');
    applyBrand();
    setTheme(d.theme || 'auto');
    adminMode = !!d.adminMode;
    updateAdminUI();
    if(d.pageSize){ els.pageSize.value = d.pageSize; pageSize = Number(d.pageSize)||25; }
  }catch(e){}
}
function pushQHist(q){
  if(!q) return;
  let arr = []; try{ arr = JSON.parse(localStorage.getItem(QHIST_KEY))||[] }catch{};
  arr = [q, ...arr.filter(x=>x!==q)].slice(0,10);
  localStorage.setItem(QHIST_KEY, JSON.stringify(arr));
  renderQHist();
}
function renderQHist(){
  let arr = []; try{ arr = JSON.parse(localStorage.getItem(QHIST_KEY))||[] }catch{};
  QHIST.innerHTML = arr.map(x=>`<option value="${escapeHTML(x)}">`).join('');
}

/* Undo (5s) */
function snapshot(){ lastSnapshot = JSON.stringify({view,lastEdited}); }
function startUndo(){
  const undo = document.createElement('div');
  undo.className = 'msg';
  undo.innerHTML = '작업을 실행 취소할까요? <button id="undoBtn" class="btn ghost" style="margin-left:8px">Undo</button>';
  TOAST.appendChild(undo);
  clearTimeout(undoTimer);
  undoTimer = setTimeout(()=>{ undo.remove(); lastSnapshot=null; }, 5000);
  document.getElementById('undoBtn').onclick = ()=>{
    if(lastSnapshot){
      const snap = JSON.parse(lastSnapshot);
      view = snap.view; lastEdited = snap.lastEdited;
      render(); saveEdits();
    }
    clearTimeout(undoTimer); undo.remove(); lastSnapshot=null;
  };
}

/* ================= 칩/필터 ================= */
function renderChips(){
  CHIPS.innerHTML = `<button class="chip" id="chipReset">필터 해제</button> ` +
    CATS.map(c=>`<button class="chip" data-cat="${c}" aria-pressed="false">${c}</button>`).join('');
  CHIPS.querySelector('#chipReset').onclick = ()=>{ activeCats.clear(); syncChips(); page=1; render(); };
  CHIPS.querySelectorAll('.chip[data-cat]').forEach(btn=>{
    btn.onclick = ()=>{
      const c = btn.dataset.cat;
      const active = !activeCats.has(c);
      if(active) activeCats.add(c); else activeCats.delete(c);
      syncChips(); page=1; render();
    };
  });
  syncChips();
}
function syncChips(){
  CHIPS.querySelectorAll('.chip[data-cat]').forEach(b=>{
    const on = activeCats.has(b.dataset.cat);
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  ACTIVE.innerHTML = activeCats.size
    ? `현재 필터: ${[...activeCats].map(c=>`<span class="tag">${c} <button class="btn ghost" style="padding:0 6px" onclick="removeFilter('${c.replace(/'/g,"\\'")}')">×</button></span>`).join('')}`
    : '';
}
function removeFilter(c){ activeCats.delete(c); syncChips(); page=1; render(); }

/* ================= 도우미 ================= */
function debounce(fn, wait=150){ let t; return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait); }; }
function toast(msg, timeout=2200){
  const el = document.createElement('div'); el.className='msg'; el.textContent = msg;
  TOAST.appendChild(el); setTimeout(()=>el.remove(), timeout);
}
function nowKR(){ return new Date().toLocaleString('ko-KR', {hour12:false}); }
function stamp(){ const d=new Date(),p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`; }
function documentTitle(){ return ORG_TITLE.innerText.replace(/\s+/g,' ').trim() || '컴플레인 사례집'; }

/* 고급 검색 파서: 카테고리:"상담" -키워드:"주말" 일반 단어 */
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

/* 하이라이트 */
function highlight(html, terms){
  if(!terms || !terms.length) return html;
  let out = html;
  terms.forEach(t=>{
    const safe = t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    out = out.replace(new RegExp(safe,'gi'), m=>`<mark>${m}</mark>`);
  });
  return out;
}

/* ================= 렌더 ================= */
function statusBadge(st){
  if(st==="완료") return `<span class="badge done"><span class="icon">task_alt</span>완료</span>`;
  if(st==="진행") return `<span class="badge doing"><span class="icon">schedule</span>진행</span>`;
  return `<span class="badge wait"><span class="icon">pending</span>대기</span>`;
}
function rowHtml(r, terms){
  const selClass = r.sel ? 'selected' : '';
  const qHtml = highlight(escapeHTML(sanitizeQuestion(r.q)), terms);
  const aHtml = highlight(escapeHTML(r.a||'').replace(/\n/g,'<br>'), terms);
  const stSel = STATUS.map(s=>`<option value="${s}" ${s===r.st?'selected':''}>${s}</option>`).join('');
  return `<tr class="${selClass}">
    <td class="checkbox"><label><input aria-label="선택" type="checkbox" class="sel" ${r.sel?'checked':''}></label></td>
    <td data-l="번호">${r.idx}</td>
    <td data-l="민원 사례">${qHtml} <span class="chip" style="margin-left:6px">${r.cat}</span></td>
    <td data-l="상태">${statusBadge(r.st)}<div>${editMode?`<select class="stSel" style="margin-top:6px;border:1px solid var(--line);border-radius:12px;padding:6px 8px">${stSel}</select>`:''}</div></td>
    <td data-l="응답"><div class="resp" ${editMode?'contenteditable="true"':''} role="${editMode?'textbox':'note'}" aria-multiline="true">${aHtml}</div></td>
  </tr>`;
}
function filteredRows(){
  const termRaw = (Q.value||"").trim();
  const parsed = parseSearch(termRaw);
  const terms = (parsed.words||[]).filter(Boolean);
  return {
    rows: view.filter(r=>{
      if(activeCats.size && !activeCats.has(r.cat)) return false;
      if(parsed.cat.length && !parsed.cat.includes(r.cat)) return false;
      const hay = (r.q+" "+r.a+" "+r.cat+" "+r.st).toLowerCase();
      if(parsed.not.some(n=>hay.includes(n))) return false;
      if(!terms.length) return true;
      return terms.every(w=>hay.includes(w));
    }),
    terms
  };
}
function renderStats(rows){
  const counts = {};
  CATS.forEach(c=>counts[c]=0);
  rows.forEach(r=>counts[r.cat]=(counts[r.cat]||0)+1);
  const total = rows.length || 1;
  statsList.innerHTML = CATS.map(c=>{
    const n = counts[c]||0; const pct = Math.round(n*100/total);
    return `<div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>${c}</span><span>${n}건 (${pct}%)</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
    </div>`;
  }).join('');
}
function render(){
  const {rows,terms} = filteredRows();
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if(page > pages) page = pages;
  const start = (page-1)*pageSize;
  const slice = rows.slice(start, start+pageSize);

  T.innerHTML = slice.map(r=>rowHtml(r, terms)).join("") || `<tr><td colspan="5"><div class="card" style="margin:12px">검색 조건에 맞는 결과가 없습니다. <button class="btn ghost" onclick="resetFilters()">필터 초기화</button></div></td></tr>`;
  bindRowEvents();

  // 카운트 / KPI
  const selected = view.filter(v=>v.sel).length;
  COUNT.innerHTML = `<span>전체 <b>${view.length}</b></span> · <span>표시 <b>${rows.length}</b></span> · <span>선택 <b>${selected}</b></span>`;
  kpiTotal.textContent = view.length;
  kpiSelected.textContent = selected;

  // 페이저
  document.getElementById('pageInfo').textContent = `${page} / ${pages}`;
  document.getElementById('prev').disabled = (page<=1);
  document.getElementById('next').disabled = (page>=pages);

  // 내보내기 버튼 상태
  const dis = (selected===0);
  els.printSel.disabled = dis; els.pdfSel.disabled = dis; els.csvSel.disabled = dis; els.restoreSel.disabled = dis;

  // 통계
  renderStats(rows);

  // 모바일 FAB 표시
  const isMobile = matchMedia("(max-width: 860px)").matches;
  FAB.style.display = isMobile ? 'flex' : 'none';

  // 알림 뱃지(선택 수를 알림으로 가볍게 활용)
  bellBadge.style.display = selected? 'flex':'none';
  bellBadge.textContent = selected;
}
function resetFilters(){
  activeCats.clear(); Q.value=''; renderChips(); render();
}
function bindRowEvents(){
  // 선택
  T.querySelectorAll('.sel').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const tr = cb.closest('tr'); const idx = Number(tr.querySelector('[data-l="번호"]').textContent.trim());
      const obj = view.find(v=>v.idx===idx);
      if(obj){ obj.sel = cb.checked; tr.classList.toggle('selected', cb.checked); saveEdits(); render(); }
    });
  });
  // 상태 변경
  if(editMode){
    T.querySelectorAll('.stSel').forEach(sel=>{
      sel.addEventListener('change', ()=>{
        const tr = sel.closest('tr'); const idx = Number(tr.querySelector('[data-l="번호"]').textContent.trim());
        const obj = view.find(v=>v.idx===idx);
        if(obj){ obj.st = sel.value; markEdited(); saveEdits(); render(); }
      });
    });
    // 응답 편집
    T.querySelectorAll('.resp').forEach(div=>{
      div.addEventListener('blur', ()=>{
        const row = div.closest('tr'); const idx = Number(row.querySelector('[data-l="번호"]').textContent.trim());
        const obj = view.find(v=>v.idx===idx);
        if(obj){ obj.a = div.innerText; markEdited(); saveEdits(); }
      });
      div.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ div.blur(); }});
    });
  }
}

/* ================= 엘리먼트, 테마/정렬 ================= */
const els = {
  logoInp: document.getElementById('logoInp'),
  orgInp: document.getElementById('orgInp'),
  brandMain: document.getElementById('brandMain'),
  brandSub: document.getElementById('brandSub'),
  themeLight: document.getElementById('themeLight'),
  themeDark: document.getElementById('themeDark'),
  themeAuto: document.getElementById('themeAuto'),
  alignL: document.getElementById('alignL'),
  alignC: document.getElementById('alignC'),
  savePrefs: document.getElementById('savePrefs'),
  adminOff: document.getElementById('adminOff'),
  adminOn: document.getElementById('adminOn'),
  adminData: document.getElementById('adminData'),
  exportBtn: document.getElementById('exportBtn'),
  exportMenu: document.getElementById('exportMenu'),
  printSel: document.getElementById('printSel'),
  pdfSel: document.getElementById('pdfSel'),
  csvSel: document.getElementById('csvSel'),
  modeView: document.getElementById('modeView'),
  modeEdit: document.getElementById('modeEdit'),
  pageSize: document.getElementById('pageSize'),
  clearEdits: document.getElementById('clearEdits'),
  selAll: document.getElementById('selAll'),
  selNone: document.getElementById('selNone'),
  restoreSel: document.getElementById('restoreSel'),
  toggleFilters: document.getElementById('toggleFilters'),
  bell: document.getElementById('bell'),
  fabExport: document.getElementById('fabExport'),
  fabRestore: document.getElementById('fabRestore')
};
function applyBrand(){
  document.documentElement.style.setProperty('--md-sys-color-primary', els.brandMain.value || '#0B57D0');
  document.documentElement.style.setProperty('--md-sys-color-secondary', els.brandSub.value || '#6C92F4');
  document.documentElement.style.setProperty('--brand', getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary'));
}
function setTheme(mode){
  document.documentElement.setAttribute('data-theme', mode);
  markTheme(mode);
}
function markTheme(mode){
  els.themeLight.classList.toggle('active', mode==='light');
  els.themeDark.classList.toggle('active', mode==='dark');
  els.themeAuto.classList.toggle('active', mode==='auto');
}
function setAlign(where){
  document.body.classList.remove('align-left','align-center');
  document.body.classList.add(where==='center' ? 'align-center' : 'align-left');
  els.alignL.classList.toggle('active', where!=='center');
  els.alignC.classList.toggle('active', where==='center');
}
function setMode(edit){
  editMode = !!edit;
  els.modeView.classList.toggle('active', !editMode);
  els.modeEdit.classList.toggle('active', editMode);
  render();
  toast(editMode?'✏️ 편집 모드':'👁 보기 모드');
}
function updateAdminUI(){
  els.adminOff.classList.toggle('active', !adminMode);
  els.adminOn.classList.toggle('active', adminMode);
  els.adminData.style.display = adminMode ? '' : 'none';
}

/* ================= 이벤트 ================= */
els.logoInp.onchange = (e)=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); LOGO.src=url; LOGO.style.display='inline-block'; toast('로고를 적용했습니다.'); };
els.orgInp.oninput = ()=>{ ORG_TITLE.firstChild.nodeValue = els.orgInp.value || '청년센터 컴플레인 사례집 '; markEdited(); saveEdits(); };
els.brandMain.oninput = els.brandSub.oninput = ()=>{ applyBrand(); markEdited(); saveEdits(); };

els.themeLight.onclick = ()=>{ setTheme('light'); toast('라이트 모드'); };
els.themeDark.onclick = ()=>{ setTheme('dark'); toast('다크 모드'); };
els.themeAuto.onclick = ()=>{ setTheme('auto'); toast('시스템 자동'); };

els.alignL.onclick = ()=> { setAlign('left'); toast('타이틀 좌정렬'); };
els.alignC.onclick = ()=> { setAlign('center'); toast('타이틀 가운데 정렬'); };

els.adminOff.onclick = ()=>{ adminMode=false; updateAdminUI(); savePrefs(); };
els.adminOn.onclick  = ()=>{ adminMode=true;  updateAdminUI(); savePrefs(); };

els.savePrefs.onclick = savePrefs;

els.selAll.onclick = ()=>{ filteredRows().rows.forEach(r=>r.sel=true); saveEdits(); render(); };
els.selNone.onclick = ()=>{ filteredRows().rows.forEach(r=>r.sel=false); saveEdits(); render(); };

els.restoreSel.onclick = ()=>{
  const sel = view.filter(v=>v.sel);
  if(!sel.length){ toast('복구할 항목을 선택해 주세요.'); return; }
  snapshot();
  sel.forEach(v=>{ v.a = responseFor(v.cat); v.st="대기"; });
  markEdited(); saveEdits(); render();
  toast('선택 항목을 초기 템플릿으로 복구했습니다. (5초 내 Undo 가능)');
  startUndo();
};

els.pageSize.onchange = (e)=>{ pageSize = Number(e.target.value)||25; page=1; render(); };
document.getElementById('prev').onclick = ()=>{ page=Math.max(1,page-1); render(); };
document.getElementById('next').onclick = ()=>{ page=page+1; render(); };

Q.oninput = debounce(()=>{ page=1; render(); }, 150);
Q.addEventListener('change', ()=> pushQHist(Q.value.trim()));
els.toggleFilters.onclick = ()=>{
  const open = els.toggleFilters.getAttribute('aria-expanded')!=='false';
  const panel = document.querySelector('.filters');
  panel.style.display = open ? 'none' : 'flex';
  els.toggleFilters.innerHTML = open ? '<span class="icon">unfold_more</span>&nbsp;펼치기' : '<span class="icon">unfold_less</span>&nbsp;접기';
  els.toggleFilters.setAttribute('aria-expanded', String(!open));
};
/* Export 드롭다운 */
function toggleExportMenu(e){
  e?.stopPropagation?.();
  const expanded = els.exportBtn.getAttribute('aria-expanded') === 'true';
  els.exportBtn.setAttribute('aria-expanded', String(!expanded));
  els.exportMenu.setAttribute('aria-hidden', String(expanded));
  if(!expanded){ els.exportMenu.querySelector('button')?.focus(); }
}
els.exportBtn.onclick = toggleExportMenu;
document.addEventListener('click', ()=>{ els.exportBtn.setAttribute('aria-expanded','false'); els.exportMenu.setAttribute('aria-hidden','true'); });

/* 인쇄/PDF/CSV */
function openPrintWindow(rows, title){
  const w = window.open('','', 'width=1100,height=900');
  if(!w){ toast('팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 시도하세요.'); return null; }
  const css = `
    <style>
      @page{size:A4;margin:12mm}
      body{font-family:맑은 고딕,system-ui,sans-serif;color:#111;padding:4px 8px}
      h2{margin:0 0 8px 0;color:#0f172a}
      .meta{font-size:11px;color:#555;margin:0 0 10px}
      .card{border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px;margin:0 0 10px 0;page-break-inside:avoid;break-inside:avoid}
      .q{font-weight:700;margin:0 0 6px 0;color:#0f172a}
      .st{font-size:12px;color:#0b4f2b;margin:0 0 6px 0}
      .a{white-space:pre-wrap;line-height:1.55}
      .wm{position:fixed;inset:auto 0 8mm 0;text-align:center;opacity:.35;font-size:10px}
    </style>`;
  const org = documentTitle();
  const meta = `<div class="meta">${org} · ${title} · 출력시각: ${nowKR()}${lastEdited?` · 마지막 수정: ${new Date(lastEdited).toLocaleString('ko-KR',{hour12:false})}`:''}</div>`;
  const head = `<h2>${org}</h2>`;
  const body = rows.map(r=>`<div class="card"><div class="q">${escapeHTML(sanitizeQuestion(r.q))}</div><div class="st">상태: ${r.st}</div><div class="a">${escapeHTML(r.a||'')}</div></div>`).join('');
  const wm = `<div class="wm">${org} — Complaints Handbook</div>`;
  w.document.write(`<html><head><title>${org} - ${title}</title>${css}</head><body>${head}${meta}${body}${wm}</body></html>`);
  w.document.close();
  return w;
}
function doPrint(){
  const items = view.filter(v=>v.sel);
  if(!items.length){ toast('인쇄할 항목을 선택해 주세요.'); return; }
  const w = openPrintWindow(items,'응답 생성(선택)'); if(w){ w.onload=()=>{ w.focus(); w.print(); }; }
}
function doPDF(){
  const items = view.filter(v=>v.sel);
  if(!items.length){ toast('PDF로 내보낼 항목을 선택해 주세요.'); return; }
  const w = openPrintWindow(items,'응답 생성(PDF 저장)'); if(w){ w.onload=()=>{ w.focus(); w.print(); toast('인쇄 대화상자에서 "PDF로 저장"을 선택하세요.'); }; }
}
function doCSV(){
  const items = view.filter(v=>v.sel);
  if(!items.length){ toast('CSV로 내보낼 항목을 선택해 주세요.'); return; }
  const esc = s=>('"'+String(s).replace(/"/g,'""').replace(/\n/g,' ')+'"');
  const rows = items.map(it=>[sanitizeQuestion(it.q), (it.a||''), it.st]);
  const header = '민원사례,응답내용,상태';
  const csv = ['sep=,', header].concat(rows.map(r=>[esc(r[0]), esc(r[1]), esc(r[2])].join(','))).join('\n');
  const org = (documentTitle().replace(/[^\p{L}\p{N}_ -]+/gu,'').trim() || 'complaints');
  const filename = `${org}_selected_${stamp()}.csv`;
  const blob = new Blob(["\ufeff"+csv],{type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('CSV로 내보냈습니다.');
}
els.printSel.onclick = doPrint;
els.pdfSel.onclick = doPDF;
els.csvSel.onclick = doCSV;

/* JSON (관리자) */
function currentData(){ return view.map(v=>({idx:v.idx, q:v.q, a:v.a, cat:v.cat, st:v.st})); }
const jsonFile = document.getElementById('jsonFile');
document.getElementById('exportJson')?.addEventListener('click', ()=>{
  const data = { meta:{ exportedAt:new Date().toISOString(), title: documentTitle() }, items: currentData() };
  const org = (documentTitle().replace(/[^\p{L}\p{N}_ -]+/gu,'').trim() || 'complaints');
  const filename = `${org}_export_${stamp()}.json`;
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('JSON으로 내보냈습니다.');
});
document.getElementById('importJson')?.addEventListener('click', ()=> jsonFile.click());
jsonFile?.addEventListener('change', (e)=>{
  const file = e.target.files?.[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(!Array.isArray(data.items)) throw new Error('items 배열이 없습니다');
      snapshot();
      view = data.items.map((it,i)=>({idx:it.idx || (i+1), q:it.q||'', a:(it.a||''), cat:it.cat||'기타', st:it.st||'대기', sel:false}));
      markEdited(); saveEdits(); page=1; render(); toast('JSON을 불러왔습니다. (5초 내 Undo 가능)'); startUndo();
    }catch(err){ toast('JSON 형식이 올바르지 않습니다.'); }
  };
  reader.readAsText(file,'utf-8');
});

/* 초기화/기타 */
function markEdited(){ lastEdited = new Date(); }
function initAfterSkeleton(){ renderChips(); renderQHist(); loadPrefs(); loadEdits(); render(); }

/* 최초 약간의 스켈레톤 후 렌더 */
setTimeout(initAfterSkeleton, 400);

/* 버전 표기 */
VER.textContent = "UI v3.5 · " + new Date().toISOString().slice(0,10).replace(/-/g,".") + (lastEdited?` · 마지막 수정 ${new Date(lastEdited).toLocaleString('ko-KR',{hour12:false})}`:'');

/* 키보드 */
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape'){ document.activeElement?.blur(); els.exportBtn.setAttribute('aria-expanded','false'); els.exportMenu.setAttribute('aria-hidden','true'); }
});

/* 보기/편집 모드 토글 */
els.modeView.onclick = ()=> setMode(false);
els.modeEdit.onclick = ()=> setMode(true);

/* 초기화 버튼 */
els.clearEdits.onclick = clearEdits;

/* 알림 벨 (데모: 선택 건수 표시 이미 적용) */
els.bell.onclick = ()=> toast('새 알림이 없습니다.');

/* 모바일 FAB 액션 */
els.fabExport.onclick = (e)=> toggleExportMenu(e);
els.fabRestore.onclick = ()=> els.restoreSel.click();

/* 필터 영역 준비 */
function removeFilterPublic(c){ removeFilter(c); }

/* 유틸 공개 (필터 초기화 버튼에서 호출용) */
window.removeFilter = removeFilterPublic;



// SAFETY: everything binds after DOM is ready
document.addEventListener('DOMContentLoaded', function(){

  // A11y: decorative icons
  document.querySelectorAll('.icon').forEach(el=>{
    if(!el.getAttribute('aria-label')) el.setAttribute('aria-hidden','true');
  });

  // Open AddCase modal
  function openAddCaseModal(){
    const modal = document.getElementById('addModal');
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
    const addCat = document.getElementById('addCat');
    const addQ = document.getElementById('addQ');
    if(addQ) addQ.value='';
    if(addCat) setTimeout(()=> addCat.focus(), 0);
  }
  window.openAddCaseModal = openAddCaseModal;

  // Close modal
  function closeModal(){
    const modal = document.getElementById('addModal');
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
  }

  // Bind buttons (no inline)
  const addBtn = document.getElementById('addCase');
  const fabBtn = document.getElementById('fabAddCase');
  addBtn && addBtn.addEventListener('click', openAddCaseModal);
  fabBtn && fabBtn.addEventListener('click', openAddCaseModal);

  document.getElementById('addClose')?.addEventListener('click', closeModal);
  document.getElementById('addCancel')?.addEventListener('click', closeModal);

  // Submit
  document.getElementById('addSubmit')?.addEventListener('click', function(){
    const q = (document.getElementById('addQ')?.value||'').trim();
    const a = (document.getElementById('addA')?.value||'').trim();
    const cat = (document.getElementById('addCat')?.value||'').trim() || '기타';
    const st = (document.getElementById('addSt')?.value||'대기');
    if(!q){ toast && toast('민원 사례를 입력해 주세요.'); document.getElementById('addQ')?.focus(); return; }
    try{
      if(typeof snapshot==='function') snapshot();
      const item = { idx: (Array.isArray(view) && view.length? Math.max(...view.map(v=>+v.idx||0))+1 : 1), q, a, cat, st, sel:false };
      if(Array.isArray(view)) view.push(item);
      if(typeof markEdited==='function') markEdited();
      if(typeof saveEdits==='function') saveEdits();
      if(typeof render==='function') render();
      toast && toast('새 사례를 추가했습니다. (5초 내 Undo 가능)');
      if(typeof startUndo==='function') startUndo();
      closeModal();
    }catch(e){
      console.error(e);
      toast && toast('추가 중 오류가 발생했습니다.');
    }
  });

  // Shortcuts
  document.addEventListener('keydown', (e)=>{
    const k = String(e.key).toLowerCase();
    if((e.ctrlKey||e.metaKey) && k==='n'){ e.preventDefault(); openAddCaseModal(); }
    if(k==='escape' && document.getElementById('addModal')?.getAttribute('aria-hidden')==='false'){ e.preventDefault(); closeModal(); }
    if((e.ctrlKey||e.metaKey) && k==='enter' && document.getElementById('addModal')?.getAttribute('aria-hidden')==='false'){
      e.preventDefault();
      document.getElementById('addSubmit')?.click();
    }
  });

  // Enforce export menu visibility rules (no overlay blocking)
  const menu = document.getElementById('exportMenu');
  if(menu){ menu.setAttribute('aria-hidden', menu.getAttribute('aria-hidden')||'true'); }
});

(function(){
  const orig = window.openPrintWindow;
  if(typeof orig==='function'){
    window.openPrintWindow = function(rows, title){
      const w = orig(rows, title);
      try{ if(w){ w.document.body.style.background='#fff'; w.document.body.style.color='#111'; } }catch(e){}
      return w;
    };
  }
})();
