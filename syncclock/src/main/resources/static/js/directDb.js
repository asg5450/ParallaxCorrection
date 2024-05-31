


window.onload = async () => {

    // 화면 첫 렌더링 시 브라우저 창 크기에 맞게 video full sizing
    let colorPaper = document.getElementById("colorPaper");
    resizeForBrowserSize(colorPaper);

    colorPaper.style.objectFit = "fill";

    let dbTime = await timeCheckForBrowserToDb();
    let oneMinuteConversion = 1 * 60 * 1000;
    let delayTime = oneMinuteConversion - (dbTime % oneMinuteConversion);
    console.log(delayTime/1000 + "초 후에 colorPrintTrigger 동작");

    colorPrintTrigger(delayTime);

    // delayTime 후에 동작하는 setTimeout 트리거
    function colorPrintTrigger(delayTime){
        setTimeout(() => {

            // delayTime 초 후에 바로 색깔변화 시작
            colorPrintOneCycle();

            // 30초 텀으로 Interval 생성
            setInterval(() => {
                colorPrintOneCycle();
            }, 30000)
        }, delayTime)
    }

    function colorPrintOneCycle(){
        console.log("colorPrintOneCycle() 발동");
        setTimeColorChanger("5000", "red", colorPaper)
            .then((resolve) => setTimeColorChanger("5000", "orange", colorPaper))
            .then((resolve) => setTimeColorChanger("5000", "yellow", colorPaper))
            .then((resolve) => setTimeColorChanger("5000", "green", colorPaper))
            .then((resolve) => setTimeColorChanger("5000", "blue", colorPaper))
            .then((resolve) => setTimeColorChanger("5000", "darkblue", colorPaper))

    }

    function setTimeColorChanger(delay, color, targetElement){
        return new Promise((resolve) => {
            console.log("setTimeColorChanger  " + color + "  발동");
            targetElement.style.backgroundColor = color;
            setTimeout(() => {
                resolve();
            }, delay);
        })
    }



}

// 브라우저 창에 맞게 targetBlock Node의 width, height 크기 변경
function resizeForBrowserSize(targetBlock){
    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;
    targetBlock.style.width = `${currentWidth}px`;
    targetBlock.style.height = `${currentHeight}px`;
}

// 화면 크기 변경할 때마다 video 태그 full sizing
window.onresize = () => {
    let colorPaper = document.getElementById("colorPaper");
    resizeForBrowserSize(colorPaper);
};

// view 쿼리스트링값을 가지고 video파일에 넣을 src 값을 리턴
function getMediaFileName(param){
    let strUrl = window.location.search;
    let viewNum = parseInt(new URLSearchParams(strUrl).get(param));
    let mediaName = "/media/";
    switch(viewNum){
        case 1:case 2:case 3:case 4:
            mediaName += "Interstellar_crop_" + viewNum + ".mp4";
            break;
        case 5:
            mediaName += "Interstellar_onlySound.mp3";
    }
    return mediaName;
}

// fetch 함수를 통해 DB SYSDATE를 JS로 받아오는 함수
function getDbnow(){
    // return fetch("/syncclock-0.0.1-SNAPSHOT/clockRest/jsToDb", {
        return fetch("/clockRest/jsToDb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    }).then((response)=>response.json());
}

async function timeCheckForBrowserToDb(){
    while (true){
        let browserBefore = new Date().getTime();
        let dbNowTimestamp = await getDbnow();
        let browserAfter = new Date().getTime();
        let responseTime = (browserAfter - browserBefore);

        console.log("browserBefore", browserBefore);
        console.log("browserAfter", browserAfter);
        console.log("responseTime", responseTime);
        console.log("return : dbNow", dbNowTimestamp);

        // JS now를 찍고 DB now를 받아오는데 10ms 안에 이루어지면
        if(responseTime <= 10){
            // 루프 종료
            return dbNowTimestamp;
        }
    }
}

// timestamp와 시계 블록을 인자로 주면 시간 표출 및 색깔 변화 Interval 주는 함수
async function playVideo(timestamp, targetBlock, mediaName){

    // 다음 5분 단위에 재생이 시작되도록 설정
    let calcTimestamp = new Date(timestamp).getTime();
    console.log("calcTimestamp = " + calcTimestamp);

    // 5분을 밀리초 단위로 변수 저장
    let fiveMinuteConversion = 5 * 60 * 1000;
    console.log("fiveMinuteConversion = " + fiveMinuteConversion);

    let remainingTime = calcTimestamp % fiveMinuteConversion;
    console.log("remainingTime = " + remainingTime);

    // 몇 밀리초 후에 영화가 재생되는지 계산
    let minuteIntervalTimer = fiveMinuteConversion - remainingTime;
    console.log(minuteIntervalTimer/1000 + "초 후에 영화가 재생됩니다.");

    setTimeout(() => {

        // 바로 재생
        playQue(targetBlock, mediaName);

        // 5분마다 반복 실행 설정
        setInterval(() => {
            playQue(targetBlock, mediaName);
        }, fiveMinuteConversion);

    }, minuteIntervalTimer);
    // }, 10000);
}

function playQue(targetBlock, mediaName){
    // targetBlock.muted = true;
    targetBlock.play();
}