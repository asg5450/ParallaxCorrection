window.onload = async () => {

    await Promise.all([averageReqResTime(10), dbReqResTime()]);

    //Promise 객체에서 Result값 추출
    let [averageTime, dbTime] = await Promise.all([averageReqResTime(100), dbReqResTime()]);

    console.log("averageTime = " + averageTime);
    console.log("dbTime = " + dbTime);
    showClock(averageTime, dbTime);
};

async function averageReqResTime(cycle) {

    // 10ms 이내에 요청/응답 소요시간을 담는 배열
    let resTimeArray = new Array();

    let validWasNow = 0;
    let validBrowserNow = 0;

    // 10회 평균을 구하는 JS for문
    for (let i = 1; i < cycle+1; i++) {

        // Java 요청 전 브라우저 Before 시간
        let browserBefore = new Date().getTime();

        // Java Now 요청
        let data = await fetchWasNow();

        // Java 요청 후 브라우저 After 시간
        let browserAfter = new Date().getTime();

        let ReqResTime = browserAfter - browserBefore;

        // console.log(`${i}회차 browserBefore 시간 = ${browserBefore}`);
        // console.log(`${i}회차 java 시간 = ${data}`);
        // console.log(`${i}회차 browserAfter 시간 = ${browserAfter}`);

        // 2회차 이후 부터 10ms 이하만 평균가산배열 추가
        if(i !== 1 && ReqResTime <= 10){
            console.log(`${i}회차 browserAfter - Before = ${ReqResTime}`);
            resTimeArray.push((browserAfter-browserBefore)/2);

            // 마지막 산식 (Java Now - JS Now - 평균요청시간)을 위한 유효한 회차의 JS Now, Java Now를 담아둔다.
            validWasNow = data;
            validBrowserNow = browserBefore;
        }

        // 10회차에 브라우저 <-> WAS 시차 계산
        if(i === cycle){
            // 10ms 이내의 요청/응답을 다 벗어났을 경우 얼리리턴
            if(resTimeArray.length === 0){
                console.log("10ms 이내의 요청/응답이 이루어지지 않는 열악한 네트워크 환경이군요.")
                return;
            }

            let averageRequestTime = resTimeArray.reduce((acc, item)=>acc+item, 0)/resTimeArray.length;
            console.log("평균 요청 소요시간 averageRequestTime = " + averageRequestTime);
            let browserAndWasTimeDifference = validWasNow - validBrowserNow - averageRequestTime;
            console.log("WAS - JS_Before - 평균 요청 소요시간 값 = " + browserAndWasTimeDifference);
            return browserAndWasTimeDifference;
        }
    }
}

// fetch 함수를 통해 JAVA Now()를 받아오는 함수
function fetchWasNow(){
    return fetch("/clockRest/wasNow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    }).then((response) => response.json());
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
    console.log("now = " + now);

    // Locale한 날짜 얻기
    let localeDate = now.toLocaleDateString("en-GB").split("/");
    console.log("localeDate = " + localeDate);

    // Locale한 시간 얻기
    let localeTime = now.toLocaleTimeString("en-GB").split(":");
    console.log("localeTime = " + localeTime);

    // Locale 인자 요소 취합
    localeDate = localeDate.map((item)=> parseInt(item));
    localeTime = localeTime.map((item)=> parseInt(item));

    let localeDateTime = new Date(localeDate[0], localeDate[1], localeDate[2], localeTime[0], localeTime[1], localeTime[2]);

    // GMT 기준의 시간을 산출
    let gmtNow = localeDateTime.getTime() + localeDateTime.getTimezoneOffset() * 60 * 1000;

    // 한국 Offset 환산 (한국이 GMT 시간보다 9시간 선행)
    let koreaTimeDiff = 9 * 60 * 60 * 1000;

    // 해당 브라우저의 시간 오차 보정 (한국 시간으로 통일)
    let browser = new Date(gmtNow + koreaTimeDiff).getTime();
    let newBrowserTime = browser+averageTime+dbTime;

    //1ms마다 반복
    setInterval(() => {

        // milliseconds -> Date 객체로 변환
        let newDate = new Date(newBrowserTime);

        // Date 객체에서 시간,분,초 데이터 추출  후 포맷
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        let seconds = newDate.getSeconds();
        let formattedTime = hours + ':' + minutes + ':' + seconds;

        // 시간 웹에 표출
        document.getElementById('clock').innerHTML = formattedTime;

        // 반복 될 때마다 10ms씩 더하기
        newBrowserTime += 1000;

        let timeShare = Math.floor(seconds / 5);

        let colorSelect;

        let colorArray = ["back_red", "back_orange", "back_yellow", "back_green", "back_blue", "back_darkblue"];

        const backgroundBlock = document.getElementById("background_div");

        //5로 나눈 몫에 따라 색깔 부여
        switch (timeShare){
            case 0:case 6:
                colorSelect = colorArray[0];
                break;
            case 1:case 7:
                colorSelect = colorArray[1];
                break;
            case 2:case 8:
                colorSelect = colorArray[2];
                break;
            case 3:case 9:
                colorSelect = colorArray[3];
                break;
            case 4:case 10:
                colorSelect = colorArray[4];
                break;
            case 5:case 11:
                colorSelect = colorArray[5];
                break;
        }

        // class 삭제
        function classRemove(item){
            backgroundBlock.classList.remove(item);
        }
        colorArray.forEach(classRemove)
        backgroundBlock.classList.add(colorSelect);



    }, 1000);
}