


window.onload = async () => {

    // 화면 첫 렌더링 시 브라우저 창 크기에 맞게 video full sizing
    let videoBlock = document.getElementById("movie_box");
    resizeForBrowserSize(videoBlock);

    // 미디어 파일명을 쿼리스트링에 맞게 리턴받아서 video 태그 src값 기입
    let mediaName = getMediaFileName("view");
    videoBlock.src = mediaName;
    videoBlock.style.objectFit = "fill"

    let resultTime = await timeCheckForBrowserToDb();

    playVideo(resultTime, videoBlock, mediaName);

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
    let videoBlock = document.getElementById("movie_box");
    resizeForBrowserSize(videoBlock);
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