
window.onload = async () => {

    function searchParam(url, key){
        return new URLSearchParams(url).get(key);
    }

    let strUrl = window.location.search;
    const urlParams = new URLSearchParams(strUrl);
    let viewNum = parseInt(searchParam(urlParams, "view"));
    let mediaName = "/media/";
    switch(viewNum){
        case 1:case 2:case 3:case 4:
            mediaName += "Interstellar_crop_" + viewNum + ".mp4";
            break;
        case 5:
            mediaName += "Interstellar_onlySound.mp3";
    }

    const movie_box = document.getElementById("movie_box");
    const movie_box_src = document.createAttribute("src");
    movie_box_src.value = mediaName;
    movie_box.setAttributeNode(movie_box_src);

    let satisfaction = true;
    do{
        let browserBefore = new Date().getTime();
        let dbNowTimestamp = await getDbnow();
        let browserAfter = new Date().getTime();
        let responseTime = (browserAfter - browserBefore) / 2;

        // JS now를 찍고 DB now를 받아오는데 10ms 안에 이루어지면
        if(responseTime <= 10){

            // 시차 : DB now - JS before - 5ms
            let timeDifference= dbNowTimestamp - browserBefore - 5;

            // 브라우저 locale 시간
            let localeTime = new Date();

            // KST 시간으로 환산
            let kstTime = localeTime.getTime() + localeTime.getTimezoneOffset() * 60 * 1000 + 9 * 60 * 60 * 1000;

            // 브라우저 시간 + 시차
            let resultTimestamp = kstTime + timeDifference;

            // 시계에 표출
            playVideo(resultTimestamp, movie_box);


           satisfaction = false;
        }
    }
    while (satisfaction);


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

// timestamp와 시계 블록을 인자로 주면 시간 표출 및 색깔 변화 Interval 주는 함수
async function playVideo(timestamp, targetBlock){

    // 다음 5분 단위에 재생이 시작되도록 설정
    let calcTimestampDate = new Date(timestamp);
    console.log("targetBlock = " + targetBlock);

    // 현재 시간의 분, 초, 밀리초를 환산 변수에 저장
    let minuteConversion = (calcTimestampDate.getMinutes() % 5) * 60 * 1000;
    let secondConversion = calcTimestampDate.getSeconds() * 1000;
    let milliseconds = calcTimestampDate.getMilliseconds();

    // 5분을 밀리초 단위로 변수 저장
    let fiveMinuteConversion = 5 * 60 * 1000;

    // 몇 밀리초 후에 영화가 재생되는지 계산
    let minuteIntervalTimer = fiveMinuteConversion - minuteConversion - secondConversion - milliseconds;
    console.log(minuteIntervalTimer/1000 + "초 후에 영화가 재생됩니다.");

    setTimeout(() => {

        console.log("해당 초가 지나서 재생됩니다.")

        // 바로 재생
        playQue(targetBlock);

        // 5분마다 반복 실행 설정
        setInterval(() => {
            playQue(targetBlock);
        }, fiveMinuteConversion);

    }, minuteIntervalTimer);
    // }, 10000);
}

function playQue(targetBlock){
    targetBlock.muted = true;
    targetBlock.load();
    targetBlock.play();
}