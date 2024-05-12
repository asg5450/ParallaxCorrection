window.onload = () => {
    // Browser <-> WAS 간 통신 속도를 담는 변수
    let averageTime = averageReqResTime();
    let dbTime = dbReqResTime();
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
    console.log("was data: " + data);
}