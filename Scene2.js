class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  create() {
    // position do BackGround
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);
    //adicionando fisica e posição das naves e player
    this.ship1 = this.physics.add.sprite(config.width / 3 - 50, config.height / 2, "ship").setScale(2.5);
    this.ship2 = this.physics.add.sprite(config.width / 3, config.height / 2, "ship2").setScale(2.5);
    this.ship3 = this.physics.add.sprite(config.width / 3 + 50, config.height / 2, "ship3").setScale(2.5);
    this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 6, "player").setScale(3);
    //colisão de player com mundo
    this.player.setCollideWorldBounds(true);
    //grupo de inimigos
    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);
    //tiros
    var Bullet = new Phaser.Class({

      Extends: Phaser.GameObjects.Image,

      initialize:

        function Bullet(scene) {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

          this.speed = Phaser.Math.GetSpeed(600, 1);
        },

      fire: function (x, y) {
        this.setPosition(x, y - 1);

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
    //Fire
    bullets = this.physics.add.group({
      key: 'bullet',
      classType: Bullet,
      maxSize: 15,
      runChildUpdate: true
    });

    bullets.enableBody = true;
    bullets.createMultiple(50, 'bullet');
    speed = Phaser.Math.GetSpeed(300, 1);

    // animações create 

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
      frameRate: 15,
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
    // animção das ship
    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");
    // animação do player
    this.player.play("thrust");
    // make interactive
    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    //this.input.on('gameobjectdown', this.destroyShip, this);
    // Score inseridona tela
    txtScore = this.add.text(25, 8, "S C O R E  " + score, {
      font: "25px Arial",
      fill: "white"
    });
    for (var i = 1; i <= life; i++) {
      lifeObj[i] = this.physics.add.image(position, 60, 'heart').setScale(2);
      position += 70;
    }
    //barreira na tela
    this.physics.world.setBoundsCollision();
    // group de bombas
    this.powerUps = this.physics.add.group();

    // 2.2 Add multiple objects
    var maxObjects = 5;
    for (var i = 0; i <= maxObjects; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up").setScale(1.5);
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

      // set random animation
      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      // setVelocity
      powerUp.setVelocity(150, 150);
      // colisão com mundo 
      powerUp.setCollideWorldBounds(true);
      // 3.3
      powerUp.setBounce(1);
    }
    // criação de controles
    cursor = this.input.keyboard.createCursorKeys();

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //-------------------------------------------
    //Colisões geral
    //-------------------------------------------
    this.physics.add.overlap(bullets, this.powerUps, this.pickpowerUps, null, this);
    this.physics.add.overlap(this.player, this.powerUps, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.enemies, bullets, this.resetShipPos, null, this);
    this.physics.add.overlap(bullets, this.enemies, this.hitEnemy, null, this);
    //retornar player na spawn
    

  }


  update(time) {

    this.moveShip(this.ship1, nave1);
    this.moveShip(this.ship2, nave2);
    this.moveShip(this.ship3, nave3);
    if (score == 1) {
      nave1 = nave1 + 0;
      nave2 = nave2 + 0;
      nave3 = nave3 + 0;
    }
    this.background.tilePositionY -= 5;

    this.movePlayerManeger();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && time > lastFired) {

      var bullet = bullets.get();

      if (bullet) {
        bullet.fire(this.player.x, this.player.y);

        lastFired = time + 50;
      }
    }

  }

  updateLifeGraph() {

    var removeLife = life + 1;
    lifeObj[removeLife].disableBody(true, true);
  }
  dead() {
    if (life != 0) {
      life--;
      this.updateLifeGraph();
      // resetBall();
    } else {
      endGame = true;
    }
  }

  movePlayerManeger() {
    if (cursor.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (cursor.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    }
    if (cursor.up.isDown) {
      this.player.setVelocityY(-playerSpeed);
    } else if (cursor.down.isDown) {
      this.player.setVelocityY(playerSpeed);
    }  
  }


  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);

    }
  }

  resetShipPos(enemies) {
    var explosion = new Explosion(this, enemies.x, enemies.y);
    enemies.y = -10;
    var randomX = Phaser.Math.Between(0, config.width);
    enemies.x = randomX;
  }

  destroyPlayer(player, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
    var x = config.width / 2 - 8;
    var y = config.height - 64;
    this.player.enableBody(true, x, y, true, true);
    endGame = true;

  }
  resetPlayer() {
    var x = config.width / 2 - 8;
    var y = config.height - 200;
    this.player.enableBody(true, x, y, true, true)

    this.player.alpha = 0.5;

    tween = this.tweens.add({
      targets: this.player,
      y: config.height - 200,
      ease: 'Power1',
      duration: 1500,
      repeat:0,
      onComplete: function(){
        this.player.alpha = 1;
      },
      callbackScope: this
    });
    
  }

  pickpowerUps(player, powerUps) {
    powerUps.disableBody(true, true)
    // gameObject.setTexture("explosion");
    // gameObject.play("explode");
  }

  hitEnemy(bullets, enemies) {
    //var explosion = new Explosion(this, enemies.x, enemies.y);
    bullets.destroy();
    this.resetShipPos(enemies);

    score++;
    txtScore.setText("S C O R E  " + score, {
      font: "25px Arial",
      fill: "yeloow"
    });
  }

  hurtPlayer(player, enemies) {
    this.resetShipPos(enemies);
        
    if(this.player.alpha < 1){
      return;
    }
    var explosion = new Explosion(this, enemies.x, enemies.y);
    this.resetPlayer();
    player.x = config.width / 2 - 8;
    player.y = config.height - 64;
    //this reset player
    
    this.time.addEvent({
      delay: 100,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }
}