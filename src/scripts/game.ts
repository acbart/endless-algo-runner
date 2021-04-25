import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';
import GameConfig = Phaser.Types.Core.GameConfig;
import MainGame from './scenes/mainGame';

const DEFAULT_WIDTH = 272;
const DEFAULT_HEIGHT = 160;


const config: GameConfig = {
    backgroundColor: '#000000',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, MainScene, MainGame],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 800 }
        }
    },
    render: {
       antialias: false,
       roundPixels: true
    }
};

window.addEventListener('load', () => {
    window['game'] = new Phaser.Game(config);
});

//
