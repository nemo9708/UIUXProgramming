document.addEventListener("DOMContentLoaded", function () {
  // ======================================================================
  // 1. 10·11주차 내비게이션 위치 추적 & 모바일 햄버거 메뉴
  // ======================================================================
  const navLinks = document.querySelectorAll(".nav-link");

  // (1) 현재 URL 해시에 맞춰 메뉴 활성화 및 aria-current 부여
  function updateActiveNavLink() {
    const currentHash = window.location.hash || "#about";
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentHash) {
        link.classList.add("is-current");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("is-current");
        link.removeAttribute("aria-current");
      }
    });
  }

  // 초기 로드 및 URL 해시 변경(새로고침, 뒤로 가기, 앞으로 가기) 감지
  updateActiveNavLink();
  window.addEventListener("hashchange", updateActiveNavLink);

  // (2) 모바일 햄버거 메뉴 열기/닫기 및 목적지 선택 후 자동 닫힘
  const menuToggleBtn = document.querySelector("#menuToggleBtn");
  const menuBtnText = menuToggleBtn ? menuToggleBtn.querySelector(".menu-btn-text") : null;
  const primaryNav = document.querySelector("#primaryNav");

  if (menuToggleBtn && primaryNav) {
    function toggleMobileMenu(isOpen) {
      primaryNav.classList.toggle("is-open", isOpen);
      menuToggleBtn.setAttribute("aria-expanded", String(isOpen));
      menuToggleBtn.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
      if (menuBtnText) {
        menuBtnText.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
      }
    }

    menuToggleBtn.addEventListener("click", function () {
      const isCurrentlyOpen = primaryNav.classList.contains("is-open");
      toggleMobileMenu(!isCurrentlyOpen);
    });

    // 링크 클릭 시 해당 섹션으로 이동하며 모바일 메뉴 닫기
    navLinks.forEach(link => {
      link.addEventListener("click", function () {
        if (primaryNav.classList.contains("is-open")) {
          toggleMobileMenu(false);
        }
      });
    });
  }

  // ======================================================================
  // 2. 6주차 주요 기능 3개 동적 탭 UI (click)
  // ======================================================================
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  if (tabs.length > 0 && panels.length > 0) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function (e) {
        const targetSelector = e.currentTarget.dataset.target;
        const targetPanel = document.querySelector(targetSelector);

        tabs.forEach(t => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });

        panels.forEach(p => {
          p.classList.remove("is-active");
          p.hidden = true;
        });

        e.currentTarget.classList.add("is-active");
        e.currentTarget.setAttribute("aria-selected", "true");

        if (targetPanel) {
          targetPanel.classList.add("is-active");
          targetPanel.hidden = false;
        }
      });
    });
  }

  // ======================================================================
  // 3. 설정 및 간편 연습 (테마 토글, 글자수 계산, 동의 체크)
  // ======================================================================
  // (1) 다크 테마 토글 (click)
  const themeButton = document.querySelector("#themeButton");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const isDark = document.body.classList.toggle("dark");
      themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
    });
  }

  // (2) 식재료 글자수 계산 (input)
  const foodNameInput = document.querySelector("#foodName");
  const foodNameCount = document.querySelector("#foodNameCount");
  if (foodNameInput && foodNameCount) {
    foodNameInput.addEventListener("input", function () {
      const maxLen = 10;
      const currentLen = Math.min(foodNameInput.value.length, maxLen);
      foodNameCount.textContent = `${currentLen} / ${maxLen} 자`;
    });
  }

  // (3) 알림 동의 체크박스 (change)
  const agreeCheck = document.querySelector("#agreeCheck");
  const agreeMessage = document.querySelector("#agreeMessage");
  const startAlarmBtn = document.querySelector("#startAlarmBtn");
  if (agreeCheck && agreeMessage && startAlarmBtn) {
    agreeCheck.addEventListener("change", function () {
      const isChecked = agreeCheck.checked;
      startAlarmBtn.disabled = !isChecked;
      agreeMessage.textContent = isChecked
        ? "유통기한 알림 서비스 이용 준비가 완료되었습니다."
        : "동의 후 알림 서비스를 이용할 수 있습니다.";

      if (isChecked) {
        agreeMessage.classList.add("is-ready");
      } else {
        agreeMessage.classList.remove("is-ready");
      }
    });
  }

  // ======================================================================
  // 4. 실시간 냉장고 현황판 및 필터링 관리 (중간고사 신규 기능)
  // ======================================================================
  function getFutureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  // 초기 식재료 데이터
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

  let currentSearchQuery = "";
  let currentStorageFilter = "all";
  let currentStatusTab = "all";

  const foodListContainer = document.querySelector("#foodListContainer");
  const emptyState = document.querySelector("#emptyState");
  const emptyStateMsg = document.querySelector("#emptyStateMsg");
  const filterResultCount = document.querySelector("#filterResultCount");
  const foodSearchInput = document.querySelector("#foodSearchInput");
  const storageFilter = document.querySelector("#storageFilter");
  const dashTabs = document.querySelectorAll(".dash-tab");
  const statTotal = document.querySelector("#statTotal");
  const statStoring = document.querySelector("#statStoring");
  const statImpending = document.querySelector("#statImpending");
  const statConsumed = document.querySelector("#statConsumed");

  // D-Day 계산 함수
  function calculateDDay(expireDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expireDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 상단 통계 숫자 갱신
  function updateStats() {
    if (!statTotal || !statStoring || !statImpending || !statConsumed) return;
    const total = foodList.length;
    const storing = foodList.filter(item => item.status === "storing").length;
    const consumed = foodList.filter(item => item.status === "consumed").length;
    const impending = foodList.filter(item => {
      if (item.status === "consumed") return false;
      const dDay = calculateDDay(item.expireDate);
      return dDay <= 3;
    }).length;

    statTotal.textContent = total;
    statStoring.textContent = storing;
    statImpending.textContent = impending;
    statConsumed.textContent = consumed;
  }

  // 10·11주차: 필터링 결과 건수 안내 업데이트
  function updateFilterResultNotice(filteredCount, totalCount) {
    if (!filterResultCount) return;
    if (filteredCount === 0) {
      filterResultCount.innerHTML = `조건에 맞는 식재료가 없습니다. (전체 ${totalCount}개 보관 중)`;
    } else {
      filterResultCount.innerHTML = `검색 조건에 맞는 식재료가 총 ${filteredCount}개 있습니다.`;
    }
  }

  // 현황판 카드 렌더링
  function renderFoodList() {
    if (!foodListContainer) return;
    updateStats();
    foodListContainer.innerHTML = "";

    // 조건 필터링
    const filtered = foodList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(currentSearchQuery.toLowerCase());
      const matchesStorage = (currentStorageFilter === "all") || (item.storage === currentStorageFilter);
      const dDay = calculateDDay(item.expireDate);
      let matchesStatus = true;

      if (currentStatusTab === "storing") matchesStatus = (item.status === "storing");
      else if (currentStatusTab === "consumed") matchesStatus = (item.status === "consumed");
      else if (currentStatusTab === "impending") matchesStatus = (item.status === "storing" && dDay <= 3);

      return matchesSearch && matchesStorage && matchesStatus;
    });

    // 결과 건수 실시간 반영
    updateFilterResultNotice(filtered.length, foodList.length);

    // 예외 / 빈 결과 (Empty State) 처리
    if (filtered.length === 0) {
      if (emptyState) emptyState.hidden = false;

      if (emptyStateMsg) {
        // [분기 1] 전체 데이터가 0건인 경우
        if (foodList.length === 0) {
          emptyStateMsg.textContent = "보관 중인 식재료가 하나도 없습니다. 상단의 간편 등록에서 첫 식재료를 등록해 보세요!";
        }
        // [분기 2] 전체 데이터는 있으나 현재 검색/필터 조건에만 일치 항목이 없는 경우
        else if (currentSearchQuery !== "") {
          emptyStateMsg.textContent = `'${currentSearchQuery}' 검색 결과에 해당하는 식재료가 없습니다.`;
        } else if (currentStatusTab === "impending") {
          emptyStateMsg.textContent = "현재 유통기한이 임박한 식재료가 없습니다. 신선합니다!";
        } else if (currentStatusTab === "consumed") {
          emptyStateMsg.textContent = "소비 완료 처리된 식재료가 없습니다.";
        } else {
          emptyStateMsg.textContent = "선택한 조건에 맞는 식재료가 없습니다. 다른 조건을 선택해 보세요.";
        }
      }
      return;
    }

    if (emptyState) emptyState.hidden = true;

    // 식재료 카드 DOM 생성
    filtered.forEach(item => {
      const dDay = calculateDDay(item.expireDate);
      const isConsumed = (item.status === "consumed");
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
        <div>${item.name}</div>
        <div>${ddayText}</div>
        <div>카테고리: ${item.category}</div>
        <div>보관 장소: ${item.storage}</div>
        <div>유통기한: ${item.expireDate}</div>
      `;
      foodListContainer.appendChild(card);
    });
  }

  // 검색어 입력 (input)
  if (foodSearchInput) {
    foodSearchInput.addEventListener("input", function (e) {
      currentSearchQuery = e.target.value.trim();
      renderFoodList();
    });
  }

  // 보관장소 필터 (change)
  if (storageFilter) {
    storageFilter.addEventListener("change", function (e) {
      currentStorageFilter = e.target.value;
      renderFoodList();
    });
  }

  // 상태 탭 필터 (click)
  if (dashTabs.length > 0) {
    dashTabs.forEach(tab => {
      tab.addEventListener("click", function (e) {
        dashTabs.forEach(t => {
          t.classList.remove("is-active");
          t.setAttribute("aria-pressed", "false"); // aria-pressed 해제
        });

        e.currentTarget.classList.add("is-active");
        e.currentTarget.setAttribute("aria-pressed", "true"); // 선택된 탭에 aria-pressed 설정
        currentStatusTab = e.currentTarget.dataset.status;
        renderFoodList();
      });
    });
  }

  // 카드 소비 완료 토글 (click)
  if (foodListContainer) {
    foodListContainer.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-consume-toggle")) {
        const id = parseInt(e.target.dataset.id, 10);
        const targetItem = foodList.find(item => item.id === id);
        if (targetItem) {
          targetItem.status = targetItem.status === "storing" ? "consumed" : "storing";
          renderFoodList();
        }
      }
    });
  }

  // 필터 초기화 버튼
  const btnResetFilter = document.querySelector("#btnResetFilter");
  if (btnResetFilter) {
    btnResetFilter.addEventListener("click", function () {
      currentSearchQuery = "";
      currentStorageFilter = "all";
      currentStatusTab = "all";
      if (foodSearchInput) foodSearchInput.value = "";
      if (storageFilter) storageFilter.value = "all";
      dashTabs.forEach(t => t.classList.remove("is-active"));
      if (dashTabs[0]) dashTabs[0].classList.add("is-active");
      renderFoodList();
    });
  }

  // 새 식재료 등록하기 버튼 클릭 시 등록 섹션(#flowSection)으로 스크롤 이동
  const btnGoToRegister = document.querySelector("#btnGoToRegister");
  if (btnGoToRegister) {
    btnGoToRegister.addEventListener("click", function () {
      const flowSection = document.querySelector("#flowSection");
      if (flowSection) {
        flowSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ======================================================================
  // 5. 7주차 4단계 식재료 간편 등록 흐름 (Task Flow)
  // ======================================================================
  const registrationData = {
    foodName: "",
    category: "",
    storage: "",
    expireDate: "",
    alarm: true
  };

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

  function validateStep1() {
    if (!stepFoodName || !stepFoodCategory || !step1Error) return false;
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

  function validateStep2() {
    if (!stepStorage || !stepExpireDate || !step2Error) return false;
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

  function updateSummary() {
    if (summaryName) summaryName.textContent = registrationData.foodName;
    if (summaryCategory) summaryCategory.textContent = registrationData.category;
    if (summaryStorage) summaryStorage.textContent = registrationData.storage;
    if (summaryExpireDate) summaryExpireDate.textContent = registrationData.expireDate;
  }

  document.querySelectorAll(".btn-next").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const nextStep = parseInt(e.currentTarget.dataset.next, 10);
      if (nextStep === 2 && !validateStep1()) return;
      if (nextStep === 3) {
        if (!validateStep2()) return;
        updateSummary();
      }
      goToStep(nextStep);
    });
  });

  document.querySelectorAll(".btn-prev").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const prevStep = parseInt(e.currentTarget.dataset.prev, 10);
      goToStep(prevStep);
    });
  });

  // 4단계 등록 완료 버튼 클릭 시 현황판 데이터 연동
  const btnCompleteStep = document.querySelector("#btnCompleteStep");
  if (btnCompleteStep) {
    btnCompleteStep.addEventListener("click", function () {
      registrationData.alarm = stepAlarmCheck ? stepAlarmCheck.checked : true;
      const alarmTxt = registrationData.alarm ? " (알림 등록 완료)" : " (알림 미설정)";

      if (completeMessage) {
        completeMessage.textContent = `'${registrationData.foodName}' (${registrationData.storage}) 항목이 등록되었습니다.${alarmTxt}`;
      }

      // 현황판 배열에 새 식재료 즉시 추가
      const newItem = {
        id: Date.now(),
        name: registrationData.foodName,
        category: registrationData.category,
        storage: registrationData.storage,
        expireDate: registrationData.expireDate,
        status: "storing"
      };
      foodList.unshift(newItem);
      renderFoodList();
      goToStep(4);
    });
  }

  // 다시 등록하기 초기화 버튼
  const btnResetFlow = document.querySelector("#btnResetFlow");
  if (btnResetFlow) {
    btnResetFlow.addEventListener("click", function () {
      if (stepFoodName) stepFoodName.value = "";
      if (stepFoodCategory) stepFoodCategory.value = "";
      if (stepStorage) stepStorage.value = "";
      if (stepExpireDate) stepExpireDate.value = "";
      if (stepAlarmCheck) stepAlarmCheck.checked = true;
      if (step1Error) step1Error.hidden = true;
      if (step2Error) step2Error.hidden = true;

      registrationData.foodName = "";
      registrationData.category = "";
      registrationData.storage = "";
      registrationData.expireDate = "";
      registrationData.alarm = true;
      goToStep(1);
    });
  }

  // ======================================================================
  // 6. 9주차 맞춤 알림 신청 및 조건부 폼 (실시간 검증 & 제출 상태)
  // ======================================================================
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

  if (customNotifyForm && notifyChannel && conditionalWrapper && contactInput) {
    // 조건부 영역 표시/숨김 및 disabled 토글 (change)
    notifyChannel.addEventListener("change", function () {
      const channel = notifyChannel.value;
      clearError(contactInput, contactError);
      if (formResultFeedback) formResultFeedback.hidden = true;

      if (channel === "none") {
        conditionalWrapper.hidden = true;
        contactInput.disabled = true;
        contactInput.value = "";
        contactInput.removeAttribute("required");
      } else if (channel === "email") {
        conditionalWrapper.hidden = false;
        contactInput.disabled = false;
        contactLabel.innerHTML = '이메일 주소 *';
        contactInput.placeholder = "example@email.com";
        contactInput.setAttribute("required", "true");
        contactInput.focus();
      } else if (channel === "sms") {
        conditionalWrapper.hidden = false;
        contactInput.disabled = false;
        contactLabel.innerHTML = '휴대폰 번호 *';
        contactInput.placeholder = "010-1234-5678";
        contactInput.setAttribute("required", "true");
        contactInput.focus();
      }
    });

    // 실시간 입력 검증 (input)
    if (notifyFoodName) {
      notifyFoodName.addEventListener("input", validateFoodName);
    }
    contactInput.addEventListener("input", validateContact);

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

    function validateContact() {
      if (contactInput.disabled) return true;
      const channel = notifyChannel.value;
      const val = contactInput.value.trim();

      if (val === "") {
        showError(contactInput, contactError, "연락처 정보를 입력해 주세요.");
        return false;
      }

      if (channel === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          showError(contactInput, contactError, "올바른 이메일 형식이 아닙니다 (예: name@domain.com).");
          return false;
        }
      } else if (channel === "sms") {
        const phoneRegex = /^[0-9\-]{9,13}$/;
        if (!phoneRegex.test(val)) {
          showError(contactInput, contactError, "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678).");
          return false;
        }
      }

      clearError(contactInput, contactError);
      return true;
    }

    function showError(inputEl, errorEl, message) {
      inputEl.classList.add("is-invalid");
      inputEl.classList.remove("is-valid");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
    }

    function clearError(inputEl, errorEl) {
      inputEl.classList.remove("is-invalid");
      if (inputEl.value.trim() !== "") {
        inputEl.classList.add("is-valid");
      } else {
        inputEl.classList.remove("is-valid");
      }
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.hidden = true;
      }
    }

    // 제출 상태 및 중복 방지 처리 (submit)
    customNotifyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const isFoodValid = validateFoodName();
      const isContactValid = validateContact();

      if (!isFoodValid || !isContactValid) {
        if (formResultFeedback) {
          formResultFeedback.className = "result-feedback is-error";
          formResultFeedback.textContent = "입력한 항목에 오류가 있습니다. 수정 후 다시 시도해 주세요.";
          formResultFeedback.hidden = false;
        }
        if (!isFoodValid && notifyFoodName) notifyFoodName.focus();
        else if (!isContactValid) contactInput.focus();
        return;
      }

      if (btnSubmitNotify) {
        btnSubmitNotify.disabled = true;
        btnSubmitNotify.textContent = "알림 정보 등록 중...";
      }
      if (formResultFeedback) formResultFeedback.hidden = true;

      setTimeout(function () {
        if (btnSubmitNotify) {
          btnSubmitNotify.disabled = false;
          btnSubmitNotify.textContent = "맞춤 알림 등록하기";
        }

        if (formResultFeedback) {
          formResultFeedback.className = "result-feedback is-success";
          const channelText = notifyChannel.value === "none"
            ? "앱 현황판 전용"
            : notifyChannel.options[notifyChannel.selectedIndex].text;
          formResultFeedback.textContent = `🎉 '${notifyFoodName.value.trim()}'의 맞춤 알림(${channelText}) 설정이 성공적으로 등록되었습니다!`;
          formResultFeedback.hidden = false;
        }

        customNotifyForm.reset();
        if (notifyFoodName) notifyFoodName.classList.remove("is-valid");
        contactInput.classList.remove("is-valid");
        conditionalWrapper.hidden = true;
        contactInput.disabled = true;
      }, 1200);
    });
  }

  // ======================================================================
  // 7. 5주차 하단 기본 구독 폼 (submit)
  // ======================================================================
  const subscribeForm = document.querySelector("#subscribe-form");
  const emailInput = document.querySelector("#email");
  const subscribeButton = document.querySelector("#subscribeButton");
  const subscribeMessage = document.querySelector("#subscribeMessage");

  if (subscribeForm && emailInput && subscribeButton && subscribeMessage) {
    subscribeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailVal = emailInput.value.trim();

      if (emailVal === "") {
        subscribeMessage.textContent = "이메일을 입력한 뒤 신청해 주세요.";
        subscribeMessage.classList.remove("is-success");
        emailInput.focus();
        return;
      }

      subscribeMessage.textContent = `${emailVal}님, '신선한 냉장고' 유통기한 알림 신청이 완료되었습니다!`;
      subscribeMessage.classList.add("is-success");
      subscribeButton.textContent = "신청 완료";
      subscribeButton.disabled = true;
    });
  }

  // 최초 렌더링 실행
  renderFoodList();
});