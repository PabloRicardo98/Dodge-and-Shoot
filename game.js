var start;
var txtTitle;
var txtPressStart;
var keyENTER;
var sound;
var score = 0;
var txtScore = '';
var nave1 = 5;
var nave2 = 6;
var nave3 = 7;
var cursor;
//var keySpace;
var playerSpeed = 200 ;
var x;
var y;
var bullets;
var speed;
var lastFired = 0;





var config = {
    width: 800,
    height: 720,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    pixelArt: true,
    // 1.1 set the physics to arcade
    physics: {
      default: "arcade",
      arcade:{
          debug: false
      }
    }
  }
  
  var game = new Phaser.Game(config);