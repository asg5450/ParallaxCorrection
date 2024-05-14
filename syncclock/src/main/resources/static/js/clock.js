window.onload = async () => {
    // Browser <-> WAS 간 통신 속도를 담는 변수
    let averageTimePromise = averageReqResTime();
    let dbTimePromise = dbReqResTime();
    //Promise 객체에서 Result값 추출
    let [averageTime, dbTime] = await Promise.all([averageTimePromise, dbTimePromise]);

    console.log(averageTime);
    console.log(dbTime);
    showClock(averageTime, dbTime);
};

async function averageReqResTime() {
    let resTimeArray = new Array();

    // 10회 평균을 구하는 JS for문
    for (let i = 1; i < 11; i++) {

        // Java 요청 전 브라우저 Before 시간
        let browserBefore = new Date().getTime();

        // Java Now 요청
        let response = await fetch("/clockRest/wasNow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        let data = await response.json();

        // Java 요청 후 브라우저 After 시간
        let browserAfter = new Date().getTime();

        // 1회차 이후 부터 console로깅 및 평균가산배열 추가
        if(i !== 1){
            // console.log(`${i}회차 Browser 요청 소요시간 환산 값 = ${(browserAfter-browserBefore)/2}`);
            resTimeArray.push((browserAfter-browserBefore)/2);
        }

        // 10회차에 브라우저 <-> WAS 시차 계산
        if(i === 10){
            let timeDifference = null;
            let averageRequestTime = resTimeArray.reduce((acc, item)=>acc+item, 0)/9;
            let browserAndWasTimeDifference = data - browserBefore - averageRequestTime;
            console.log("browserAndWasTimeDifference = " + browserAndWasTimeDifference);
            return browserAndWasTimeDifference;
        }
    }
}
async function dbReqResTime(){
    let response = await fetch("/clockRest/dbNow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
    let data = await response.json();
    return data;
}

//시계 출력
function showClock(averageTime, dbTime){

    // Locale 하지 않은 현재 시간
    let now = new Date();

    // Locale한 날짜 얻기
    let localeDate = now.toLocaleDateString("en-GB").split("/");

    // Locale한 시간 얻기
    let localeTime = now.toLocaleTimeString("en-GB").split(":");

    // Locale 인자 요소 취합
    localeDate = localeDate.map((item)=> parseInt(item));
    localeTime = localeTime.map((item)=> parseInt(item));

    let localeDateTime = new Date(localeDate[0], localeDate[1], localeDate[2], localeTime[0], localeTime[1], localeTime[2]);

    // GMT 기준의 시간을 산출
    let gmtNow = localeDateTime.getTime() + now.getTimezoneOffset() * 60 * 1000;

    // 한국 Offset 환산 (한국이 GMT 시간보다 9시간 선행)
    let koreaTimeDiff = 9 * 60 * 60 * 1000;

    // 해당 브라우저의 시간 오차 보정 (한국 시간으로 통일)
    let browser = new Date(gmtNow + koreaTimeDiff).getTime();
    let newBrowserTime = browser+averageTime+dbTime;

    //1초마다 반복
    setInterval(() => {

        // milliseconds -> Date 객체로 변환
        let newDate = new Date(newBrowserTime);

        // Date 객체에서 시간,분,초 데이터 추출  후 포맷
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        let seconds = newDate.getSeconds();

        let formattedTime = hours + ':' + minutes + ':' + seconds;

        // innerHTML
        document.getElementById('clock').innerHTML = formattedTime;

        // 반복 될 때마다 1초씩 더하기
        newBrowserTime += 1000;
    }, 1000);
}