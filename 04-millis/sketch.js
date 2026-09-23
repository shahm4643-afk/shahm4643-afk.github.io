// Millis demo

let waitTime = 2000;
let lastSwapTime = 0;
let state = "red";
async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  drawbackground();
  swapIfNeeded()
  // console.log(millis());
}

function swapIfNeeded() {
  if (millis() > lastSwapTime + waitTime) {
    lastSwapTime = millis();
    if (state === "red") {
      state = "black";
    }
    else if (state === "black") {
      state === "red";
    }
  }
}


function drawbackground() {
  // if (millis() % (waitTime*2) < waitTime) {
  //   background("green");
  // }
  // else {
  //   background("lightblue");
  // }
  
  if (state === "black") {
    background("black");
  }
  else if (state === "red") {
    background("red");
  }
}