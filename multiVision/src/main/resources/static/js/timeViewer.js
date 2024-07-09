
// import {fetchWasNow} from "./clock";
// import {dbSysdateGet} from "./clock";

window.onload = async () => {

    // JS -> Java 요청 소요시간
    let javaAverageReqTime = await averageReqResTime(100);

    // Browser now
    let browserNow = new Date().getTime();

    // Browser와 비교할 Java now
    let browserAfterJava = await fetchWasNow();

    // Browser 와 Java의 시차
    let jsJavaTimeDifference = browserAfterJava - javaAverageReqTime - browserNow;

    // [0] DB "select now(3)" 리턴값
    // [1] Java -> DB 소요 시간
    // [2] DB와 비교할 Java now
    let dbTime = await dbSysdateGet();

    // Java 와 DB의 시차
    let javaDbTimeDifference = dbTime[0] - dbTime[1] - dbTime[2];

    // HTML에 값 표시
    let browserTimeBox = document.getElementById("browserTimeBox");
    browserTimeBox.innerHTML = "JS now = " + browserNow;

    let javaAverageReqTimeBox = document.getElementById("javaAverageReqTimeBox");
    javaAverageReqTimeBox.innerHTML = "JS -> Java 소요시간 = " + javaAverageReqTime;

    let browserAfterJavaBox = document.getElementById("browserAfterJavaBox");
    browserAfterJavaBox.innerHTML = "JS now 이후 Java Now =     " + browserAfterJava;

    let browserJavaTimedifferenceBox = document.getElementById("browserJavaTimedifferenceBox");
    browserJavaTimedifferenceBox.innerHTML = "JS 와 Java의 시간 차이 = " + jsJavaTimeDifference;

    let javaTime = document.getElementById("javaTime");
    javaTime.innerHTML = "DB와 비교할 Java Now =     " + dbTime[2];

    let dbQueryTime = document.getElementById("dbQueryTime")
    dbQueryTime.innerHTML = "Java -> DB 소요시간 =    " + dbTime[1];

    let sysdateTime = document.getElementById("sysdateTime");
    sysdateTime.innerHTML = "dbTime =           " + dbTime[0];

    let javaDbTimedifferenceBox = document.getElementById("javaDbTimedifferenceBox");
    javaDbTimedifferenceBox.innerHTML = "Java 와 DB 시간 차이 = " + javaDbTimeDifference;

    // 시차와 요청 소요시간을 인자로 넘겨서 2가지 시간을 출력해주는 함수
    showClock(jsJavaTimeDifference, javaDbTimeDifference, javaAverageReqTime, dbTime[1]);
}

// fetch 함수를 통해 JAVA Now()를 받아오는 함수
function fetchWasNow(){
    return fetch("/clockRest/wasNow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    }).then((response) => response.json());
}

// fetch 함수를 통해 DB SYSDATE를 JS로 받아오는 함수
function dbSysdateGet(){
    return fetch("/clockRest/dbSysdateGet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    }).then((response)=>response.json());
}

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

        // 요청~응답 소요시간
        let ReqResTime = browserAfter - browserBefore;

        // 1회차는 버리고 2회차 이후 부터 && 10ms 이하의 빠른 응답만 평균가산배열 추가
        if(i !== 1){
            // console.log(`${i}회차 (browserAfterUTC - browserBeforeUTC) / 2 = ${ReqResTime / 2}`);
            resTimeArray.push(ReqResTime/2);
        }

        // 브라우저 <-> WAS 시차 n회 계산 마지막에 수행
        if(i === cycle){

            // 요청/응답 소요시간이 n회 전부 10ms를 넘었을 때
            if(resTimeArray.length === 0){
                console.log("10ms 이내의 요청/응답이 이루어지지 않는 열악한 네트워크 환경이군요.");
                return;
            }

            // 요청~응답시간이 10ms 이하인 배열에서 평균 소요시간 획득
            let averageRequestTime = resTimeArray.reduce((acc, item)=>acc+item, 0)/resTimeArray.length;
            // console.log("평균 요청 소요시간 = " + averageRequestTime);

            return averageRequestTime;
        }
    }
}

// 시차와 요청 소요시간을 인자로 넘겨서 2가지 시간을 출력해주는 함수
async function showClock(jsJavaTimeDifference, javaDbTimeDifference, javaAverageReqTime, dbQueryReqTime){

    // 시계 블록 지정
    const clock = document.getElementById('clock');

    // DB 시간 return 받기
    // [0] DB "select now(3)" 리턴값
    // [1] Java -> DB 소요 시간
    // [2] DB와 비교할 Java now
    let dbGet = await dbSysdateGet();

    // DB return 받아서 JS까지 오는 시간 환산
    let getDbNowAndDelay = dbGet[0] + dbQueryReqTime + javaAverageReqTime;
    const dbNowAndDelay = document.getElementById('dbNowAndDelay');
    dbNowAndDelay.innerHTML = "DB return 값 + JS까지 도착하는데 걸린 시간 = " + Math.floor(getDbNowAndDelay);

    let now = new Date();

    // 브라우저의 현재 시간 (KST 형태로 통일)
    let browser = now.getTime() + now.getTimezoneOffset() * 60 * 1000 + 9 * 60 * 60 * 1000;

    // 브라우저 현재 시간에 시차를 계산한 결과
    let calcTimestamp = browser+jsJavaTimeDifference+javaDbTimeDifference;
    const jsNowAndTimedifference = document.getElementById('jsNowAndTimedifference');
    jsNowAndTimedifference.innerHTML = "JS Now + DB와의 시차 = " + Math.floor(calcTimestamp);

    // timestamp값을 시간 형태로 targetBlock에 출력해줌 (ms 단위)
    dateToTimeFormat(calcTimestamp, clock);

    // 색을 랜더링할 배경 블록
    const background_div = document.getElementById("background_div");

    // n초 뒤 00초에 색깔 랜더링 시작
    let calcTimestampDate = new Date(calcTimestamp);
    let minuteIntervalTimer = 60 * 1000 - (calcTimestampDate.getSeconds() * 1000 + calcTimestampDate.getMilliseconds());
    console.log(minuteIntervalTimer/1000 + "초 후에 setTimeout 발동");
    setTimeout(() => {

        // 바로 실행
        console.log("최초 colorRendering 발동");
        colorRendering(background_div);

        // 1분마다 반복 실행 설정
        setInterval(() => {
            console.log("setInterval에 의한 colorRendering 발동");
            colorRendering(background_div);
        }, 60000)

    }, minuteIntervalTimer);

    //1초마다 1초를 올리고 시간 표출
    setInterval(() => {

        // 시계 1초 증가
        calcTimestamp += 1000;
        dateToTimeFormat(calcTimestamp, clock);

    }, 1000);
}

// timestamp값을 시간 형태로 targetBlock에 출력해줌 (ms 단위)
function dateToTimeFormat(targetTimestamp, targetBlock){

    let newDate = new Date(targetTimestamp);

    // Date 객체에서 시간,분,초 데이터 추출  후 포맷
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();
    let seconds = newDate.getSeconds();
    let milliSec = newDate.getMilliseconds();

    let formattedTime = hours + ':' + minutes + ':' + seconds + ":" + milliSec;

    targetBlock.innerHTML = formattedTime;
}



// await 리턴 Promise를 활용하여 5초마다 then()으로 색깔을 바꿔주는 함수  -- 하위함수 有
async function colorRendering(targetBlock){

    // 모든 색깔 배열
    let colorArray = ["back_red", "back_orange", "back_yellow", "back_green", "back_blue", "back_darkblue"];

    let iterNum = 1;

    // 빨,주,노,초,파,남 (30초) -> 2번 하면 1분
    for(let i = 0; i < 2; i++){
        colorClassChanger(targetBlock, colorArray[5], colorArray[0]);
        await timerColorChanger(targetBlock, iterNum, colorArray)
            .then((iter) => timerColorChanger(targetBlock, iter, colorArray))
            .then((iter) => timerColorChanger(targetBlock, iter, colorArray))
            .then((iter) => timerColorChanger(targetBlock, iter, colorArray))
            .then((iter) => timerColorChanger(targetBlock, iter, colorArray))
            .then((iter) => timerColorChanger(targetBlock, iter, colorArray))
    }
}

// iteratorNum을 받아서 해당하는 색깔 배열에서 색을 정해서 targetBlock에 색칠하도록 명령하달
function timerColorChanger(targetBlock, iteratorNum, colorArray){

    console.log("iterNum = " + iteratorNum + " timeColorChanger 진입 5초를 기다려보자!");

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("5초를 기다려서 timerColorChanger 의 setTimeout 진입");
            colorClassChanger(targetBlock, colorArray[iteratorNum-1], colorArray[iteratorNum]);
            resolve(iteratorNum + 1);
        }, 5000);
    });
}

// 위 함수 ( timeColorChanger )에서 정해준 색깔의 class를 실제 targetBlock에 추가하는 함수
function colorClassChanger(targetBlock, removeColor, addColor){
    if(removeColor !== null && removeColor !== undefined){
        targetBlock.classList.remove(removeColor);
    }
    targetBlock.classList.add(addColor);
}