// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


// Traffic Light Starter Code
// Your Name Here
// The Date Here

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis
const GREEN = "green";
const YELLOW = "yellow";
const RED = "red";
state = ("GREEN");

let timeYellow = 2000;
let timeGreen = 5000;
let timeRed = 2000;

async function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  chooseLight();
  drawOutlineOfLights();
  displayCorrectLights();
}


function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  //lights
  fill(255);
  ellipse(width/2, height/2 - 65, 50, 50); //top
  ellipse(width/2, height/2, 50, 50); //middle
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
}

function displayCorrectLights() {
  if (state === GREEN) {
    fill("green");
    ellipse(width/2, height/2 - 65, 50, 50); //top
    state = ("yellow");

  } else if (state === YELLOW) {
    fill("yellow");
    ellipse(width/2, height/2, 50, 50); //middle
    state = ("red");
  }
  else if (state === RED) {
    fill("red")
    ellipse(width/2, height/2 + 65, 50, 50); //bottom

  }

}

function chooseCorrectLight() {
  if (state === GREEN && millis() >= lastSwitchedTime + greenLightDuration) {
    state = YELLOW;
    lastSwitchedTime = millis();
  }

  if (state === YELLOW && millis() >= lastSwitchedTime + yellowLightDuration) {
    state = RED;
    lastSwitchedTime = millis();
  }

  if (state === RED && millis() >= lastSwitchedTime + redLightDuration) {
    state = GREEN;
    lastSwitchedTime = millis();
  }
}



// function drawOutlineOfLights() {
//   //box
//   rectMode(CENTER);
//   fill(0);
//   rect(width/2, height/2, 75, 200, 10);

//   //lights
//   fill(255);
//   if (state === "green") {
//     fill("green");
//     ellipse(width/2, height/2 - 65, 50, 50); //top
//     state = "yellow"; 
//   }
//     else if (state === "yellow") {
//     fill("yellow")
//     ellipse(width/2, height/2, 50, 50); //middle
//     }
  


//   ellipse(width/2, height/2 - 65, 50, 50); //top

//   ellipse(width/2, height/2, 50, 50); //middle
  
//   ellipse(width/2, height/2 + 65, 50, 50); //bottom
//   fill("green");
// }
