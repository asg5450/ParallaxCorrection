window.onload = () => {
  // Browser <-> WAS 간 통신 속도를 담는 변수
  let averageTime = averageReqResTime();
};

function averageReqResTime() {
  let resTimeArray = new Array();

  for (let i = 0; i < 10; i++) {
    fetch("경로", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.json)
      .then((data) => {
        console.log(data);
        resTimeArray.push(data);
      });
  }
}
