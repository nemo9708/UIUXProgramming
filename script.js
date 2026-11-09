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

// ==========================================================================
// 9주차 조건부 폼 구현 및 실시간 검증/제출 상태 관리
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const customNotifyForm = document.querySelector("#customNotifyForm");
    const notifyFoodName = document.querySelector("#notifyFoodName");
    const foodNameError = document.querySelector("#foodNameError");
    const notifyChannel = document.querySelector("#notifyChannel");
    const conditionalWrapper = document.querySelector("#conditionalContactWrapper");
    const contactLabel = document.querySelector("#contactLabel");
    const contactInput = document.querySelector("#contactInput");
    const contactError = document.querySelector("#contactError");
    const btnSubmitNotify = document.querySelector("#btnSubmitNotify");
    const formResultFeedback = document.querySelector("#formResultFeedback");

    if (!customNotifyForm) return;

    // ----------------------------------------------------------------------
    // 1. 조건부 입력 영역 구현 (change 이벤트)
    // ----------------------------------------------------------------------
    notifyChannel.addEventListener("change", function () {
        const channel = notifyChannel.value;

        // 에러 상태 및 결과 피드백 초기화
        clearError(contactInput, contactError);
        formResultFeedback.hidden = true;

        if (channel === "none") {
            // 알림 안 함: 추가 입력창 숨김 및 disabled 처리
            conditionalWrapper.hidden = true;
            contactInput.disabled = true;
            contactInput.value = "";
            contactInput.removeAttribute("required");
        } else if (channel === "email") {
            // 이메일: 입력창 표시, 라벨/플레이스홀더 변경, disabled 해제
            conditionalWrapper.hidden = false;
            contactInput.disabled = false;
            contactLabel.innerHTML = '이메일 주소 <span class="required">*</span>';
            contactInput.placeholder = "example@email.com";
            contactInput.setAttribute("required", "true");
            contactInput.focus();
        } else if (channel === "sms") {
            // SMS: 입력창 표시, 라벨/플레이스홀더 변경, disabled 해제
            conditionalWrapper.hidden = false;
            contactInput.disabled = false;
            contactLabel.innerHTML = '휴대폰 번호 <span class="required">*</span>';
            contactInput.placeholder = "010-1234-5678 (숫자만 또는 하이픈 포함)";
            contactInput.setAttribute("required", "true");
            contactInput.focus();
        }
    });

    // ----------------------------------------------------------------------
    // 2. 실시간 입력 검증 (input 이벤트 - 작성 중 피드백 및 에러 해제)
    // ----------------------------------------------------------------------
    notifyFoodName.addEventListener("input", function () {
        validateFoodName();
    });

    contactInput.addEventListener("input", function () {
        validateContact();
    });

    // 식재료 이름 검증 함수
    function validateFoodName() {
        const val = notifyFoodName.value.trim();
        if (val.length < 2) {
            showError(notifyFoodName, foodNameError, "식재료 이름을 2자 이상 입력해 주세요.");
            return false;
        } else {
            clearError(notifyFoodName, foodNameError);
            return true;
        }
    }

    // 연락처 검증 함수 (채널별 양식 검사)
    function validateContact() {
        if (contactInput.disabled) return true; // 비활성화 상태면 검사 통과

        const channel = notifyChannel.value;
        const val = contactInput.value.trim();

        if (val === "") {
            showError(contactInput, contactError, "연락처 정보를 입력해 주세요.");
            return false;
        }

        if (channel === "email") {
            // 이메일 정규식 검사
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                showError(contactInput, contactError, "올바른 이메일 형식이 아닙니다 (예: name@domain.com).");
                return false;
            }
        } else if (channel === "sms") {
            // 전화번호 검사 (8자 이상 숫자/하이픈)
            const phoneRegex = /^[0-9-]{9,13}$/;
            if (!phoneRegex.test(val)) {
                showError(contactInput, contactError, "올바른 휴대폰 번호 형식이 아닙니다 (예: 01012345678).");
                return false;
            }
        }

        clearError(contactInput, contactError);
        return true;
    }

    // 에러 표시 공통 함수
    function showError(inputEl, errorEl, message) {
        inputEl.classList.add("is-invalid");
        inputEl.classList.remove("is-valid");
        errorEl.textContent = message;
        errorEl.hidden = false;
    }

    // 에러 해제 공통 함수
    function clearError(inputEl, errorEl) {
        inputEl.classList.remove("is-invalid");
        if (inputEl.value.trim() !== "") {
            inputEl.classList.add("is-valid");
        } else {
            inputEl.classList.remove("is-valid");
        }
        errorEl.textContent = "";
        errorEl.hidden = true;
    }

    // ----------------------------------------------------------------------
    // 3. 제출 상태 처리 (submit 이벤트 & 중복 방지 피드백)
    // ----------------------------------------------------------------------
    customNotifyForm.addEventListener("submit", function (e) {
        e.preventDefault(); // 기본 제출 동작 차단

        // 전체 검증 실행
        const isFoodValid = validateFoodName();
        const isContactValid = validateContact();

        // 조건 미충족 시 제출 차단 및 첫 에러 요소로 포커스
        if (!isFoodValid || !isContactValid) {
            formResultFeedback.className = "result-feedback is-error";
            formResultFeedback.textContent = "입력한 항목에 오류가 있습니다. 수정 후 다시 시도해 주세요.";
            formResultFeedback.hidden = false;

            if (!isFoodValid) {
                notifyFoodName.focus();
            } else if (!isContactValid) {
                contactInput.focus();
            }
            return;
        }

        // --- 제출 처리 중 상태 (중복 클릭 방지) ---
        btnSubmitNotify.disabled = true;
        btnSubmitNotify.textContent = "알림 정보 등록 중...";
        formResultFeedback.hidden = true;

        // 1.2초 후 성공 피드백 제공 (서버 전송 가상 시뮬레이션)
        setTimeout(function () {
            btnSubmitNotify.disabled = false;
            btnSubmitNotify.textContent = "맞춤 알림 등록하기";
            formResultFeedback.className = "result-feedback is-success";

            const channelText = notifyChannel.value === "none" 
                ? "앱 현황판 전용" 
                : notifyChannel.options[notifyChannel.selectedIndex].text;

            formResultFeedback.textContent = `🎉 '${notifyFoodName.value.trim()}'의 맞춤 알림(${channelText}) 설정이 성공적으로 등록되었습니다!`;
            formResultFeedback.hidden = false;

            // 폼 초기화 및 조건부 입력창 비활성화 복원
            customNotifyForm.reset();
            notifyFoodName.classList.remove("is-valid");
            contactInput.classList.remove("is-valid");
            conditionalWrapper.hidden = true;
            contactInput.disabled = true;
        }, 1200);
    });
});

// 페이지 최초 로드 시 현황판 초기 렌더링
renderFoodList();