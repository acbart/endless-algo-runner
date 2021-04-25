export default class Unicorn extends Phaser.Physics.Arcade.Sprite{
    grounded;
    dead;
    jumpSound;
    jumping: boolean;

    public static readonly yVel = 304;
    public static readonly xVel = 100;
    
    constructor(scene,scale,jumpSound){
        let x = 60;
        let y = 80;
        super(scene,x,y,"unicorn");
        this.jumping = false;
        this.jumpSound = jumpSound;
        this.grounded = false;
    }

    handleJumping(cursorKeys, scale){

        let unicorn_bottom = this.y+this.displayHeight;

        //Handle movement
        if(cursorKeys.left.isDown){
            this.setVelocityX(-Unicorn.xVel);
        }else if(cursorKeys.right.isDown){
            this.setVelocityX(Unicorn.xVel);
        }else if (!this.jumping) {
            this.setVelocityX(0);
        }



        //Jump logic
        if(unicorn_bottom >= scale.height){
            this.anims.resume();
            if (!this.grounded) {
                //this.setVelocityY(-30);
            }
            this.grounded = true;
        }

        if(cursorKeys.up.isDown) {
            this.jump();
        }
    }

    jump() {
        console.log(this.grounded);
        if (this.grounded){
            console.log("LEAP");
            this.setVelocityY(-Unicorn.yVel);
            this.anims.pause();
            this.grounded = false;
            this.jumpSound.play();
        }
    }

    jumpTowards(pointer) {
        if (this.x < pointer.x && pointer.x < this.x+this.displayWidth/2) {

        } else {
            let horizontal = Math.sign(pointer.x - this.x) * Unicorn.xVel;
            this.setVelocityX(horizontal);
            this.jumping = true;
        }
        if (pointer.y < this.y+20) {
            this.jump();
        }
    }

    stopJumpingTowards(pointer) {
        this.jumping = false;
    }
}