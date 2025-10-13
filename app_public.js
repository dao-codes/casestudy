/* =========================================================================
   app_public.js — Public build for https://dao-codes.github.io/Impact/
   - HTML 구조: search, chips, tbody, prev/next, pageSize, pageInfo, shown/total
   - GitHub Issues 연동(새 이슈 작성 / 라벨 검색)
   - 검색(카테고리:"..." / -키워드:"...") · 칩 필터 · 페이지네이션
   - 라이트/다크 전환 (html[data-theme]: auto ↔ dark)
   - 공개 배포 최소본(편집/내보내기/스토리지 제거)
   ====================================================================== */

/* -------------------------- 표준 응답 템플릿 ---------------------------- */
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

/* -------------------------- 사례 데이터(반영본) ------------------------ */
/* 공유해 주신 원본을 기반으로 확장했습니다. 필요 시 이 배열을 JSON로 외부화 가능. */
const CASES = [
  // 운영시간/공간
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

  // 선발/절차
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

  // 개인정보/마케팅
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

  // 프로그램 품질
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

  // 공정성/청렴성
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

  // 상담
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

  // 연락/소통
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

  // 자료/콘텐츠
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

  // 공간/환경
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

  // 일정/기한
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

  // 기관 신뢰성
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

  // 참여 자격
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

  // 리워드/경품
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

  // 보안/시스템
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

/* -------------------------- 앱 상태/요소 ------------------------------- */
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
let view = CASES.map((d,i)=>({idx:i+1,q:d.q,cat:d.cat,a:RESPONSES[d.cat]||RESPONSES["기타"]}));

/* -------------------------- GitHub Issues 연동 -------------------------- */
const GH_OWNER = document.querySelector('meta[name="gh-owner"]')?.getAttribute('content')?.trim() || '';
const GH_REPO  = document.querySelector('meta[name="gh-repo"]')?.getAttribute('content')?.trim() || '';
const GH_LABEL = encodeURIComponent(document.querySelector('meta[name="gh-label"]')?.getAttribute('content')?.trim() || 'feedback');

function ghNewIssueURL(row){
  const title = encodeURIComponent(`[${row.cat}] 문의/피드백: ${row.q}`.slice(0,250));
  const body = encodeURIComponent(
`다음 항목에 대한 의견/보완 제안을 남겨주세요.

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
function ghIssuesListURL(){
  return `https://github.com/${GH_OWNER}/${GH_REPO}/issues?q=is%3Aissue+label%3A${GH_LABEL}`;
}

/* -------------------------- 검색/필터 ---------------------------------- */
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

/* -------------------------- UI 렌더링 ----------------------------------- */
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
  const issueBtn = `<button class="btn primary open-issue" data-idx="${r.idx}" type="button">의견 남기기</button>`;
  const listBtn  = `<a class="btn outlined" href="${ghIssuesListURL()}" target="_blank" rel="noopener">피드백 보기</a>`;
  return `<tr>
    <td data-h="#">${r.idx}</td>
    <td data-h="민원 사례"><span class="q">${qHtml}</span> <span class="cat">${r.cat}</span></td>
    <td data-h="가이드"><div class="resp">${aHtml}</div></td>
    <td data-h="의견">
      <div class="row-actions">
        ${issueBtn}${listBtn}
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
  const totalRows = rows.length;
  els.total && (els.total.textContent = view.length);
  els.shown && (els.shown.textContent = totalRows);

  const pages = Math.max(1, Math.ceil(totalRows / pageSize));
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

/* -------------------------- 이벤트 바인딩 ------------------------------- */
els.search?.addEventListener('input', ()=>{ page=1; render(); });
els.prev?.addEventListener('click', ()=>{ if(page>1){ page--; render(); } });
els.next?.addEventListener('click', ()=>{ page++; render(); });
els.pageSize?.addEventListener('change', ()=>{ pageSize = Number(els.pageSize.value)||50; page=1; render(); });

/* 테마 전환 버튼: auto ↔ dark */
els.toggleTheme?.addEventListener('click', ()=>{
  const root = document.documentElement;
  const mode = root.getAttribute('data-theme');
  root.setAttribute('data-theme', mode==='dark' ? 'auto' : 'dark');
});

/* 이슈 목록 버튼 */
els.openIssues?.addEventListener('click', ()=>{
  if(!GH_OWNER || !GH_REPO){
    alert('깃허브 저장소 메타(meta[gh-owner], meta[gh-repo])를 설정해 주세요.');
    return;
  }
  window.open(ghIssuesListURL(), '_blank', 'noopener');
});

/* -------------------------- 시작 ---------------------------------------- */
renderChips();
render();
