// Interactive Scene
// Muhammad Abidi
// Sep 27
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


state = "wallInFront";
 

let sliderWidth = 100;
let sliderHeight = 20;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}




function draw() {
  background(220);
  movingSlider();

  
}

function movingSlider() {
  fill("black");
  rect(windowWidth/2 - (sliderWidth/2), windowHeight/2 - (sliderHeight/2), sliderWidth, sliderHeight);
}