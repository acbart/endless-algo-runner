import ExampleObject from '../objects/exampleObject';
import { Z_BEST_SPEED } from 'zlib';

export default class Scene2 extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background: Phaser.GameObjects.TileSprite;
  shipImg;
  spritesheet: Phaser.GameObjects.Sprite


  preload(){
    this.load.image("background", "../assets/images/background.png");
  //this.load.image("ship", "../assets/images/ship.png");
    this.load.image("ship2", "../assets/images/ship2.png");
    this.load.image("ship3", "../assets/images/ship3.png");

    this.load.spritesheet("ship", "../assets/spritesheets/ship.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    
  }

  constructor() {
    //this.background;
    super({ key: 'Scene2' });
  }

  moveship(ship,speed){
    ship.y += speed;
  }

  create() {
    //bg = this.add.image(0,0,"background");
    this.background = this.add.tileSprite(0,0,this.scale.width,this.scale.height,"background" );
    this.background.setOrigin(0,0);

    this.shipImg = this.add.sprite(this.scale.width/2,40,"ship");

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship", {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1
    });


    this.shipImg.play("ship1_anim")
    //this.add.text(0,0,"GANGGANG", {font: "25px Arial",fill:"yellow"});
  }

  update() {
    //his.moveship(this.shipImg,1);
    this.background.tilePositionY -=0.5;

  }
}
