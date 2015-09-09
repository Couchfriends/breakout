/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Couchfriends
 * www.couchfriends.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var BreakOut = {

    /**
     * Game width and height
     */
    settings: {
        debug: (window.location.hash.indexOf('debug') >= 0),
        width: 1280,
        height: 720,
        assetDir: 'assets/',
        particles: true, // Render particles
        particleDensity: 1, // Multiple particles by this number
        lighting: true // Show dynamic lighting
    },
    score: {
        A: 0,
        B: 0
    },
    firstLevelLoaded: false,
    players: [],
    timer: 0,
    objects: [],
    currentLevel: 0,
    levels: [
        'level000.json',
        'level001.json',
        'level002.json',
        'level003.json'
    ],
    update: function(time) {
        if (this.players.length <= 0 && this.settings.debug == false) {
            return false;
        }
        this.timer++;
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(time);
        }
    },
    totalBricks: 0, // if zero on destroy next level.
    scores: [],
    addScore: function (team, score, pos) {
        if (score == 0) {
            return;
        }
        if (typeof this.score[team] != 'undefined') {
            this.score[team] += score;
        }
        if (typeof pos != 'undefined' && typeof pos.x != 'undefined') {
            for (var i = 0; i < this.scores.length; i++) {
                if (this.scores[i].object.visible == false) {
                    if (score < 0) {
                        this.scores[i].fill = this.scores[i].object._style.fill = '#ff0000';
                    }
                    this.scores[i].object.position.x = pos.x;
                    this.scores[i].object.position.y = pos.y;
                    this.scores[i].object.visible = true;
                    this.scores[i].object.text = score;
                    this.scores[i].team = team;
                    break;
                }
            }
        }
    },
    /**
     * List with explosions that can be added to the scene
     */
    explosions: [],
    addExplosion: function (pos, range, team) {

        // find bricks in range...
        var minX = pos.x - range;
        var maxX = pos.x + range;
        var minY = pos.y - range;
        var maxY = pos.y + range;

        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].name != 'brick') {
                continue;
            }
            if (this.objects[i].object.position.x >= minX && this.objects[i].object.position.x <= maxX &&
                this.objects[i].object.position.y >= minY && this.objects[i].object.position.y <= maxY) {
                this.objects[i].damage(team, 1);
            }
        }

        for (var i = 0; i < this.explosions.length; i++) {
            if (this.explosions[i].object.visible == false) {
                this.explosions[i].object.position.x = pos.x;
                this.explosions[i].object.position.y = pos.y;
                this.explosions[i].object.visible = true;
                sounds['explosion'].play();
                break;
            }
        }
    },
    pickups: [],
    addPickupEffect: function (pos, team, color) {
        team = team || '';
        if (typeof pos == 'undefined' || typeof pos != 'object') {
            return;
        }

        for (var i = 0; i < this.pickups.length; i++) {
            if (this.pickups[i].object.visible == false) {
                if (typeof color != 'undefined') {
                    this.pickups[i].setColor(color);
                }
                this.pickups[i].team = team;
                this.pickups[i].object.position.x = pos.x;
                this.pickups[i].object.position.y = pos.y;
                this.pickups[i].object.visible = true;
                break;
            }
        }
    },
    sparkles: [],
    addSparkleEffect: function (pos, color) {
        if (typeof pos == 'undefined' || typeof pos != 'object') {
            return;
        }

        for (var i = 0; i < this.sparkles.length; i++) {
            if (this.sparkles[i].object.visible == false) {
                if (typeof color != 'undefined') {
                    this.sparkles[i].setColor(color);
                }
                this.sparkles[i].object.position.x = pos.x;
                this.sparkles[i].object.position.y = pos.y;
                this.sparkles[i].object.visible = true;
                break;
            }
        }
    },
    bullets: [],
    shoot: function (team, pos) {

        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].object.visible == false) {
                this.bullets[i].team = team;
                this.bullets[i].object.position.x = pos.x;
                this.bullets[i].object.position.y = pos.y;
                this.bullets[i].object.visible = true;
                break;
            }
        }
    },
    init: function () {

        var backgroundWidth = 122;
        var backgroundHeight = 119;
        for (var x = 0; x < this.settings.width; x += backgroundWidth) {

            for (var y = 0; y < this.settings.height; y += backgroundHeight) {
                var background = new this.AssetBackground();
                background.init();
                background.add();
                background.object.position.x = x;
                background.object.position.y = y;
            }
        }

        if (this.settings.lighting == true) {
            var AmbientLight = new PIXI.lights.AmbientLight(0xffffff, .3);
            stage.addChild(AmbientLight);
        }

        // Bottom wall
        /*
        var decoI = 32;
        var rightPos = this.settings.width;
        var heightPos = this.settings.height - 42;

        var settings = {
            texture: 'brickdeco002.png',
            normalTexture: 'brickdeco002-normal.png'
        };
        // bottom
        while (decoI < rightPos) {
            var DecoBrick = new BreakOut.BrickDeco(settings);
            DecoBrick.init();
            DecoBrick.team = 'A';
            DecoBrick.add();
            DecoBrick.object.position.x = decoI;
            DecoBrick.object.position.y = heightPos;
            decoI += 64;
        }
        // top
        var decoI = 32;
        var heightPos = 42;
        while (decoI < rightPos) {
            var DecoBrick = new BreakOut.BrickDeco(settings);
            DecoBrick.init();
            DecoBrick.team = 'B';
            DecoBrick.object.rotation = Math.PI * 3;
            DecoBrick.add();
            DecoBrick.object.position.x = decoI;
            DecoBrick.object.position.y = heightPos;
            decoI += 64;
        }
         */

        //for (var i = 0; i < 2; i++) {
        //    var ball = new BreakOut.Ball({radius: 8});
        //    ball.init();
        //    ball.object.position.x = 8;
        //    ball.object.position.y = this.settings.height / 2;
        //    ball.add();
        //}
        if (this.settings.debug == true) {
            tmpPlayer = new BreakOut.Paddle();
            tmpPlayer.init();
            tmpPlayer.add();
            tmpPlayer.object.position.x = BreakOut.settings.width / 2;
            tmpPlayer.object.position.y = BreakOut.settings.height - 150;
            tmpPlayer.team = 'A';
            for (var i = 0; i < 2; i++) {
                var ball = new BreakOut.Ball();
                ball.init();
                ball.object.position.x = Math.random() * 64;
                ball.object.position.y = Math.random() * this.settings.height / 2;
                ball.add();
            }
        }

        for (var i = 0; i < 5; i++) {
            var explosion = new BreakOut.Explosion();
            explosion.init();
            explosion.add();
            BreakOut.explosions.push(explosion);
        }

        for (var i = 0; i < 20; i++) {
            var bullet = new BreakOut.Bullet();
            bullet.init();
            bullet.add();
            BreakOut.bullets.push(bullet);
        }

        for (var i = 0; i < 5; i++) {
            var pickup = new BreakOut.EffectPickup();
            pickup.init();
            pickup.add();
            BreakOut.pickups.push(pickup);
        }

        for (var i = 0; i < 10; i++) {
            var sparkle = new BreakOut.EffectSparkles();
            sparkle.init();
            sparkle.add();
            BreakOut.sparkles.push(sparkle);
        }

        for (var i = 0; i < 5; i++) {
            var score = new BreakOut.TextBonus();
            score.init();
            score.object.visible = false;
            score.add();
            this.scores.push(score);
        }

        /*
        var fire = new BreakOut.AssetFire();
        fire.init();
        fire.add();
        fire.object.position.x = 64;
        fire.object.position.y = this.settings.height - 102;

        var fire = new BreakOut.AssetFire();
        fire.init();
        fire.add();
        fire.object.position.x = this.settings.width - 64;
        fire.object.position.y = this.settings.height - 102;
         */

        var scoreTeamA = new BreakOut.TextScore();
        scoreTeamA.text = 0;
        scoreTeamA.team = 'A';
        scoreTeamA.font = 'bold 26px Arial';
        scoreTeamA.strokeThickness = 1;
        scoreTeamA.init();
        scoreTeamA.add();
        scoreTeamA.object.position.x = this.settings.width / 2;
        scoreTeamA.object.position.y = this.settings.height - 30;

        var scoreTeamB = new BreakOut.TextScore();
        scoreTeamB.text = 0;
        scoreTeamB.team = 'B';
        scoreTeamB.font = 'bold 26px Arial';
        scoreTeamB.strokeThickness = 1;
        scoreTeamB.init();
        scoreTeamB.add();
        scoreTeamB.object.position.x = this.settings.width / 2;
        scoreTeamB.object.position.y = 20;

        if (this.settings.debug == false) {
            COUCHFRIENDS.connect();
        }

        if (window.localStorage) {
            var level = window.localStorage.getItem('currentLevel');
            if (level != '' && level >= 0) {
                this.currentLevel = level;
            }
        }
    },
    loadLevel: function () {

        BreakOut.totalBricks = 0;
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            var yPosBall = -22;
            if (player.element.team == 'B') {
                yPosBall = 22;
            }
            player.element.ball.object.position.x = player.element.object.position.x;
            player.element.ball.object.position.y = player.element.object.position.y;
            player.element.ball.attachtTo = player.element;
            player.element.ball.attachtToPos = {
                x: Math.random() * 56 - 28,
                y: yPosBall
            };
            //player.element.ball = player.element.ball;
            player.element.attachedBalls = [];
            player.element.attachedBalls.push(player.element.ball);
        }
        if (typeof this.levels[this.currentLevel] == 'undefined') {
            this.currentLevel = 0;
        }
        var file = this.levels[this.currentLevel];
        ajax(BreakOut.settings.assetDir + file, function (jsonData) {
            jsonData = JSON.parse(jsonData);

            if (BreakOut.firstLevelLoaded == true) {
                sounds['next-level'].play();
            }
            BreakOut.firstLevelLoaded = true;

            var tileWidth = jsonData.tilewidth;
            var tileHeight = jsonData.tileheight;
            var tiles = [];
            var mapWidth = jsonData.width * tileWidth;
            var mapHeight = jsonData.height * tileHeight;
            var startX = (BreakOut.settings.width / 2) - (mapWidth / 2);
            var startY = (BreakOut.settings.height / 2) - (mapHeight / 2);

            for (var i = 0; i < jsonData.tilesets.length; i++) {
                for (var index in jsonData.tilesets[i].tiles) {
                    if (jsonData.tilesets[i].tiles.hasOwnProperty(index)) {
                        var brick = 'brick'; // Default key
                        try {
                            brick = jsonData.tilesets[i].tiles[index].image.replace(/(\.([a-zA-Z]+)$)/, '');
                        }
                        catch (e) {

                        }
                        jsonData.tilesets[i].tiles[index].key = brick;
                        tiles.push(jsonData.tilesets[i].tiles[index]);

                    }
                }
            }
            // Loop through the layers and place bricks
            var x = startX;
            var y = startY;
            for (var i = 0; i < jsonData.layers.length; i++) {
                for (var j = 0; j < jsonData.layers[i].data.length; j++) {

                    if (j % jsonData.width == 0) {
                        y += tileHeight;
                        x = startX;
                    }

                    var tileIndex = jsonData.layers[i].data[j] - 1;
                    if (typeof tiles[tileIndex] != 'undefined') {
                        var brick;
                        switch (tiles[tileIndex].key) {
                            case 'brick-star':
                                brick = new BreakOut.BrickStar();
                                break;
                            case 'brick-fire':
                                brick = new BreakOut.BrickFire();
                                break;
                            case 'brick-ice':
                                brick = new BreakOut.BrickIce();
                                break;
                            case 'brick-color-orange':
                                brick = new BreakOut.BrickColorOrange();
                                break;
                            case 'brick-color-red':
                                brick = new BreakOut.BrickColorRed();
                                break;
                            case 'brick-color-purple':
                                brick = new BreakOut.BrickColorPurple();
                                break;
                            case 'brick-sand':
                                brick = new BreakOut.BrickSand();
                                break;
                            case 'brick-stone-003':
                                brick = new BreakOut.BrickStone();
                                break;
                            case 'brick-4-001':
                                brick = new BreakOut.BrickFourStones();
                                break;
                            default:
                                console.log(tiles[tileIndex].key);
                                brick = new BreakOut.Brick();
                        }
                        brick.init();
                        brick.add();
                        brick.object.position.x = x;
                        brick.object.position.y = y;
                        BreakOut.totalBricks++;
                    }
                    x += tileWidth;
                }
            }
        });

        if (window.localStorage) {
            window.localStorage.setItem('currentLevel', this.currentLevel);
        }

        this.currentLevel++;
        if (this.currentLevel > this.levels.length) {
            this.currentLevel = 0;
        }
    },
    addPlayer: function (id) {
        var countA = 0;
        var countB = 0;
        var team = 'A';
        var yPos = this.settings.height - 150;
        var yPosBall = -22;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].team == 'A') {
                countA++;
            }
            else {
                countB++;
            }
        }
        if (countA > countB) {
            team = 'B';
            yPos = 150;
            yPosBall = 22;
        }
        var playerElement = new BreakOut.Paddle();
        var color = playerElement.color;
        playerElement.team = team;
        playerElement.init();
        playerElement.add();
        playerElement.object.position.x = BreakOut.settings.width / 2;
        playerElement.object.position.y = yPos;
        var player = {
            id: id,
            color: '#' + color.replace(/0x/, ''),
            team: team,
            element: playerElement
        };

        var ball = new BreakOut.Ball();
        ball.init();
        ball.object.position.x = playerElement.object.position.x;
        ball.object.position.y = playerElement.object.position.y;
        ball.add();
        ball.attachtTo = playerElement;
        ball.attachtToPos = {
            x: Math.random() * 56 - 28,
            y: yPosBall
        };
        playerElement.ball = ball;
        playerElement.attachedBalls.push(ball);
        this.players.push(player);
        return player;
    },
    removePlayer: function (id) {
        for (var i = 0; i < this.players.length; i++) {
            if (id == this.players[i].id) {
                this.players[i].element.ball.remove();
                this.players[i].element.remove();
                this.players.splice(i, 1);
                return true;
            }
        }
    }
};