var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImage;
var restartImage;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var DieSound;
var checkPointSound;
var jumpSound;
var box;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  

  groundImage = loadImage("ground2.png");
  
  gameOverImage = loadImage("gameOver.png");
  
  cloudImage = loadImage("cloud.png");
  
  
  restartImage = loadImage("restart.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  DieSound = loadSound("die (1).mp3");
  checkPointSound = loadSound("checkPoint (1).mp3");
  jumpSound = loadSound("jump (1).mp3");
}

function setup() {
  createCanvas(600, 200);
  restart = createSprite(300,140);
  restart.addImage("restart",restartImage);
  gameOver = createSprite(300,100);
  gameOver.addImage("gameOver",gameOverImage);
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //ground.velocityX = -(6 + 3*score/100);
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(180);
  //exibindo pontuacãO
  text("Score: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){
    restart.visible=false;
    gameOver.visible=false;
    //mover o solo
    ground.velocityX = -(6 + 3*score/100)
    //pontuação
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla de espaço for pressionada
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -13;
        jumpSound.play();  
      }
    
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gere as nuvens
    spawnClouds();
  
    //gere obstáculos no solo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        DieSound.play();   
      }
  }
   else if (gameState === END) {
     gameOver.visible = true;
     restart.visible = true; 
    ground.velocityX = 0;
     

     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     trex.changeAnimation("collided",trex_collided);
     
     if(mousePressedOver(restart)){
      reset(); 
      trex.changeAnimation("running",trex_running);}
    }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function reset(){
   gameState=PLAY;
   gameOver.visible=false;
   restart.visible=false;
   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
   score=0;
  }




function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6 + 3*score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo       
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + 3*score/100);
    
     //atribuir vida útil à variável
    cloud.lifetime = 300;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
    
  }
}

