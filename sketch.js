var gameState= "play";
var score  = 0;
var life = 3 ;

function preload() {
    bgImg = loadImage('images/background-1.jpg');
    commandoImg = loadAnimation('images/c1.png','images/c2.png','images/c3.png','images/c4.png','images/c5.png','images/c6.png')
    commandoDead = loadAnimation('images/cD.png');
    zombieImg = loadAnimation('images/v1.png','images/v2.png','images/v3.png','images/v4.png','images/v5.png',)
    zombieDImg = loadAnimation('images/vD.png');
    platform1 = loadImage('images/Platform1.png');
    platform2 = loadImage('images/Platform2.png');
    bulletImg = loadImage('images/bullet.png');
    restartImg = loadImage('images/restart.png');
    gameOverImg = loadImage("images/GameOver.png");
    playImg = loadImage("images/play.png");
}



function setup() {
    createCanvas(windowWidth, windowHeight);

    bg = createSprite(0,0, width+500, height+100);
    bg.addImage(bgImg);
    bg.scale=2.92;

    invisibleGround = createSprite(width/2, height-50, width, 20);
    invisibleGround.visible = false;
    invisibleGround.velocityX = -5;
    invisibleGround.scale=2.92;
 
    commando = createSprite(180, height-180, 20,100)
    commando.addAnimation("run",commandoImg);
    commando.addAnimation("die",commandoDead);
    commando.scale=0.5;
    //commando.setCollider("rectangle",0,0,100,400);
    //commando.debug = true;
    
    play = createSprite(width/2, height/2);
    play.scale = 0.5;
    play.addImage(playImg);
    gameOver = createSprite(width/2, height/2-150);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 1.7;
    restart = createSprite(width/2, height/2+120);
    restart.addImage(restartImg);
    restart.scale = 0.15;
    play.visible = false;
    gameOver.visible = false;
    restart.visible = false;

   zombiesGroup = new Group();
   platformsGroup = new Group();
   bulletsGroup = new Group();
   newZombiesGroup = new Group();
   runningZombieGroup = new Group();
}

function draw(){
    background("#EFA588");
    drawSprites();

    fill("Black")
    textSize(30);
    text("Score: " + score, camera.position.x+400, 40);
    text("Life: " + life, camera.position.x-600, 40);


    if(gameState === "play") {

        if(life <= 3) {

        bg.velocityX = -5;

        if(bg.x < 200){ 
            bg.x = width/2+100;  
        }

        commando.x = camera.position.x - 400;

        if(commando.y > height+100) {
            commando.y = invisibleGround.y;
        }
        
        if(keyDown("up")) {
            commando.velocityY += -2;
        }

        if(keyWentDown("space")) {
            bullet=createSprite(commando.x+90,commando.y-35,10,10);
            bullet.scale = 0.02;
            bullet.velocityX=10;
            bullet.addImage(bulletImg);
            bulletsGroup.add(bullet);
        }

        commando.velocityY += 0.9;
        commando.collide(invisibleGround);

        if(invisibleGround.x < 200){ 
            invisibleGround.x = width/2+100;
        }

        runningZombies();
        spawnZombies();
        
        zombiesGroup.collide(platformsGroup);
        commando.collide(platformsGroup);

        if(runningZombieGroup.isTouching(bulletsGroup)){
            runningZombieGroup.destroyEach();
            score += 5;    
        }

        if(zombiesGroup.isTouching(bulletsGroup)){
            score += 10;
            var Zx = zombiesGroup[0].x;
            var Zy = zombiesGroup[0].y;
            zombiesGroup.removeSprites();
            var newZombie = createSprite(Zx,Zy+30,30,100);
            newZombie.addAnimation("dead",zombieDImg);
            newZombie.scale = 0.3;
            newZombie.velocityX = -5;
            newZombie.lifetime = 400 ;
            newZombiesGroup.add(newZombie);
        }

        if(zombiesGroup.isTouching(commando) || runningZombieGroup.isTouching(commando) ){
            life -= 1;
            commando.y = invisibleGround.y-30;
            commando.velocityX=0;
            commando.velocityY=0;
            commando.scale = 0.8;
            commando.changeAnimation("die",commandoDead);
            gameState= "end";
        }
    }
}
    
    if(gameState === "end") {
        bg.velocityX=0;
        zombiesGroup.setVelocityXEach(0);
        platformsGroup.setVelocityXEach(0);
        zombiesGroup.setLifetimeEach(0);
        newZombiesGroup.setLifetimeEach(0);
        //runningZombieGrozup.setLifetimeEach(0);
        platformsGroup.setLifetimeEach(-1);
        gameOver.visible = true;
        gameOver.depth = 100;
        
        if(life !== 0) {
            play.visible=true;
            if(mousePressedOver(play)) {
                commando.changeAnimation("run", commandoImg);
                commando.scale = 0.5;
                zombiesGroup.destroyEach();
                runningZombieGroup.destroyEach();
                newZombiesGroup.destroyEach();
                platformsGroup.destroyEach();
                gameState = "play";
                play.visible = false;
                gameOver.visible=false;
                play.depth = 101;
            }
        }
        
        else{
            restart.visible = true;
            restart.depth = 101;
            if(mousePressedOver(restart)){
                location.reload();
            }
        } 
            
        }

        
    }



function runningZombies() {
    if(frameCount % 100 === 0) {
        runningZombie = createSprite(width-200, height-180, 20,100);
        runningZombie.addAnimation("attack",zombieImg);
        runningZombie.velocityX = -10;
        runningZombie.scale=0.3;
        runningZombieGroup.add(runningZombie);
    }
}

function spawnZombies() {
    if(frameCount % 200 === 0) {
        var zY;
        var y = Math.round(random(150,400))
        platform = createSprite(width, y, 80, 30);
        platform.velocityX = -5;
        var rand = Math.round(random(1,2));
        if(rand === 1) {
            zY = 90;
            platform.addImage(platform1);
            platform.scale=0.5;
        }
        if(rand === 2) {
            zY = 125;
            platform.addImage(platform2)
            platform.scale=0.3;
       
        }
        platform.lifetime = 400;
        platformsGroup.add(platform);
        
        zombies=createSprite(width, y-zY, 50, 100);
        zombies.addAnimation("attack",zombieImg);
        zombies.velocityX = platform.velocityX; 
        zombies.scale=0.3;
        zombies.lifetime = 400;
        zombiesGroup.add(zombies);
    }
}