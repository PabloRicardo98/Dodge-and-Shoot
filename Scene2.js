
class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {

    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship").setScale(2);
    ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2").setScale(2);
    ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3").setScale(2);

    this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player").setScale(3);

    this.player.setCollideWorldBounds(true);
    


    var Bullet = new Phaser.Class({

      Extends: Phaser.GameObjects.Image,

      initialize:

        function Bullet(scene) {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

          this.speed = Phaser.Math.GetSpeed(400, 1);
        },

      fire: function (x, y) {
        this.setPosition(x, y - 50);

        this.setActive(true);
        this.setVisible(true);
      },

      update: function (time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -50) {
          this.setActive(false);
          this.setVisible(false);
        }
      }

    });

    bullets = this.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true
    });

    speed = Phaser.Math.GetSpeed(300, 1);

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player"),
      framerate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3
      }),
      frameRate: 20,
      repeat: -1
    });





    ship1.play("ship1_anim");
    ship2.play("ship2_anim");
    ship3.play("ship3_anim");

    this.player.play("thrust");



    ship1.setInteractive();
    ship2.setInteractive();
    ship3.setInteractive();


    this.input.on('gameobjectdown', this.destroyShip, this);

    txtScore = this.add.text(0, 0, "S C O R E  " + score, {
      font: "25px Arial",
      fill: "yellow"
    });


    this.physics.world.setBoundsCollision();

    this.powerUps = this.physics.add.group();
    
   

    // 2.2 Add multiple objects
    var maxObjects = 4;
    for (var i = 0; i <= maxObjects; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

      // set random animation
      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      // setVelocity
      powerUp.setVelocity(100, 100);
      // 3.2
      powerUp.setCollideWorldBounds(true);
      // 3.3
      powerUp.setBounce(1);

    }

    cursor = this.input.keyboard.createCursorKeys();

    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      console.log("fire");
    }
    

     this.physics.add.collider(this.powerUps, this.player, this.destroyPlayer, null, this);
    
    /*this.enemies = this.physycs.add.group();
    this.enimies.add(ship1)
    this.enimies.add(ship2)
    this.enimies.add(ship3)*/ 

    // console.log(bullets);

  }
  
  
  update(time) {
    this.moveShip(ship1, nave1);
    this.moveShip(ship2, nave2);
    this.moveShip(ship3, nave3);
    /*if(score ==2){
      nave1 = nave1 +0.001;
      
     }*/
    this.background.tilePositionY -= 0.5;

    this.movePlayerManeger();

    if (cursor.up.isDown && time > lastFired) {
      var bullet = bullets.get();

      if (bullet) {
        bullet.fire(this.player.x, this.player.y);

        lastFired = time + 50;
      }
    }



  }
  

  movePlayerManeger() {
    if (cursor.left.isDown) {
      this.player.setVelocityX(-playerSpeed);
    } else if (cursor.right.isDown) {
      this.player.setVelocityX(playerSpeed);
    }
    /*if (cursor.up.isDown) {
      this.player.setVelocityY(-playerSpeed);
    } else if (cursor.down.isDown) {
      this.player.setVelocityY(playerSpeed);
    }*/
  }

  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    score++;
    txtScore.setText("S C O R E  " + score, {
      font: "25px Arial",
      fill: "yeloow"
    });
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  destroyPlayer(gameObject) {
    
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

}