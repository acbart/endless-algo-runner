import ExampleObject from '../objects/exampleObject';
import Unicorn from '../objects/unicorn';
import { Z_BEST_SPEED } from 'zlib';
import Wall from '../objects/wall';
import { GameObjects } from 'phaser';

export default class MainGame extends Phaser.Scene {

  constructor() {
    super({ key: 'MainGame' });
  }
  
  //Various Controls and Entities
  cursorKeys;
  mouseButtons;
  gameSpeed;
  wallTimer: Phaser.Time.TimerEvent;
  unicorn: Unicorn;

  //Various textures
  bgBackTrees;
  bgFrontTrees;
  bgLights;
  bgMiddleTrees;
  wallGroup;
  spritesheet: Phaser.GameObjects.Sprite


  gameOver: boolean;
  gameOverWaiting: boolean;

  //Keeping track of score
  score: integer;
  scoreCounter;
  scoreText: Phaser.GameObjects.Text;

  //Sounds
  hurtSound: Phaser.Sound.BaseSound;
  jumpSound: Phaser.Sound.BaseSound;
  advanceSound: Phaser.Sound.BaseSound; 
  music: Phaser.Sound.BaseSound;

  //Sparkle
  sparkle;
  sparkleEmitter: GameObjects.Particles.ParticleEmitter;

  preload(){
    //Loading forest textures
    const background_path = "./assets/parallax_backgrounds/temple/";
    this.load.image("bg_back_trees",background_path+"Background.png");
    this.load.image("bg_middle_trees",background_path+"Arches.png");
    this.load.image("bg_front_trees",background_path+"Pillars.png");

    this.load.image("bg_lights",background_path+"Curls.png");
    this.load.image("wall_texture","./assets/images/wall.png")
    this.load.image("tree_texture", "./assets/images/tree.png");
    this.load.image("bot_texture", "./assets/images/atb.png");
    this.load.spritesheet("dancer_texture", "./assets/spritesheets/atb_dance.png", {
      frameWidth: 40,
      frameHeight: 38
    });

    //Sparkle Effects
    this.load.image('sparkle', './assets/images/sparkle.png');

    this.load.audio("jump", "./assets/audio/jump.mp3");
    this.load.audio("hurt", "./assets/audio/hurt.mp3");
    this.load.audio("advance", "./assets/audio/Powerup3.mp3");
    this.load.audio("music", "./assets/audio/kernel_panic.mp3");

    //Unicorn texture
    this.load.spritesheet("unicorn", "./assets/spritesheets/running_bigger.png", {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  initBackground(){
    let bgWidth = this.scale.width;
    let bgHight = this.scale.height;
    this.bgBackTrees = this.add.tileSprite(0,0,bgWidth,bgHight,"bg_back_trees");
    //this.bgLights = this.add.tileSprite(0,0,bgWidth,bgHight,"bg_lights")
    this.bgMiddleTrees = this.add.tileSprite(0,0,bgWidth,bgHight,"bg_middle_trees");
    //this.bgFrontTrees = this.add.tileSprite(0,0,bgWidth,bgHight,"bg_front_trees");

    this.bgBackTrees.setOrigin(0,0);
    //this.bgLights.setOrigin(0,0);
    this.bgMiddleTrees.setOrigin(0,0);
    //this.bgFrontTrees.setOrigin(0,0);
  }

  initParticles(){
    var particles = this.add.particles("sparkle");
    this.sparkleEmitter = particles.createEmitter({
      x: 30,
      y: 20,
      scale: {start:0.1,end:0},
      speedX: {min:-150, max:-100},
      speedY: {min: -100, max:100},
      tint: [0xE74C3C,0xF5B041,0xF4D03F,0x82E0AA,0x5DADE2,0xAF7AC5],
      gravityY: 50,
      frequency: 100,
    });
  }

  initAudio(){
    this.hurtSound = this.sound.add("hurt");
    this.jumpSound = this.sound.add("jump");
    this.advanceSound = this.sound.add("advance");
    this.music = this.sound.add("music");
    this.music.play({loop: true, rate: .75});
    console.log(this.music.totalRate);
  }

  initUnicorn(){
    this.anims.create({
      key: "unicorn_anim",
      frames: this.anims.generateFrameNumbers("unicorn", {start: 0, end: 12}),
      frameRate:12*this.gameSpeed,
      repeat: -1
    });

    
    this.unicorn = new Unicorn(this,1,this.jumpSound);
    this.add.existing(this.unicorn);
    this.physics.add.existing(this.unicorn);
    this.unicorn.scale = 0.5;
    
    this.unicorn.play("unicorn_anim");
    this.unicorn.setOrigin(0,0);
    this.unicorn.setSize(this.unicorn.displayWidth, this.unicorn.displayHeight);
    this.unicorn.setOffset(this.unicorn.displayWidth/2 - 10,this.unicorn.displayHeight);
    this.unicorn.setCollideWorldBounds(true);

    this.input.on('pointerdown', this.unicorn.jumpTowards.bind(this.unicorn));
    this.input.on('pointerup', this.unicorn.stopJumpingTowards.bind(this.unicorn));
  }

  initText(){
    this.scoreText = this.add.text(0,0,this.score.toString());
    this.scoreText.setFontSize(20)
    this.scoreText.setResolution(10);
    this.scoreText.setColor("#2ecc71")
    this.scoreText.setDepth(100);
  }

  initPhysics(){
    this.wallGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false
    });

    this.anims.create({
      key: "dancer_anim",
      frames: this.anims.generateFrameNumbers("dancer_texture", {start: 0, end: 4}),
      frameRate: 12*this.gameSpeed,
      repeat: -1
    });

    this.physics.add.collider(this.unicorn,this.wallGroup, this.wallCollide, this.wallCollide, this);
  }


  initTimers(){
    this.wallTimer = this.time.addEvent({
      delay: 2000,
      callback: this.wallGenerator, 
      callbackScope: this, 
      loop:true
    })

    /*this.scoreCounter = this.time.addEvent({
      delay: 500,
      callback: this.incrementScore, 
      callbackScope: this, 
      loop:true
    })*/
  }
  

  create() {
    this.gameSpeed = 1;
    this.gameOver = false;
    this.gameOverWaiting = false;
    this.score = 1;
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.initBackground();
    this.initParticles();
    this.initAudio();
    this.initUnicorn();
    this.initPhysics();
    this.initTimers();
    this.initText();
  }

  wallCollide(){
    this.hurtSound.play();
    this.sparkleEmitter.setFrequency(1);
    this.sparkleEmitter.setSpeed(100);
    this.gameOver = true;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  wallGenerator(){
    if(this.getRandomInt(2)){
      this.generateWall(true)
    }else{
      this.generateWall(false)
    }
  }

  generateWall(above){
    let ypos = 120;

    if(above){
      ypos = 0;
    }

    var wall = new Wall(350,ypos,this,1, this.incrementScore.bind(this));
    this.add.existing(wall);
    this.physics.add.existing(wall);
    this.wallGroup.add(wall);
    wall.setOrigin(0,0);
    wall.setVelocityX(-200*this.gameSpeed);
    if(above){
      wall.setFlipY(true);
    }
  }

  incrementScore(amount: integer){
    this.score = this.score+amount;

    if(this.score % 20 == 0){
      this.gameSpeed = this.gameSpeed+0.1;
      this.advanceSound.play();
      this.sparkleEmitter.setFrequency(this.sparkleEmitter.frequency*0.5);
      let rate = .75 + .25 * (Math.min(50, this.score) / 50);
      this.music.play({loop: true, rate: rate})
    }
  }

  wallUpdate(){
    for(var i =0; i < this.wallGroup.getChildren().length; i++){
      var wall = this.wallGroup.getChildren()[i];
      wall.update();
    }
  }

  scrollBackground(){
    let scrollSpeed = 3*this.gameSpeed; //Speed of the front layer 
    this.bgBackTrees.tilePositionX += 0.1*scrollSpeed;
    //this.bgLights.tilePositionX += 0.2*scrollSpeed;
    this.bgMiddleTrees.tilePositionX += 0.5*scrollSpeed;
    //this.bgFrontTrees.tilePositionX += scrollSpeed;
  }

  update() {

    //Update sparkle position
    this.sparkleEmitter.setPosition(
      this.unicorn.x+this.unicorn.displayWidth/2, 
      this.unicorn.y+this.unicorn.displayHeight/2+10);
    
    
    
    //Check if game is over
    if(!this.gameOver){
      this.scoreText.setText(this.score.toString())
      this.scrollBackground();
      this.wallUpdate();
      this.unicorn.handleJumping(this.cursorKeys,this.scale);

    } else if (!this.gameOverWaiting) {
      this.setGameOver();
    } else {
      //Restart when we press R
      var keyObj = this.input.keyboard.addKey("R");
      if(keyObj.isDown){
        this.restartGame();
      }
    }
  }

  restartGame() {
    this.scoreText.destroy();
    this.input.off('pointerdown');
    this.unicorn.destroy();
    this.create();
  }

  setGameOver() {
      console.log("FIRING");
      //Hold the presses
      this.music.stop();
      this.scoreText.setText("Final Score: "+this.score.toString()+" \nPress R to Restart");

      //Destroy timers
      this.wallTimer.destroy();
      //this.scoreCounter.destroy();

      this.unicorn.anims.pause();
      this.unicorn.setVelocityX(0);

      //Spin the unicorn
      var rot = 50;
      this.unicorn.setAngularVelocity(rot);
      this.unicorn.setCollideWorldBounds(false);

      //Stop all the walls
      for(var i =0; i < this.wallGroup.getChildren().length; i++) {
        var wall = this.wallGroup.getChildren()[i];
        wall.disableBody();
        wall.destroy();
      }

      //this.input.mouse.stopListeners();
      this.input.off('pointerdown');
      this.input.off('pointerup');
      this.input.on('pointerdown', this.restartGame.bind(this));
      this.gameOverWaiting = true;
  }
}
