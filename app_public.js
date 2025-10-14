/* =========================================================================
   app_public.js — SAFE OFFLINE BUILD (114건 내장)
   - 외부 fetch, cases.json 의존 완전 제거
   - 검색/칩/페이지네이션 유지
   - 카드 액션: [복사하기] (의견/피드백 버튼 제거)
   - index.html 끝에서 로드 + 캐시무효화 쿼리 권장 (?v=list-copy-3)
   - 응답 템플릿: 이해→즉시도움→근거→다음약속(상세/요약 지원, 다정한 톤)
   ====================================================================== */

/* ---------- 표준 응답 템플릿 (상세) ----------
   공통 토큰: {name} {program} {date} {time} {policy_link} {alt_link} {contact}
   톤: 공적·전문 + 다정/배려 (단정·과장 표현 지양)
-------------------------------------------------------------------------- */
const RESPONSES = {
  "운영시간/공간":
`[이해] {name}님, 이용 시간 때문에 번거로우셨죠. 말씀 주셔서 감사합니다.
[즉시도움] 오늘 기준 ‘혼잡 시간대·대체 좌석·가용 공간’ 정보를 바로 정리해 안내드릴게요.
[근거] 현재 운영은 안전·인력·예산 지침에 따라 {time} 중심으로 편성되어 있습니다({policy_link}).
[다음약속] 야간·주말 운영 수요를 계속 모아 다음 분기 편성안에 반영하고, 결과를 꼭 공지하겠습니다.`,

  "선발/절차":
`[이해] {program} 선발 결과가 기대에 미치지 못해 아쉬우셨을 것 같습니다.
[즉시도움] 원하시면 개인정보를 제외한 요약 사유와 준비 팁을 개별로 안내드리겠습니다({contact}).
[근거] 공지된 기준(우선·추첨·가점)에 따라 외부 검증 로직으로 처리했습니다({policy_link}).
[다음약속] 다음 모집은 일정·절대시각과 체크리스트를 미리 고지해 혼선을 줄이겠습니다.`,

  "개인정보/마케팅":
`[이해] 정보 보호와 수신 설정은 민감한 부분이죠. 걱정되셨을 것 같습니다.
[즉시도움] 수신 거부·삭제 요청을 접수되는 즉시 처리하고, 결과를 회신드리겠습니다({contact}).
[근거] 최소 수집·암호화 보관·접근 통제 기준에 따라 운영합니다({policy_link}).
[다음약속] 마케팅 동의 내역 조회/변경 경로를 분명히 안내하고, 반복 발송 방지 점검을 강화하겠습니다.`,

  "프로그램 품질":
`[이해] {program} 참여 경험이 기대만큼 만족스럽지 못하셨군요.
[즉시도움] 강의 속도·자료·Q&A 배분을 조정하고, 필요 시 보완 세션이나 추가 자료를 제공하겠습니다({alt_link}).
[근거] 사전·사후 만족도와 현장 의견을 반영해 커리큘럼을 개편 중입니다.
[다음약속] 난이도·목표·평가 기준을 더 명확히 안내하고, 광고성 예시는 강사 가이드로 제한하겠습니다.`,

  "공정성/청렴성":
`[이해] 공정성과 청렴성은 신뢰의 바탕입니다. 우려 주셔서 감사드립니다.
[즉시도움] 해당 사안의 사실관계를 먼저 점검하고, 필요하면 시정·공개 조치를 하겠습니다.
[근거] 이해충돌 방지·협찬 표기·선거법·청렴 지침을 준수합니다({policy_link}).
[다음약속] 후원 내역·평가 체계·지급 기준을 보기 쉬운 요약본으로 정리해 상시 공개하겠습니다.`,

  "상담":
`[이해] 상담에서는 편안함과 신뢰가 가장 중요합니다. 불편을 느끼셨을 것 같아요.
[즉시도움] 상담사 변경과 기록 열람 범위 재설정이 가능합니다. 원하시면 바로 반영하겠습니다({contact}).
[근거] 비밀보장·최소 열람·보관 기간 원칙으로 운영합니다({policy_link}).
[다음약속] 회기당 시간·맞춤 조언 제공 방식을 개선하고, 후속 예약 경로를 더 간단히 하겠습니다.`,

  "연락/소통":
`[이해] 회신이 늦어 불편하셨을 텐데요. 기다리게 해 드려 죄송합니다.
[즉시도움] 접수 건을 우선 처리하고, 원하시는 채널(전화/문자/이메일)로 다시 안내드리겠습니다({contact}).
[근거] 표준 회신 목표는 24~48시간이며, 휴관·성수기에는 예외가 있을 수 있어 미리 고지합니다({policy_link}).
[다음약속] 발신·수신 누락 모니터링을 강화하고, 공지 채널을 정돈하겠습니다.`,

  "자료/콘텐츠":
`[이해] 자료 접근에 불편을 겪으셨군요. 사용에 지장이 없도록 바로 살펴보겠습니다.
[즉시도움] 링크 복구와 재전달 가능 범위를 확인해, 오늘 중 유효 링크로 교체하겠습니다({alt_link}).
[근거] 운영 기간 내 제공을 원칙으로 하며, 저작권·접근성(자막/대체텍스트) 기준을 적용합니다({policy_link}).
[다음약속] 자료 보관·만료 일정을 사전에 안내하고, 재수강·요약본 제공 범위를 명확히 고지하겠습니다.`,

  "공간/환경":
`[이해] 시설·환경 때문에 사용이 불편하셨죠. 알려주셔서 감사합니다.
[즉시도움] 온도·소음·청결·와이파이를 즉시 점검하고, 조용 구역·대체 좌석·혼잡 시간 정보를 안내하겠습니다.
[근거] 안전·접근성 기준에 맞춰 개선 우선순위를 정해 조치합니다({policy_link}).
[다음약속] 장애인 접근 동선·사물함·안내 표지를 보완하고, 정기 점검 결과를 공유하겠습니다.`,

  "일정/기한":
`[이해] 일정 표기가 헷갈리셨을 수 있겠습니다. 혼선을 드려 죄송합니다.
[즉시도움] {date} 기준 공지·캘린더를 정정하고, 개별 알림을 재발송하겠습니다({alt_link}).
[근거] 마감은 ‘절대시각(예: 금 18:00, KST)’ 기준이며, 타임존 표기는 ISO 형식으로 통일합니다({policy_link}).
[다음약속] 변경 이력 공개와 리마인드 정책을 강화하겠습니다.`,

  "기관 신뢰성":
`[이해] 운영 주체와 신뢰성은 충분히 궁금하실 부분입니다.
[즉시도움] 위탁 주체(구/시), 사업 공고문, 평가 체계 링크를 한 번에 안내드리겠습니다({policy_link}).
[근거] 특정 종교·정당·영리와 무관한 공공 위탁기관으로 관련 지침을 따릅니다.
[다음약속] 민원 처리 체계·예산 요약·성과 지표를 정기적으로 공개하겠습니다.`,

  "참여 자격":
`[이해] 자격 요건이 복잡하게 느껴지실 수 있습니다.
[즉시도움] {program}의 연령·지역·재참여·학적·재직 요건을 표와 예시로 정리해 드리겠습니다({alt_link}).
[근거] 공고 범위 내 광역·타지역 참여가 가능한 경우가 있으나, 사업별 세부 요건이 다를 수 있습니다({policy_link}).
[다음약속] FAQ와 자가진단 체크리스트를 계속 업데이트하겠습니다.`,

  "리워드/경품":
`[이해] 리워드 지급과 공정성에 대해 우려하실 수 있습니다.
[즉시도움] 대상 기준·지급 일정·재전송 가능 여부를 조회해 개별로 답변드리겠습니다({contact}).
[근거] 소액 기념품은 관련 지침·선거법 범위 내에서만 운영하며, 절차·기준을 공개합니다({policy_link}).
[다음약속] 표기 방식과 추첨 검증 절차를 보강하고, 요약본으로 알기 쉽게 안내하겠습니다.`,

  "보안/시스템":
`[이해] 시스템 사용 중 불편을 겪으셨군요. 바로 확인하겠습니다.
[즉시도움] 오류를 서버/브라우저/권한으로 분류해 복구하고, 임시 저장·대체 제출 경로를 안내드리겠습니다({alt_link}).
[근거] 가용성·무결성 기준에 따라 모니터링·백업을 운영합니다({policy_link}).
[다음약속] 동일 유형 재발 방지 패치를 적용하고, 조치 내용을 공지하겠습니다.`,

  "기타":
`[이해] 남겨주신 제안/문의가 운영 개선에 큰 도움이 됩니다.
[즉시도움] 관련 기준과 사실관계를 확인해, 가장 빠른 경로로 처리하고 결과를 안내드리겠습니다({contact}).
[다음약속] 유사 문의를 FAQ에 반영하고, 월별 현황을 공개하겠습니다.`
};

/* ---------- 짧은 답변(알림/DM용 요약본) ---------- */
const RESPONSES_BRIEF = {
  "운영시간/공간": "알려주셔서 감사합니다. 오늘 혼잡·대체 좌석 정보를 갱신하고, 야간·주말 수요는 다음 분기 편성에 반영하겠습니다.",
  "선발/절차": "요청 주시면 요약 사유와 준비 팁을 개별 안내드리고, 다음 모집은 절대시각·체크리스트를 미리 고지하겠습니다.",
  "개인정보/마케팅": "수신 거부·삭제 요청을 즉시 처리하고 결과를 회신드리겠습니다. 보관·열람 기준은 링크로 안내드립니다.",
  "프로그램 품질": "속도·자료·Q&A를 조정하고 필요 시 보완 세션/자료를 제공하겠습니다.",
  "공정성/청렴성": "사실관계를 차분히 점검해 필요 시 시정·공개 조치하겠습니다. 기준과 절차는 링크에서 확인 가능합니다.",
  "상담": "상담사 변경과 기록 범위 재설정이 가능합니다. 원하시면 바로 반영하겠습니다.",
  "연락/소통": "기다리게 해 드려 죄송합니다. 우선 처리 후 원하시는 채널로 재안내드리겠습니다.",
  "자료/콘텐츠": "링크를 복구·교체해 오늘 중 유효 링크로 전달드리겠습니다.",
  "공간/환경": "현장 상태를 즉시 점검하고, 조용 구역·대체 좌석 정보를 함께 안내하겠습니다.",
  "일정/기한": "공지·캘린더를 정정하고, 마감 ‘절대시각’ 표기를 표준화하겠습니다.",
  "기관 신뢰성": "위탁 주체·공고문·평가 체계를 한 번에 안내드리겠습니다.",
  "참여 자격": "연령·지역·재참여 등 세부 요건을 표와 예시로 정리해 드리겠습니다.",
  "리워드/경품": "대상·일정·재전송 여부를 조회해 개별로 안내드리겠습니다.",
  "보안/시스템": "오류 원인을 분류해 복구하고, 대체 제출 경로를 함께 안내드리겠습니다.",
  "기타": "가장 빠른 방법으로 처리하고 결과를 안내드리겠습니다."
};

/* ---------- 114건 내장 데이터 (100 + ‘기타’ 14) ---------- */
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
  /* 기타 14 */
  {q:"센터 위치 안내 표지가 부족합니다. 초행길 안내가 있었으면 합니다.",cat:"기타"},
  {q:"현장 사진·영상 촬영 동의 절차가 궁금합니다.",cat:"기타"},
  {q:"분실물 보관 및 인수인계 절차를 알려주세요.",cat:"기타"},
  {q:"대기 번호 시스템이 있었으면 합니다.",cat:"기타"},
  {q:"행사 후 만족도 조사 결과를 공유해 주실 수 있나요?",cat:"기타"},
  {q:"주차 공간 이용 기준이 필요합니다.",cat:"기타"},
  {q:"현장 자원봉사 참여 방법을 안내해 주세요.",cat:"기타"},
  {q:"장애인 보조공학기기 대여가 가능한가요?",cat:"기타"},
  {q:"유아 동반 공간 이용 수칙이 있나요?",cat:"기타"},
  {q:"분야별 멘토링 상시 신청 창구가 있었으면 합니다.",cat:"기타"},
  {q:"센터 이용 에티켓(소음·통화 등)을 정리해 주세요.",cat:"기타"},
  {q:"알레르기 정보 표시(간식/다과)가 필요합니다.",cat:"기타"},
  {q:"비상 상황 시 대피 요령을 사전에 안내받고 싶습니다.",cat:"기타"},
  {q:"민원·제안 접수 현황을 월별로 공개해 주세요.",cat:"기타"}
];

/* ---------- 개인화/포맷터 ---------- */
function composeReply(category, tokens = {}, { brief=false } = {}) {
  const src = brief ? RESPONSES_BRIEF[category] : RESPONSES[category];
  if (!src) return "";
  const defaults = {
    name: "",
    program: "",
    date: "",
    time: "",
    policy_link: "<지침 링크>",
    alt_link: "<대체 링크/자료>",
    contact: "<연락처>"
  };
  const t = { ...defaults, ...tokens };
  return src
    .replaceAll("{name}", t.name)
    .replaceAll("{program}", t.program)
    .replaceAll("{date}", t.date)
    .replaceAll("{time}", t.time)
    .replaceAll("{policy_link}", t.policy_link)
    .replaceAll("{alt_link}", t.alt_link)
    .replaceAll("{contact}", t.contact);
}

/* ---------- 실행(DOMContentLoaded 보장) ---------- */
document.addEventListener('DOMContentLoaded', () => {

  /* ① 헤더만 고정하도록 sticky 변수 0으로 정리 */
  const root = document.documentElement;
  root.style.setProperty('--sticky-toolbar', '0px');
  root.style.setProperty('--sticky-filters', '0px');

  /* ② 우측 하단 [위로가기] 버튼 */
  const toTop = document.createElement('button');
  toTop.id = 'backToTop';
  toTop.type = 'button';
  toTop.textContent = '위로';
  document.body.appendChild(toTop);

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const toggleToTop = () => {
    if (window.scrollY > 400) toTop.classList.add('show');
    else toTop.classList.remove('show');
  };
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();

  // 리스트 UI 모드
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
  const CATS = [
    "운영시간/공간","선발/절차","개인정보/마케팅","프로그램 품질",
    "공정성/청렴성","상담","연락/소통","자료/콘텐츠","공간/환경",
    "일정/기한","기관 신뢰성","참여 자격","리워드/경품","보안/시스템","기타"
  ];
  let page = 1;
  let pageSize = Number(els.pageSize?.value)||50; // 기본 50
  let activeCats = new Set();

  // view: CASE × 응답(상세) 미리보기 — composeReply 기반 생성
  let view = CASES.map((d, i) => ({
    idx: i + 1,
    q: d.q,
    cat: d.cat,
    a: composeReply(d.cat, {}, { brief:false })
  }));

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
    els.chips.innerHTML = `<button class="chip" id="chipReset" type="button" title="모든 필터 해제">필터 해제</button>` +
      CATS.map(c=>`<button class="chip" data-cat="${c}" type="button">${c}</button>`).join('');
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
          <button class="btn copy" type="button" data-copy data-idx="${r.idx}" aria-label="이 카드 내용 복사" title="클릭: 상세 복사 / Shift+클릭: 요약 복사">복사하기</button>
        </div>
      </td>
    </tr>`;
  };

  const render=()=>{
    if(!els.tbody) return;
    const {rows,terms}=filteredRows();
    els.total && (els.total.textContent = view.length);
    els.shown && (els.shown.textContent = rows.length);

    const pages=Math.max(1, Math.ceil(rows.length / pageSize));
    if(page>pages) page=pages;
    const start=(page-1)*pageSize;
    const slice=rows.slice(start, start+pageSize);

    els.tbody.innerHTML = slice.length
      ? slice.map(r=>rowHtml(r,terms)).join('')
      : `<tr><td colspan="4" style="padding:18px">검색 조건에 맞는 결과가 없습니다.</td></tr>`;

    els.pageInfo && (els.pageInfo.textContent = `${page}/${pages}`);
    els.prev && (els.prev.disabled = (page<=1));
    els.next && (els.next.disabled = (page>=pages));
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

  // [복사하기] 버튼: 이벤트 위임
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-copy]');
    if (!btn) return;
    const tr   = btn.closest('tr');
    const qEl  = tr?.querySelector('.q');
    const catEl= tr?.querySelector('.cat');

    const q    = (qEl?.innerText || '').trim();
    const cat  = (catEl?.innerText || '').trim();

    // 상세/요약 분기: Shift+클릭이면 요약
    const brief = !!e.shiftKey;

    // 개인화 토큰 기본값(복사 즉시 수정 가능)
    const tokens = {
      name: "",
      program: "",
      date: "",
      time: "",
      policy_link: "<지침 링크>",
      alt_link: "<대체 링크/자료>",
      contact: "<연락처>"
    };

    const ans = composeReply(cat, tokens, { brief });

    const text = [
      `민원: ${q}${cat ? ` (${cat})` : ''}`,
      '',
      brief ? '가이드(요약):' : '가이드:',
      ans
    ].join('\n');

    copyToClipboard(text).then(() => showToast(brief ? '요약을 복사했습니다.' : '복사했습니다.'));
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

  /* Sticky 오프셋 자동 보정 (툴바/필터 사용 시) */
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

  /* 칩 & 렌더 시작 */
  renderChips();
  render();
});
