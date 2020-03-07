export default class Wall extends Phaser.Physics.Arcade.Sprite{
    constructor(x,y,scene,scale){
        super(scene,x,y,"tree_texture");
    }

    update(){
        if(this.x < -100){
            this.destroy()
        }
    }
}