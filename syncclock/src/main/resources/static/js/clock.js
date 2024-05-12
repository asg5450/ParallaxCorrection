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

    for (let i = 1; i < 11; i++) {
        let browserBefore = new Date().getTime();
        let response = await fetch("/clockRest/wasNow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        let data = await response.json();
        let browserAfter = new Date().getTime();

        console.log("browserBefore: " + browserBefore);
        console.log("browserAfter: " + browserAfter);
        console.log("result: " + (browserAfter-browserBefore)/2);

        if(true){
            console.log(`${i}회차 Browser 요청/응답 소요시간 = ${browserAfter-browserBefore}`)
            resTimeArray.push((browserAfter-browserBefore)/2);
        }

        if(i === 10){
            let timeDifference = null;
            let averageRequestTime = resTimeArray.reduce((acc, item)=>acc+item, 0)/9;
            console.log("averageRequestTime = " + averageRequestTime);
            return averageRequestTime;
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
    console.log("was data: " + data);
}

//시계 출력
function showClock(averageTime, dbTime){

    console.log(averageTime);
    console.log(dbTime);

    let browser = new Date().getTime();
    let newBrowserTime = browser+averageTime+dbTime;
    console.log(newBrowserTime);
    //1초마다 반복
    setInterval(() => {
        // milliseconds -> Date 객체로 변환
        let newDate = new Date(newBrowserTime);

        console.log("새 브라우저 시간:" + newDate);
        console.log("시간:" + newDate.getHours());
        console.log("시간:" + newDate.getMinutes());
        console.log("시간:" + newDate.getSeconds());

        // Date 객체에서 시간,분,초 데이터 추출  후 포맷
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        let seconds = newDate.getSeconds();

        let formattedTime = hours + ':' + minutes + ':' + seconds;

        console.log(formattedTime);
        // innerHTML
        document.getElementById('clock').innerHTML = formattedTime;

        // 반복 될 때마다 1초씩 더하기
        newBrowserTime += 1000;
    }, 1000);
}