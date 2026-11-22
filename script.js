document.addEventListener("DOMContentLoaded", function () {
  // ======================================================================
  // 1. 내비게이션 위치 추적, 브라우저 제목 갱신 & 모바일 메뉴 (Esc 지원)
  // ======================================================================
  const navLinks = document.querySelectorAll(".nav-link");

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

    // 11주차 접근성: 현재 메뉴에 맞춰 브라우저 탭 제목(document.title) 갱신
    const currentLink = document.querySelector('.primary-nav a[aria-current="page"]');
    const pageName = currentLink ? currentLink.textContent.trim() : "홈";
    document.title = `${pageName} | 신선한 냉장고`;
  }

  updateActiveNavLink();
  window.addEventListener("hashchange", updateActiveNavLink);

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

    // 11주차 접근성: 모바일 메뉴가 열려 있을 때 Esc 키로 닫고 버튼으로 초점 복귀
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !primaryNav.classList.contains("is-open")) {
        return;
      }
      toggleMobileMenu(false);
      menuToggleBtn.focus();
    });

    navLinks.forEach(link => {
      link.addEventListener("click", function () {
        if (primaryNav.classList.contains("is-open")) {
          toggleMobileMenu(false);
        }
      });
    });
  }

  // ======================================================================
  // 2. 주요 기능 3개 동적 탭 UI (클릭 + 좌우 화살표 키보드 이동)
  // ======================================================================
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  if (tabs.length > 0 && panels.length > 0) {
    function activateTab(selectedTab) {
      const targetSelector = selectedTab.dataset.target;
      const targetPanel = document.querySelector(targetSelector);

      tabs.forEach(t => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });

      panels.forEach(p => {
        p.classList.remove("is-active");
        p.hidden = true;
      });

      selectedTab.classList.add("is-active");
      selectedTab.setAttribute("aria-selected", "true");

      if (targetPanel) {
        targetPanel.classList.add("is-active");
        targetPanel.hidden = false;
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function (e) {
        activateTab(e.currentTarget);
      });

      // 키보드 좌우 화살표로 탭 이동 지원
      tab.addEventListener("keydown", function (e) {
        let nextIndex = null;
        if (e.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (e.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;

        if (nextIndex !== null) {
          e.preventDefault();
          tabs[nextIndex].focus();
          activateTab(tabs[nextIndex]);
        }
      });
    });
  }

  // ======================================================================
  // 3. 설정 및 간편 연습 (테마 토글, 글자수 계산, 동의 체크)
  // ======================================================================
  const themeButton = document.querySelector("#themeButton");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const isDark = document.body.classList.toggle("dark");
      themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
      themeButton.setAttribute("aria-pressed", String(isDark));
    });
  }

  const foodNameInput = document.querySelector("#foodName");
  const foodNameCount = document.querySelector("#foodNameCount");
  if (foodNameInput && foodNameCount) {
    foodNameInput.addEventListener("input", function () {
      const maxLen = 10;
      const currentLen = Math.min(foodNameInput.value.length, maxLen);
      foodNameCount.textContent = `${currentLen} / ${maxLen} 자`;
    });
  }

  const agreeCheck = document.querySelector("#agreeCheck");
  const agreeMessage = document.querySelector("#agreeMessage");
  const startAlarmBtn = document.querySelector("#startAlarmBtn");
  if (agreeCheck && agreeMessage && startAlarmBtn) {
    agreeCheck.addEventListener("change", function () {
      const isChecked = agreeCheck.checked;
      startAlarmBtn.disabled = !isChecked;
      agreeMessage.textContent = isChecked
        ? "✓ 유통기한 알림 서비스 이용 준비가 완료되었습니다."
        : "동의 후 알림 서비스를 이용할 수 있습니다.";
      agreeMessage.classList.toggle("is-ready", isChecked);
    });

    startAlarmBtn.addEventListener("click", function () {
      const notifySection = document.querySelector("#customNotifySection");
      if (notifySection) {
        notifySection.scrollIntoView({ behavior: "smooth" });
        const notifyFoodInput = document.querySelector("#notifyFoodName");
        if (notifyFoodInput) notifyFoodInput.focus();
      }
    });
  }

  // ======================================================================
  // 4. 실시간 냉장고 현황판 및 필터링 관리
  // ======================================================================
  function getFutureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  let foodList = [
    {
      id: 1,
      name: "유기농 두부",
      category: "유제품/계란",
      storage: "냉장",
      expireDate: getFutureDate(2),
      status: "storing"
    },
    {
      id: 2,
      name: "삼겹살",
      category: "육류/수산",
      storage: "냉동",
      expireDate: getFutureDate(10),
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

  function calculateDDay(expireDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expireDateStr);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  }

  function updateStats() {
    if (!statTotal || !statStoring || !statImpending || !statConsumed) return;
    const total = foodList.length;
    const storing = foodList.filter(item => item.status === "storing").length;
    const consumed = foodList.filter(item => item.status === "consumed").length;
    const impending = foodList.filter(item => {
      if (item.status === "consumed") return false;
      return calculateDDay(item.expireDate) <= 3;
    }).length;

    statTotal.textContent = total;
    statStoring.textContent = storing;
    statImpending.textContent = impending;
    statConsumed.textContent = consumed;
  }

  function updateFilterResultNotice(filteredCount, totalCount) {
    if (!filterResultCount) return;
    if (filteredCount === 0) {
      filterResultCount.innerHTML = `조건에 맞는 식재료가 없습니다. (전체 <strong>${totalCount}</strong>개 보관 중)`;
    } else {
      filterResultCount.innerHTML = `검색 조건에 맞는 식재료가 총 <strong>${filteredCount}</strong>개 있습니다.`;
    }
  }

  function renderFoodList() {
    if (!foodListContainer) return;
    updateStats();
    foodListContainer.innerHTML = "";

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

    updateFilterResultNotice(filtered.length, foodList.length);

    if (filtered.length === 0) {
      if (emptyState) emptyState.hidden = false;

      if (emptyStateMsg) {
        if (foodList.length === 0) {
          emptyStateMsg.textContent = "보관 중인 식재료가 없습니다. 아래 '새 식재료 등록하기'에서 첫 식재료를 등록해 보세요.";
        } else if (currentSearchQuery !== "") {
          emptyStateMsg.textContent = `'${currentSearchQuery}' 검색 결과에 해당하는 식재료가 없습니다.`;
        } else if (currentStatusTab === "impending") {
          emptyStateMsg.textContent = "현재 유통기한이 임박한 식재료가 없습니다.";
        } else if (currentStatusTab === "consumed") {
          emptyStateMsg.textContent = "소비 완료 처리된 식재료가 없습니다.";
        } else {
          emptyStateMsg.textContent = "선택한 조건에 맞는 식재료가 없습니다. 필터를 초기화하거나 다른 조건을 선택해 보세요.";
        }
      }
      return;
    }

    if (emptyState) emptyState.hidden = true;

    filtered.forEach(item => {
      const dDay = calculateDDay(item.expireDate);
      const isConsumed = (item.status === "consumed");
      let ddayClass = "safe";
      let ddayText = `D-${dDay} (여유)`;

      if (isConsumed) {
        ddayClass = "done";
        ddayText = "✓ 소비 완료";
      } else if (dDay < 0) {
        ddayClass = "danger";
        ddayText = `⚠ 기한 만료 (D+${Math.abs(dDay)})`;
      } else if (dDay <= 3) {
        ddayClass = "danger";
        ddayText = dDay === 0 ? "⚠ D-Day (오늘까지)" : `⚠ D-${dDay} (임박)`;
      } else if (dDay <= 7) {
        ddayClass = "warning";
        ddayText = `D-${dDay} (주의)`;
      }

      const card = document.createElement("article");
      card.className = `food-item-card ${isConsumed ? "is-consumed" : ""}`;
      card.innerHTML = `
        <div class="food-card-header">
          <h3 class="food-card-title">${item.name}</h3>
          <span class="dday-badge ${ddayClass}">${ddayText}</span>
        </div>
        <div class="food-card-body">
          <p><strong>카테고리:</strong> ${item.category}</p>
          <p><strong>보관 장소:</strong> ${item.storage}</p>
          <p><strong>유통기한:</strong> ${item.expireDate}</p>
        </div>
        <button type="button" class="btn-consume-toggle" data-id="${item.id}"
                aria-label="${item.name} ${isConsumed ? "보관 중으로 되돌리기" : "소비 완료 처리하기"}">
          ${isConsumed ? "보관 중으로 되돌리기" : "소비 완료 처리"}
        </button>
      `;
      foodListContainer.appendChild(card);
    });
  }

  if (foodSearchInput) {
    foodSearchInput.addEventListener("input", function (e) {
      currentSearchQuery = e.target.value.trim();
      renderFoodList();
    });
  }

  if (storageFilter) {
    storageFilter.addEventListener("change", function (e) {
      currentStorageFilter = e.target.value;
      renderFoodList();
    });
  }

  if (dashTabs.length > 0) {
    dashTabs.forEach(tab => {
      tab.addEventListener("click", function (e) {
        dashTabs.forEach(t => {
          t.classList.remove("is-active");
          t.setAttribute("aria-pressed", "false");
        });
        e.currentTarget.classList.add("is-active");
        e.currentTarget.setAttribute("aria-pressed", "true");
        currentStatusTab = e.currentTarget.dataset.status;
        renderFoodList();
      });
    });
  }

  if (foodListContainer) {
    foodListContainer.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-consume-toggle")) {
        const id = parseInt(e.target.dataset.id, 10);
        const targetItem = foodList.find(item => item.id === id);
        if (targetItem) {
          targetItem.status = targetItem.status === "storing" ? "consumed" : "storing";
          renderFoodList();
          // 상태 변경 후 현재 선택된 필터 탭으로 초점을 안전하게 유지
          const selectedFilter = document.querySelector('.dash-tab[aria-pressed="true"]');
          if (selectedFilter) selectedFilter.focus();
        }
      }
    });
  }

  const btnResetFilter = document.querySelector("#btnResetFilter");
  if (btnResetFilter) {
    btnResetFilter.addEventListener("click", function () {
      currentSearchQuery = "";
      currentStorageFilter = "all";
      currentStatusTab = "all";
      if (foodSearchInput) foodSearchInput.value = "";
      if (storageFilter) storageFilter.value = "all";
      dashTabs.forEach((t, idx) => {
        const isFirst = idx === 0;
        t.classList.toggle("is-active", isFirst);
        t.setAttribute("aria-pressed", String(isFirst));
      });
      renderFoodList();
      if (dashTabs[0]) dashTabs[0].focus();
    });
  }

  const btnGoToRegister = document.querySelector("#btnGoToRegister");
  if (btnGoToRegister) {
    btnGoToRegister.addEventListener("click", function () {
      const flowSection = document.querySelector("#flowSection");
      if (flowSection) {
        flowSection.scrollIntoView({ behavior: "smooth" });
        const stepFoodNameEl = document.querySelector("#stepFoodName");
        if (stepFoodNameEl) stepFoodNameEl.focus();
      }
    });
  }

  // ======================================================================
  // 5. 4단계 식재료 간편 등록 흐름 (aria-invalid & 단계 이동 초점 관리)
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
      if (isCurrent) {
        const heading = panel.querySelector("h3");
        if (heading) heading.focus();
      }
    });

    stepIndicators.forEach((indicator, index) => {
      const isCurrent = (index + 1) === stepNumber;
      indicator.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        indicator.setAttribute("aria-current", "step");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });
  }

  function validateStep1() {
    if (!stepFoodName || !stepFoodCategory || !step1Error) return false;
    const nameVal = stepFoodName.value.trim();
    const catVal = stepFoodCategory.value;

    stepFoodName.setAttribute("aria-invalid", "false");
    stepFoodCategory.setAttribute("aria-invalid", "false");

    if (!nameVal) {
      step1Error.textContent = "식재료 이름을 입력해 주세요.";
      step1Error.hidden = false;
      stepFoodName.setAttribute("aria-invalid", "true");
      stepFoodName.focus();
      return false;
    }

    if (!catVal) {
      step1Error.textContent = "카테고리를 선택해 주세요.";
      step1Error.hidden = false;
      stepFoodCategory.setAttribute("aria-invalid", "true");
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

    stepStorage.setAttribute("aria-invalid", "false");
    stepExpireDate.setAttribute("aria-invalid", "false");

    if (!storageVal) {
      step2Error.textContent = "보관 장소를 선택해 주세요.";
      step2Error.hidden = false;
      stepStorage.setAttribute("aria-invalid", "true");
      stepStorage.focus();
      return false;
    }

    if (!dateVal) {
      step2Error.textContent = "유통기한 날짜를 지정해 주세요.";
      step2Error.hidden = false;
      stepExpireDate.setAttribute("aria-invalid", "true");
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

  const btnCompleteStep = document.querySelector("#btnCompleteStep");
  if (btnCompleteStep) {
    btnCompleteStep.addEventListener("click", function () {
      registrationData.alarm = stepAlarmCheck ? stepAlarmCheck.checked : true;
      const alarmTxt = registrationData.alarm ? " (알림 등록 완료)" : " (알림 미설정)";

      if (completeMessage) {
        completeMessage.textContent = `'${registrationData.foodName}' (${registrationData.storage}) 항목이 등록되었습니다.${alarmTxt}`;
      }

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

  const btnResetFlow = document.querySelector("#btnResetFlow");
  if (btnResetFlow) {
    btnResetFlow.addEventListener("click", function () {
      if (stepFoodName) {
        stepFoodName.value = "";
        stepFoodName.setAttribute("aria-invalid", "false");
      }
      if (stepFoodCategory) {
        stepFoodCategory.value = "";
        stepFoodCategory.setAttribute("aria-invalid", "false");
      }
      if (stepStorage) {
        stepStorage.value = "";
        stepStorage.setAttribute("aria-invalid", "false");
      }
      if (stepExpireDate) {
        stepExpireDate.value = "";
        stepExpireDate.setAttribute("aria-invalid", "false");
      }
      if (stepAlarmCheck) stepAlarmCheck.checked = true;
      if (step1Error) step1Error.hidden = true;
      if (step2Error) step2Error.hidden = true;

      registrationData.foodName = "";
      registrationData.category = "";
      registrationData.storage = "";
      registrationData.expireDate = "";
      registrationData.alarm = true;
      goToStep(1);
      if (stepFoodName) stepFoodName.focus();
    });
  }

  // ======================================================================
  // 6. 맞춤 알림 신청 및 조건부 폼 (aria-invalid & aria-busy 적용)
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
        contactLabel.innerHTML = '이메일 주소 <span class="required" aria-hidden="true">*</span><span class="visually-hidden">(필수)</span>';
        contactInput.placeholder = "example@email.com";
        contactInput.setAttribute("required", "true");
        contactInput.focus();
      } else if (channel === "sms") {
        conditionalWrapper.hidden = false;
        contactInput.disabled = false;
        contactLabel.innerHTML = '휴대폰 번호 <span class="required" aria-hidden="true">*</span><span class="visually-hidden">(필수)</span>';
        contactInput.placeholder = "010-1234-5678";
        contactInput.setAttribute("required", "true");
        contactInput.focus();
      }
    });

    if (notifyFoodName) {
      notifyFoodName.addEventListener("input", validateFoodName);
    }
    contactInput.addEventListener("input", validateContact);

    function validateFoodName() {
      const val = notifyFoodName.value.trim();
      if (val.length < 2) {
        showError(notifyFoodName, foodNameError, "식재료 이름을 2자 이상 입력해 주세요.");
        return false;
      }
      clearError(notifyFoodName, foodNameError);
      return true;
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
      inputEl.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
    }

    function clearError(inputEl, errorEl) {
      inputEl.classList.remove("is-invalid");
      inputEl.setAttribute("aria-invalid", "false");
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

    customNotifyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const isFoodValid = validateFoodName();
      const isContactValid = validateContact();

      if (!isFoodValid || !isContactValid) {
        if (formResultFeedback) {
          formResultFeedback.className = "result-feedback is-error";
          formResultFeedback.textContent = "⚠ 입력한 항목에 오류가 있습니다. 수정 후 다시 시도해 주세요.";
          formResultFeedback.hidden = false;
        }
        if (!isFoodValid && notifyFoodName) notifyFoodName.focus();
        else if (!isContactValid) contactInput.focus();
        return;
      }

      customNotifyForm.setAttribute("aria-busy", "true");
      if (btnSubmitNotify) {
        btnSubmitNotify.disabled = true;
        btnSubmitNotify.textContent = "알림 정보 등록 중...";
      }
      if (formResultFeedback) {
        formResultFeedback.className = "result-feedback";
        formResultFeedback.textContent = "알림 정보를 저장하는 중입니다...";
        formResultFeedback.hidden = false;
      }

      setTimeout(function () {
        customNotifyForm.setAttribute("aria-busy", "false");
        if (btnSubmitNotify) {
          btnSubmitNotify.disabled = false;
          btnSubmitNotify.textContent = "맞춤 알림 등록하기";
        }

        if (formResultFeedback) {
          formResultFeedback.className = "result-feedback is-success";
          const channelText = notifyChannel.value === "none"
            ? "앱 현황판 전용"
            : notifyChannel.options[notifyChannel.selectedIndex].text;
          formResultFeedback.textContent = `✓ '${notifyFoodName.value.trim()}'의 맞춤 알림(${channelText}) 설정이 성공적으로 등록되었습니다.`;
          formResultFeedback.hidden = false;
        }

        customNotifyForm.reset();
        if (notifyFoodName) {
          notifyFoodName.classList.remove("is-valid");
          notifyFoodName.setAttribute("aria-invalid", "false");
        }
        contactInput.classList.remove("is-valid");
        contactInput.setAttribute("aria-invalid", "false");
        conditionalWrapper.hidden = true;
        contactInput.disabled = true;
      }, 1200);
    });
  }

  // ======================================================================
  // 7. 하단 기본 이메일 구독 폼
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
        subscribeMessage.textContent = "⚠ 이메일을 입력한 뒤 신청해 주세요.";
        subscribeMessage.classList.remove("is-success");
        subscribeMessage.classList.add("is-error");
        emailInput.setAttribute("aria-invalid", "true");
        emailInput.focus();
        return;
      }

      emailInput.setAttribute("aria-invalid", "false");
      subscribeMessage.textContent = `✓ ${emailVal}님, '신선한 냉장고' 유통기한 알림 신청이 완료되었습니다.`;
      subscribeMessage.classList.remove("is-error");
      subscribeMessage.classList.add("is-success");
      subscribeButton.textContent = "신청 완료";
      subscribeButton.disabled = true;
    });
  }

  renderFoodList();
});