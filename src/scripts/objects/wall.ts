export default class Wall extends Phaser.Physics.Arcade.Sprite{
    dancing: boolean;
    onDefeat: any;

    // Evil flag - when they get to the wall, they turn around, go above you, and drop down.

    constructor(x,y,scene,scale, onDefeat){
        super(scene,x,y, "bot_texture");

        this.dancing = Phaser.Math.RND.between(0, 10) < 2;
        if (this.dancing) {
            this.play("dancer_anim");
            this.setTexture("dancer_texture");
        }

        this.onDefeat = onDefeat;
    }

    update(){
        if (this.x < -100){
            this.destroy();
            this.onDefeat(this.dancing ? 2: 1);
        }
    }
}