// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 900;
document.body.appendChild(canvas);

var goal = "sounds/goal.wav";
var saved = "sounds/saved.wav";
var gameloss = "sounds/loser.wav"
var soundEfx = document.getElementById("soundEfx");
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/soccfieldcropped2.png";


// border image L-R
var blReady = false;
var blImage = new Image();
blImage.onload = function () {
	blReady = true;
};
blImage.src = "images/BorderLeft.jpg";

// border image T-B
var btReady = false;
var btImage = new Image();
btImage.onload = function () {
	btReady = true;
};
btImage.src = "images/BorderTop.jpg";

var blocksReady = false;
var blocksImage = new Image();
blocksImage.onload = function () {
	blocksReady = true;
};
blocksImage.src = "images/blocks.png";
blocksImageLeft = 0;


// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
//heroImage.src = "images/hero.png";

heroImage.src = "images/soccball.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
//monsterImage.src = "images/monster.png";
monsterImage.src = "images/goal post.png";

// Game objects
var hero = {
	speed: 200, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0
};
var blocks ={
	x:0,
	y:0
}
var monstersCaught = 0;
var blocksHit= 0;

// Handle keyboard controls
var keysDown = {}; // object were we add up to 4 properties when keys go down
                // and then delete them when the key goes up

addEventListener("keydown", function (e) {
	console.log(e.keyCode + " down")
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	console.log(e.keyCode + " up")
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	//Place the monster somewhere on the screen randomly
	monster.x = 32 +  (canvas.width - 480);
	monster.y = 32 + (canvas.height - 905);

	
	blocks.y = 32 + (canvas.height - 800);
};
let start = Date.now(); // remember start time
let right = true;
let timer = setInterval(function() {
  // how much time passed from the start?
  let timePassed = Date.now() - start;

  

  
  draw(timePassed);

}, 20)


function draw(timePassed) {
	if (right == true)
	{
		if(blocks.x < canvas.width - 100){
			blocks.x +=  19;
		  
		}
		else{
			right = false;
			
		}
	}
	if (right == false)
	{
		if(blocks.x > canvas.width - 850){
			blocks.x -=  19;
		
		}
		else{
			right = true;
			
		}
	}

}

var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		if (hero.y < ( 32) ) {
			hero.y = 32;
		}

	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		if (hero.y > (1000 - ( 81) )) {
			hero.y = 1000 	 -81;
		}
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		if (hero.x < ( 21) ) {
			hero.x = 21;
		}
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		if (hero.x > ( 1000 - (32 +55 ) ) ) {
			hero.x = 1000 - (32 +55 );
		}
	}

	// Are they touching?
	if (
		hero.x+5 <= (monster.x + 50)
		&& monster.x <= (hero.x + 58)
		&& hero.y <= (monster.y + 60)
		&& monster.y <= (hero.y + 55)
	) 
	{
		++monstersCaught;
        soundEfx.src = goal ;
        soundEfx.play();


		reset();


	}
	if (
		hero.x+5 <= (blocks.x + 70)
		&& blocks.x <= (hero.x + 58)
		&& hero.y <= (blocks.y + 70)
		&& blocks.y <= (hero.y + 65)
	){
		++blocksHit;
		soundEfx.src = saved ;
        soundEfx.play();

		if(blocksHit == 2) {
			
			// change sound effect and play it.
			soundEfx.src = gameloss;
			soundEfx.play();}
		reset();
	}
  };

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (btReady) {
		ctx.drawImage(btImage, 0, 0);
		ctx.drawImage(btImage, 0, 900 - 32);
	}
	
	if (blReady) {
		ctx.drawImage(blImage, 0, 0);
		ctx.drawImage(blImage, 900 -32, 0);
	} 
if(blocksReady)
{
  ctx.drawImage(blocksImage,blocks.x,blocks.y)
}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goals scored: " + monstersCaught, 32, 32);
	ctx.fillText("Blocks hit: " +  blocksHit, 700,32)
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;

	var leftPosition = 0;

function move() {
    leftPosition += 5;
    blocksImage.style.left = leftPosition + "px";
}

window.onload = function() {
    setInterval(move, 50);
};

	if ( monstersCaught < 5 && blocksHit < 2) {
	//  Request to do this again ASAP
	requestAnimationFrame(main);
	
	}
	else{ctx.fillText("Game over ", 190, 190);}
	if (blocksHit == 2)
	{
        ctx.fillText("you lose ", 380, 380);
	}
	if (monstersCaught == 5){
		ctx.fillText("you win ", 380, 380);
	}
};

// Let's play this game!
var then = Date.now();
reset();
main();