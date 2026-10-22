// ==========================================
// 1. 6주차: 기본 인터랙션 및 탭 UI
// ==========================================

// --- DOM 요소 선택 (6주차) ---
const themeButton = document.querySelector("#themeButton");
const foodNameInput = document.querySelector("#foodName");
const foodNameCount = document.querySelector("#foodNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startAlarmBtn = document.querySelector("#startAlarmBtn");

// 탭 버튼 및 패널 목록
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// --- (1) click 이벤트: 다크 테마 토글 ---
function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}
if (themeButton) {
  themeButton.addEventListener("click", handleThemeClick);
}

// --- (2) input 이벤트: 식재료 이름 실시간 글자 수 계산 ---
function handleFoodNameInput() {
  const maxLen = 10;
  const currentLen = Math.min(foodNameInput.value.length, maxLen);
  foodNameCount.textContent = `${currentLen} / ${maxLen} 자`;
}
if (foodNameInput) {
  foodNameInput.addEventListener("input", handleFoodNameInput);
}

// --- (3) change 이벤트: 동의 여부에 따른 버튼/문구 상태 제어 ---
function handleAgreeChange() {
  const isChecked = agreeCheck.checked;

  if (startAlarmBtn) {
    startAlarmBtn.disabled = !isChecked;
  }

  if (agreeMessage) {
    agreeMessage.textContent = isChecked
      ? "유통기한 알림 서비스 이용 준비가 완료되었습니다."
      : "동의 후 알림 서비스를 이용할 수 있습니다.";

    if (isChecked) {
      agreeMessage.classList.add("is-ready");
    } else {
      agreeMessage.classList.remove("is-ready");
    }
  }
}
if (agreeCheck) {
  agreeCheck.addEventListener("change", handleAgreeChange);
}

// --- (4) 탭 UI 전환 기능 ---
function resetTabsAndPanels() {
  tabs.forEach((tab) => {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach((panel) => {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  if (targetPanel) {
    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
  }
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", handleTabClick);
});


// ==========================================
// 2. 7주차: Task Flow (다단계 등록 흐름)
// ==========================================

// 등록 데이터 저장 객체
const registrationData = {
  foodName: "",
  category: "",
  storage: "",
  expireDate: "",
  alarm: true
};

// DOM 요소 선택 (7주차 등록 플로우)
const stepPanels = document.querySelectorAll(".step-panel");
const stepIndicators = document.querySelectorAll(".step-indicator li");

const stepFoodName = document.querySelector("#stepFoodName");
const stepFoodCategory = document.querySelector("#stepFoodCategory");
const stepStorage = document.querySelector("#stepStorage");
const stepExpireDate = document.querySelector("#stepExpireDate");
const stepAlarmCheck = document.querySelector("#stepAlarmCheck");

const step1Error = document.querySelector("#step1Error");
const step2Error = document.querySelector("#step2Error");

const summaryName = document.querySelector("#summaryName");
const summaryCategory = document.querySelector("#summaryCategory");
const summaryStorage = document.querySelector("#summaryStorage");
const summaryExpireDate = document.querySelector("#summaryExpireDate");
const completeMessage = document.querySelector("#completeMessage");

// 단계 전환 함수
function goToStep(stepNumber) {
  stepPanels.forEach((panel, index) => {
    const isCurrent = index + 1 === stepNumber;
    panel.hidden = !isCurrent;
    panel.classList.toggle("is-active", isCurrent);
  });

  stepIndicators.forEach((indicator, index) => {
    const isCurrent = index + 1 === stepNumber;
    indicator.classList.toggle("is-active", isCurrent);
  });
}

// 1단계 유효성 검증
function validateStep1() {
  const nameVal = stepFoodName.value.trim();
  const catVal = stepFoodCategory.value;

  if (!nameVal) {
    step1Error.textContent = "식재료 이름을 입력해 주세요.";
    step1Error.hidden = false;
    stepFoodName.focus();
    return false;
  }
  if (!catVal) {
    step1Error.textContent = "카테고리를 선택해 주세요.";
    step1Error.hidden = false;
    stepFoodCategory.focus();
    return false;
  }

  step1Error.hidden = true;
  registrationData.foodName = nameVal;
  registrationData.category = catVal;
  return true;
}

// 2단계 유효성 검증
function validateStep2() {
  const storageVal = stepStorage.value;
  const dateVal = stepExpireDate.value;

  if (!storageVal) {
    step2Error.textContent = "보관 장소를 선택해 주세요.";
    step2Error.hidden = false;
    stepStorage.focus();
    return false;
  }
  if (!dateVal) {
    step2Error.textContent = "유통기한 날짜를 지정해 주세요.";
    step2Error.hidden = false;
    stepExpireDate.focus();
    return false;
  }

  step2Error.hidden = true;
  registrationData.storage = storageVal;
  registrationData.expireDate = dateVal;
  return true;
}

// 3단계 요약 화면 갱신
function updateSummary() {
  summaryName.textContent = registrationData.foodName;
  summaryCategory.textContent = registrationData.category;
  summaryStorage.textContent = registrationData.storage;
  summaryExpireDate.textContent = registrationData.expireDate;
}

// 다음 버튼 이벤트 연결
document.querySelectorAll(".btn-next").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const nextStep = parseInt(e.currentTarget.dataset.next, 10);
    if (nextStep === 2 && !validateStep1()) return;
    if (nextStep === 3) {
      if (!validateStep2()) return;
      updateSummary();
    }
    goToStep(nextStep);
  });
});

// 이전 버튼 이벤트 연결
document.querySelectorAll(".btn-prev").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const prevStep = parseInt(e.currentTarget.dataset.prev, 10);
    goToStep(prevStep);
  });
});

// 다시 등록하기 (초기화) 버튼 처리
const btnResetFlow = document.querySelector("#btnResetFlow");
if (btnResetFlow) {
  btnResetFlow.addEventListener("click", () => {
    stepFoodName.value = "";
    stepFoodCategory.value = "";
    stepStorage.value = "";
    stepExpireDate.value = "";
    if (stepAlarmCheck) stepAlarmCheck.checked = true;

    step1Error.hidden = true;
    step2Error.hidden = true;

    registrationData.foodName = "";
    registrationData.category = "";
    registrationData.storage = "";
    registrationData.expireDate = "";
    registrationData.alarm = true;

    goToStep(1);
  });
}


// ==========================================
// 3. 중간고사 신규 기능: 실시간 현황판 & 데이터 관리
// ==========================================

// D-Day 계산용 날짜 생성 도우미
function getFutureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// 1) 초기 데이터 배열 (샘플 2개)
let foodList = [
  {
    id: 1,
    name: "유기농 두부",
    category: "유제품/계란",
    storage: "냉장",
    expireDate: getFutureDate(2), // 2일 후 (임박)
    status: "storing"
  },
  {
    id: 2,
    name: "삼겹살",
    category: "육류/수산",
    storage: "냉동",
    expireDate: getFutureDate(10), // 10일 후 (안전)
    status: "storing"
  }
];

// 현황판 필터 상태 변수
let currentSearchQuery = "";
let currentStorageFilter = "all";
let currentStatusTab = "all";

// DOM 요소 선택 (현황판 대시보드)
const foodListContainer = document.querySelector("#foodListContainer");
const emptyState = document.querySelector("#emptyState");
const emptyStateMsg = document.querySelector("#emptyStateMsg");
const foodSearchInput = document.querySelector("#foodSearchInput");
const storageFilter = document.querySelector("#storageFilter");
const dashTabs = document.querySelectorAll(".dash-tab");
const statTotal = document.querySelector("#statTotal");
const statStoring = document.querySelector("#statStoring");
const statImpending = document.querySelector("#statImpending");
const statConsumed = document.querySelector("#statConsumed");

// 2) D-Day 계산 함수
function calculateDDay(expireDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expireDateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 3) 통계 카운터 갱신 함수
function updateStats() {
  if (!statTotal) return;
  const total = foodList.length;
  const storing = foodList.filter((item) => item.status === "storing").length;
  const consumed = foodList.filter((item) => item.status === "consumed").length;
  const impending = foodList.filter((item) => {
    if (item.status === "consumed") return false;
    const dDay = calculateDDay(item.expireDate);
    return dDay <= 3;
  }).length;

  statTotal.textContent = total;
  statStoring.textContent = storing;
  statImpending.textContent = impending;
  statConsumed.textContent = consumed;
}

// 4) 식재료 카드 렌더링 함수
function renderFoodList() {
  updateStats();
  if (!foodListContainer) return;
  foodListContainer.innerHTML = "";

  // 검색, 보관 장소, 상태 탭 조건 필터링
  const filtered = foodList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(currentSearchQuery.toLowerCase());
    const matchesStorage = currentStorageFilter === "all" || item.storage === currentStorageFilter;
    
    const dDay = calculateDDay(item.expireDate);
    let matchesStatus = true;
    if (currentStatusTab === "storing") matchesStatus = item.status === "storing";
    else if (currentStatusTab === "consumed") matchesStatus = item.status === "consumed";
    else if (currentStatusTab === "impending") matchesStatus = item.status === "storing" && dDay <= 3;

    return matchesSearch && matchesStorage && matchesStatus;
  });

  // 빈 상태(Empty State) 피드백 처리
  if (filtered.length === 0) {
    if (emptyState) {
      emptyState.hidden = false;
      if (currentSearchQuery !== "") {
        emptyStateMsg.textContent = `'${currentSearchQuery}' 검색 결과에 해당하는 식재료가 없습니다.`;
      } else if (currentStatusTab === "impending") {
        emptyStateMsg.textContent = "현재 유통기한이 임박한 식재료가 없습니다. 신선합니다!";
      } else if (currentStatusTab === "consumed") {
        emptyStateMsg.textContent = "소비 완료 처리된 식재료가 없습니다.";
      } else {
        emptyStateMsg.textContent = "조건에 맞는 식재료가 없습니다.";
      }
    }
    return;
  }

  if (emptyState) emptyState.hidden = true;

  // 카드 DOM 생성 및 삽입
  filtered.forEach((item) => {
    const dDay = calculateDDay(item.expireDate);
    const isConsumed = item.status === "consumed";
    let ddayClass = "safe";
    let ddayText = `D-${dDay}`;

    if (isConsumed) {
      ddayClass = "done";
      ddayText = "소비 완료";
    } else if (dDay < 0) {
      ddayClass = "danger";
      ddayText = `기한 만료 (D+${Math.abs(dDay)})`;
    } else if (dDay <= 3) {
      ddayClass = "danger";
      ddayText = dDay === 0 ? "D-Day (오늘까지)" : `D-${dDay} (임박)`;
    } else if (dDay <= 7) {
      ddayClass = "warning";
    }

    const card = document.createElement("article");
    card.className = `food-item-card ${isConsumed ? "is-consumed" : ""}`;
    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${item.name}</h3>
        <span class="dday-badge ${ddayClass}">${ddayText}</span>
      </div>
      <div class="card-body">
        <p><strong>카테고리:</strong> ${item.category}</p>
        <p><strong>보관 장소:</strong> ${item.storage}</p>
        <p><strong>유통기한:</strong> ${item.expireDate}</p>
      </div>
      <div class="card-footer">
        <button type="button" class="btn-consume-toggle" data-id="${item.id}">
          ${isConsumed ? "보관 중으로 복구" : "소비 완료"}
        </button>
      </div>
    `;
    foodListContainer.appendChild(card);
  });
}

// 5) 대시보드 필터 & 상호작용 이벤트 리스너 연결
if (foodSearchInput) {
  foodSearchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.trim();
    renderFoodList();
  });
}

if (storageFilter) {
  storageFilter.addEventListener("change", (e) => {
    currentStorageFilter = e.target.value;
    renderFoodList();
  });
}

dashTabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    dashTabs.forEach((t) => t.classList.remove("is-active"));
    e.currentTarget.classList.add("is-active");
    currentStatusTab = e.currentTarget.dataset.status;
    renderFoodList();
  });
});

// 카드 내 소비 완료 토글 (이벤트 위임)
if (foodListContainer) {
  foodListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-consume-toggle")) {
      const id = parseInt(e.target.dataset.id, 10);
      const targetItem = foodList.find((item) => item.id === id);
      if (targetItem) {
        targetItem.status = targetItem.status === "storing" ? "consumed" : "storing";
        renderFoodList();
      }
    }
  });
}

// 빈 상태 피드백 내 필터 초기화 버튼
const btnResetFilter = document.querySelector("#btnResetFilter");
if (btnResetFilter) {
  btnResetFilter.addEventListener("click", () => {
    currentSearchQuery = "";
    currentStorageFilter = "all";
    currentStatusTab = "all";
    if (foodSearchInput) foodSearchInput.value = "";
    if (storageFilter) storageFilter.value = "all";
    dashTabs.forEach((t) => t.classList.remove("is-active"));
    if (dashTabs[0]) dashTabs[0].classList.add("is-active");
    renderFoodList();
  });
}

// 빈 상태에서 등록 폼으로 스크롤 이동
const btnGoToRegister = document.querySelector("#btnGoToRegister");
if (btnGoToRegister) {
  btnGoToRegister.addEventListener("click", () => {
    const flowSection = document.querySelector("#flow-section");
    if (flowSection) flowSection.scrollIntoView({ behavior: "smooth" });
  });
}


// ==========================================
// 4. 통합 연동: 등록 완료 시 현황판 실시간 반영
// ==========================================
const btnCompleteStep = document.querySelector("#btnCompleteStep");
if (btnCompleteStep) {
  btnCompleteStep.addEventListener("click", () => {
    // 7주차 피드백 문구 생성
    registrationData.alarm = stepAlarmCheck ? stepAlarmCheck.checked : true;
    const alarmTxt = registrationData.alarm ? " (알림 등록 완료)" : " (알림 미설정)";
    if (completeMessage) {
      completeMessage.textContent = `'${registrationData.foodName}' (${registrationData.storage}) 항목이 등록되었습니다.${alarmTxt}`;
    }

    // 신규 등록 식재료를 배열 맨 앞에 추가
    const newItem = {
      id: Date.now(),
      name: registrationData.foodName,
      category: registrationData.category,
      storage: registrationData.storage,
      expireDate: registrationData.expireDate,
      status: "storing"
    };
    foodList.unshift(newItem);

    // 현황판 즉시 갱신
    renderFoodList();

    // 등록 폼 완료 화면(4단계)으로 이동
    goToStep(4);
  });
}

// 페이지 최초 로드 시 현황판 초기 렌더링
renderFoodList();