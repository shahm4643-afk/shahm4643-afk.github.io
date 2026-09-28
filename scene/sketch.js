// Interactive Scene
// Muhammad Abidi
// Sep 27
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

state = 
async function setup() {
  createCanvas(windowWidth, windowHeight);
}




function draw() {
  background(220);
  movingSlider();

  
}

function movingSlider() {
  fill("black")
  rect(windowWidth/2 - 50, windowHeight/2 - 50, 100, 100);
}