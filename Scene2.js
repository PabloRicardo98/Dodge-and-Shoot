class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {

    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    this.ship1 = this.physics.add.sprite(config.width / 2 - 50, config.height / 2, "ship").setScale(2);
    this.ship2 = this.physics.add.sprite(config.width / 2, config.height / 2, "ship2").setScale(2);
    this.ship3 = this.physics.add.sprite(config.width / 2 + 50, config.height / 2, "ship3").setScale(2);

    this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player").setScale(3);

    this.player.setCollideWorldBounds(true);

    //this.enemies = this.physics.add.group();
    //this.enemies.add(ship1);
    //this.enemies.add(ship2);
   // this.enemies.add(ship3);

    var Bullet = new Phaser.Class({

      Extends: Phaser.GameObjects.Image,

      initialize:

        function Bullet(scene) {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

          this.speed = Phaser.Math.GetSpeed(600, 1);
        },

      fire: function (x, y) {
        this.setPosition(x, y - 35);

        this.setActive(true);
        this.setVisible(true);
      },

      update: function (time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -2) {
          this.setActive(false);
          this.setVisible(false);
        }
      }

    });

    //bullets = this.physics.add.group();
    this.enemyBullets.enableBody = true;
    bullets = this.add.group({
      key: 'bullet',
      classType: Bullet,
      maxSize: 15,
      runChildUpdate: true
    });



    speed = Phaser.Math.GetSpeed(300, 1);


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





    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.player.play("thrust");



    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();


    this.input.on('gameobjectdown', this.destroyShip, this);

    txtScore = this.add.text(0, 0, "S C O R E  " + score, {
      font: "25px Arial",
      fill: "yellow"
    });


    this.physics.world.setBoundsCollision();

    this.powerUps = this.physics.add.group();

    this.bullets = this.physics.add.group();



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



    this.physics.add.collider(this.player, this.powerUps);
    this.physics.add.collider(this.player, this.ship1, this.destroyShip, null, this);
    this.physics.add.collider(this.player, this.ship2, this.destroyShip, null, this);
    this.physics.add.collider(this.player, this.ship3, this.destroyShip, null, this);
    
    //this.physics.add.collider(this.powerUps, this.ship1);

    /*this.enemies = this.physycs.add.group();
    this.enimies.add(ship1)
    this.enimies.add(ship2)
    this.enimies.add(ship3)*/

    // console.log(bullets);

  }


  update(time) {
    this.moveShip(this.ship1, nave1);
    this.moveShip(this.ship2, nave2);
    this.moveShip(this.ship3, nave3);
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
    //this.resetShipPos();
  }

  /*destroyPlayer(gameObject) {

    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }*/

}