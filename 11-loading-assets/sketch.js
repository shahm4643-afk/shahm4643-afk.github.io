// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let coinImg;
let coinSound;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  coinImg = await loadImage("coin.png");
  coinSound = await loadSound("coin.wav");
}

function draw() {
  background(220);


  image(coinImg, width/2, height/2);
}

function mousePressed () {
  coinSound.play();
}