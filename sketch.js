const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var ground, groundImg, invisibleGround;

var hunter,hunterRunning,hunterDeath;

var magic,magicImg;

var ghost,ghostImg;

var flyers,flyerImg;

var treasure,treasureImg;

var score = 0;

var obstaclesGroup,flyerGroup,magicGroup;

var gameOver,gameOverImg;

var victory,victoryImg;

localStorage["HighestScore"] = 0;

function preload()
{
	groundImg = loadImage("hCUwLQ.png");
	hunterRunning = loadAnimation("run1.png","run2.png","run3.png","run2.png","run1.png");
	ghostImg = loadAnimation("tile000.png","tile001.png","tile002.png","tile003.png");
	flyerImg = loadAnimation("flyer1.png","flyer2.png","flyer3.png","flyer4.png");
	magicImg = loadAnimation("magic1.png","magic2.png","magic3.png","magic4.png","magic5.png","magic6.png");
	hunterDeath = loadAnimation("death1.png","death2.png","death3.png");
	treasureImg = loadImage("treasure_sprites.png");
	gameOverImg = loadImage("Game Over.png");
	victoryImg = loadImage("Win.png");
}

function setup() {
	createCanvas(700, 480);

	engine = Engine.create();
	world = engine.world;

	//Create the Bodies Here.

	ground = createSprite(400,240,800,20);
	ground.addImage("ground",groundImg);
	ground.x = ground.width/2;

	hunter = createSprite(50,180,20,50);

	//hunter.debug = true;

	hunter.addAnimation("death",hunterDeath);

	hunter.addAnimation("running",hunterRunning);

	hunter.changeAnimation("running",hunterRunning);

	hunter.setCollider("rectangle",0,0,25,40);

	hunter.scale = 1.5;

	invisibleGround = createSprite(200,438,1000,10);

    invisibleGround.visible = false;

	obstaclesGroup = new Group();
	magicGroup = new Group();
	flyerGroup = new Group();

	score = 0;

	treasure = createSprite(1000,400,20,20);

	treasure.addImage("treasure",treasureImg);

	treasure.scale = 0.4;

	treasure.visible = false;

	treasure.debug = true;

	treasure.setCollider("rectangle",0,0,250,250);

	gameOver = createSprite(350,240,10,10);

	gameOver.addImage("gameOver",gameOverImg);

	gameOver.visible = false;

	victory = createSprite(350,240,10,10);

	victory.addImage("Win",victoryImg);

	victory.visible = false;

	Engine.run(engine);
}


function draw() {
  rectMode(CENTER);
  background(0);
  
  if(gameState === PLAY){

	ground.velocityX = -(6 + 3*score/100);

  	if(ground.x < 0){
		ground.x = ground.width/2;
	}

	hunter.velocityY = hunter.velocityY + 0.8;

	score = score + Math.round(getFrameRate()/60);

	console.log(score);

	if(keyDown("w") && hunter.y >= 390 ) {
  	hunter.velocityY = -20;
	}

	hunter.collide(invisibleGround);

	if(obstaclesGroup.isTouching(hunter)||flyerGroup.isTouching(hunter)){
		gameState = END;
	}

	if(keyDown("d")){
		spawnProjectile();
	}
	
	spawnGhosts();
	spawnFlyers();

	if(flyerGroup.isTouching(magicGroup)){
		flyers.destroy();
		magic.destroy();
	}

	if(score > 2000){
		gameState = WIN;
	}

}

  if(gameState === END){
	  ground.velocityX = 0;

	  hunter.velocityX = 0;

	  hunter.velocityY = 0;

	  hunter.changeAnimation("death",hunterDeath);

	  obstaclesGroup.setVelocityXEach(0);

	  magicGroup.setVelocityXEach(0);

	  flyerGroup.setVelocityXEach(0);

	  flyerGroup.setLifetimeEach(-1);

	  obstaclesGroup.setLifetimeEach(-1);

	  hunter.collide(invisibleGround);

	  gameOver.visible = true;

	  if(mousePressedOver(gameOver)) {
		reset();
	  }
  }

  if(gameState === WIN){
	  treasure.visible = true;

	  treasure.velocityX = -3;

	  ground.velocityX = -3;

	  if(ground.x < 0){
		ground.x = ground.width/2;
	 }

	 hunter.velocityY = hunter.velocityY + 0.8;
	 hunter.collide(invisibleGround);

	  if(hunter.isTouching(treasure)){
		hunter.velocityX = 0;

		hunter.velocityY = 0;

		treasure.velocityX = 0;

		ground.velocityX = 0;

		victory.visible = true;
	  }
  }
  

  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);

  drawSprites();

  textSize(20);
  fill("white");
  text("Score: "+ score, 30,50);
}

function spawnGhosts() {
	if(frameCount % 60 === 0) {
	  ghost = createSprite(800,390,10,40);

	  //ghost.debug = true;

	  ghost.setCollider("circle",0,0,50 );

	  ghost.velocityX = -(6 + 3*score/100);
	  
	  //generate random obstacles
	  ghost.addAnimation("ghost",ghostImg);
	  
	  //assign scale and lifetime to the obstacle           
	  ghost.scale = 0.7;
	  ghost.lifetime = 300;
	  //add each obstacle to the group
	  obstaclesGroup.add(ghost);
	}
  }

  function spawnProjectile(){
	magic = createSprite(hunter.x,hunter.y,20,20);

	//magic.debug = true;

	magic.setCollider("circle",5,15,20);

	magic.addAnimation("magic",magicImg);

	magic.velocityX = 5;

	magic.lifetime = 70;

	magicGroup.add(magic);
}

  function spawnFlyers() {
	if(frameCount % 100 === 0) {
	  flyers = createSprite(800,200,10,40);

	  //flyers.debug = true;

	  flyers.velocityX = -(6 + 3*score/100);

	  flyers.setCollider("circle",0,0,20)
	  
	  //generate random obstacles
	  flyers.addAnimation("flyers",flyerImg);
	  
	  //assign scale and lifetime to the obstacle           
	  flyers.scale = 1.5;
	  flyers.lifetime = 300;

	  //add each obstacle to the group
	  flyerGroup.add(flyers);
	}
  }

  function reset(){
	gameState = PLAY;
	gameOver.visible = false;
	
	obstaclesGroup.destroyEach();
	flyerGroup.destroyEach();
	
	hunter.changeAnimation("running",hunterRunning);
	
	if(localStorage["HighestScore"]<score){
	  localStorage["HighestScore"] = score;
	}
	console.log(localStorage["HighestScore"]);
	
	score = 0;
  }

  