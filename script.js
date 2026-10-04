// 1. 서비스 정보 및 상태 변수 선언 (고정값 const, 변하는 값 let)
const serviceName = "신선한 냉장고";
let isSubscribed = false;
let submitCount = 0;

// 2. DOM 요소 선택 (HTML의 id로 요소 가져오기)
const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

// 3. 안내 문구 생성 함수 (상태에 따라 문구 반환)
function makeSubscribeMessage(email, subscribed) {
    if (subscribed) {
        return `${email}님, '${serviceName}' 유통기한 알림 신청이 완료되었습니다!`;
    }
    return "이메일을 입력한 뒤 신청해 주세요.";
}

// 4. 폼 제출(submit) 처리 함수
function handleSubscribe(event) {
    // 폼 제출 시 페이지가 새로고침되는 기본 동작 방지
    event.preventDefault();

    // 입력값 가져오기 (앞뒤 공백 제거)
    const subscriberEmail = emailInput.value.trim();

    // [예외 처리] 이메일이 입력되지 않은 경우
    if (subscriberEmail === "") {
        subscribeMessage.textContent = "이메일을 입력한 뒤 신청해 주세요.";
        emailInput.focus(); // 입력창으로 커서 이동
        return; // 함수 종료
    }

    // [성공 처리] 이메일이 올바르게 입력된 경우
    isSubscribed = true;
    submitCount += 1;

    // 완료 문구 변경 및 성공 스타일(.is-success) 추가
    subscribeMessage.textContent = makeSubscribeMessage(subscriberEmail, isSubscribed);
    subscribeMessage.classList.add("is-success");

    // 버튼 문구 변경 및 비활성화 (중복 제출 방지)
    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

// 5. 폼 제출 이벤트와 처리 함수 연결
subscribeForm.addEventListener("submit", handleSubscribe);