// windoe set interval demo
// change the color of the a circle every half second


let theColor;
async function setup() {
  createCanvas(windowWidth, windowHeight);
  changeColor();

  //  cakk the changecolor funtion 
  window.setInterval(changeColor, 500);
}

function draw() {
  background(220);
  fill(theColor);
  circle(width/2, height/2, 400);

}

function changeColor() {
  theColor = color(random(255), random(225), random (255));
}