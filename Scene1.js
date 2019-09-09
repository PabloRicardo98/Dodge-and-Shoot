class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload() {
    this.load.image("background", "assets/images/background.png");
    this.load.audio("sound", "assets/sound/8bit.mp3");

    this.load.image('start', 'assets/images/start.png');

    this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
      frameWidth: 32,
      frameHeight: 16
    });
    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("power-up", "assets/spritesheets/power-up.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("player", "assets/spritesheets/player.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("bullet", "assets/spritesheets/bullet.png", {
      frameWidth: 5,
      frameHeight: 12
    });
  }

  create() {
    sound = this.sound.add('sound');
    sound.loop = true;
    sound.play();

    start = this.add.tileSprite(0, 0, config.width, config.height, "start");
    start.setOrigin(0, 0);

    txtTitle = this.add.text(this.physics.world.bounds.centerX - 150, 250, 'Dodge and Shoot', { font: '40px', fill: '#fff' });
    txtPressStart = this.add.text(this.physics.world.bounds.centerX - 50, 600,
      'PRESS START', { font: '20px', fill: '#fff' });

    // up transition
    this.tweens.timeline({
      targets: txtPressStart,
      ease: 'Power1',
      duration: 1000,
      tweens: [{ y: 350 }]
    });

    this.time.addEvent({
      delay: 1000,
      callback: function () {
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyENTER.on('down', startGame, this);
      },
      //args: [],
      callbackScope: this,
      loop: false
    });
  }

}
function startGame() {
  sound.stop();
  this.scene.start("playGame");
}
