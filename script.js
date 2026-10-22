// ==========================================
// 6주차 JavaScript 이벤트 & 동적 UI 구현
// ==========================================

// --- 1. DOM 요소 선택 ---
const themeButton = document.querySelector("#themeButton");
const foodNameInput = document.querySelector("#foodName");
const foodNameCount = document.querySelector("#foodNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startAlarmBtn = document.querySelector("#startAlarmBtn");

// 탭 버튼 및 패널 목록
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// --- 2. click 이벤트 (다크 테마 토글 + 버튼 문구 변경) ---
function handleThemeClick() {
    // 1) body 클래스 'dark' 토글 (스타일 변화)
    const isDark = document.body.classList.toggle("dark");
    // 2) 버튼 텍스트 변경 (문구 변화)
    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

// --- 3. input 이벤트 (식재료 이름 입력 시 실시간 글자수 계산) ---
function handleFoodNameInput() {
    const maxLen = 10;
    const currentLen = Math.min(foodNameInput.value.length, maxLen);
    // 실시간 글자 수 문구 갱신
    foodNameCount.textContent = `${currentLen} / ${maxLen} 자`;
}

foodNameInput.addEventListener("input", handleFoodNameInput);

// --- 4. change 이벤트 (체크 여부에 따라 버튼 상태, 안내 문구, 스타일 동시 변경) ---
function handleAgreeChange() {
    const isChecked = agreeCheck.checked;

    // (1) 버튼 상태 변경: disabled 토글
    startAlarmBtn.disabled = !isChecked;

    // (2) 화면 문구 변경
    agreeMessage.textContent = isChecked
        ? "유통기한 알림 서비스 이용 준비가 완료되었습니다."
        : "동의 후 알림 서비스를 이용할 수 있습니다.";

    // (3) 스타일 변경: 클래스 토글을 통한 색상 및 굵기 제어
    if (isChecked) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

// --- 5. 탭 UI 전환 기능 (querySelectorAll + forEach) ---

// 모든 탭과 패널의 활성화 상태 초기화
function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });

    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true; // 화면 숨김
    });
}

// 클릭된 탭과 연결된 패널 활성화
function activateTab(clickedTab) {
    // data-target 속성값 읽기 (예: "#panel-expire")
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    // 탭 활성화
    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    // 패널 활성화
    if (targetPanel) {
        targetPanel.classList.add("is-active");
        targetPanel.hidden = false;
    }
}

// 탭 클릭 이벤트 핸들러
function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

// 모든 탭 버튼에 click 이벤트 리스너 등록
tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

// ==========================================
// 7주차 Task Flow (4단계 입력 흐름) 구현
// ==========================================

// 데이터 저장 객체
const registrationData = {
    foodName: "",
    category: "",
    storage: "",
    expireDate: "",
    alarm: true
};

// DOM 요소 선택
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

// 스텝 변경 함수
function goToStep(stepNumber) {
    stepPanels.forEach((panel, index) => {
        const isCurrent = (index + 1) === stepNumber;
        panel.hidden = !isCurrent;
        panel.classList.toggle("is-active", isCurrent);
    });

    stepIndicators.forEach((indicator, index) => {
        const isCurrent = (index + 1) === stepNumber;
        indicator.classList.toggle("is-active", isCurrent);
    });
}

// 1단계 검증
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

// 2단계 검증
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

// 3단계 요약 화면 업데이트
function updateSummary() {
    summaryName.textContent = registrationData.foodName;
    summaryCategory.textContent = registrationData.category;
    summaryStorage.textContent = registrationData.storage;
    summaryExpireDate.textContent = registrationData.expireDate;
}

// 다음 버튼 처리
document.querySelectorAll(".btn-next").forEach(btn => {
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

// 이전 버튼 처리 (이전 입력값 유지)
document.querySelectorAll(".btn-prev").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const prevStep = parseInt(e.currentTarget.dataset.prev, 10);
        goToStep(prevStep);
    });
});

// 3단계 최종 등록 완료 처리
document.querySelector("#btnCompleteStep").addEventListener("click", () => {
    registrationData.alarm = stepAlarmCheck.checked;
    const alarmTxt = registrationData.alarm ? " (알림 등록 완료)" : " (알림 미설정)";
    completeMessage.textContent = `'${registrationData.foodName}' (${registrationData.storage}) 항목이 등록되었습니다.${alarmTxt}`;
    goToStep(4);
});

// 초기화 처리 (다시 등록하기)
document.querySelector("#btnResetFlow").addEventListener("click", () => {
    stepFoodName.value = "";
    stepFoodCategory.value = "";
    stepStorage.value = "";
    stepExpireDate.value = "";
    stepAlarmCheck.checked = true;

    step1Error.hidden = true;
    step2Error.hidden = true;

    registrationData.foodName = "";
    registrationData.category = "";
    registrationData.storage = "";
    registrationData.expireDate = "";
    registrationData.alarm = true;

    goToStep(1);
});