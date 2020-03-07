export default class Unicorn extends Phaser.Physics.Arcade.Sprite{
    grounded;
    dead;
    jumpSound;
    
    constructor(scene,scale,jumpSound){
        let x = 60;
        let y = 80;
        let grounded = false;
        let dead = false;
        super(scene,x,y,"unicorn");
        this.jumpSound = jumpSound;        
    }

    handleJumping(cursorKeys,scale){

        let unicorn_bottom = this.y+this.displayHeight;
    
        let vel = 100;
        let yVel = 340;
        
        //Handle movement
        if(cursorKeys.left.isDown){
            this.setVelocityX(-vel);
        }else if(cursorKeys.right.isDown){
            this.setVelocityX(vel);
        }else{
            this.setVelocityX(0);
        }



        //Jump logic
        if(unicorn_bottom >= scale.height){
            this.anims.resume();
            this.grounded = true;
            this.setVelocityY(-30);
        }

        if(cursorKeys.up.isDown && this.grounded){
            this.setVelocityY(-yVel);
            this.anims.pause();
            this.grounded = false;
            this.jumpSound.play();

        }

        
    }
}