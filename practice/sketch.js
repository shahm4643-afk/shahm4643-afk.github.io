// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


async function setup() {
  createCanvas(windowWidth, windowHeight);
}


function checkBlockCollisions() {
  for (let i = blocks.length - 1; i >= 0; i--) {
    let theBlock = blocks[i];

    let hitBlock = collideRectCircle(
      theBlock.x, theBlock.y, theBlock.w, theBlock.h,
      ballX, ballY, ballRadius * 2
    );

    if (hitBlock) {
      blocks.splice(i, 1);
      ballSpeedY = -ballSpeedY;

      score++;
      updateHighScore();

      break;
    }
  }
}

// to remove the 

function draw() {
  background(220);
}
