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
        debug: false,
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
    players: [],
    timer: 0,
    objects: [],
    /**
     * List with batch operations to execute
     */
    batches: [],
    update: function(time) {
        if (this.players.length <= 0 && this.settings.debug == false) {
            return false;
        }
        this.timer++;
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(time);
        }
        var batches = [];
        var spliceIndexes = [];
        for (var i = 0; i < this.batches.length; i++) {
            switch (this.batches[i].type) {
                case 'damage':
                    this.batches[i].object.damage(this.batches[i].ball, this.batches[i].value);
                    continue;
                    break;
                default:
                    console.log(this.batches[i].type);
                    continue;
            }
            batches.push(this.batches[i]);
        }
        this.batches = batches;
    },
    scores: [],
    addScore: function (team, score, pos) {
        if (typeof this.score[team] != 'undefined') {
            this.score[team] += score;
        }
        if (typeof pos != 'undefined' && typeof pos.x != 'undefined') {
            for (var i = 0; i < this.scores.length; i++) {
                if (this.scores[i].object.visible == false) {
                    this.scores[i].object.position.x = pos.x;
                    this.scores[i].object.position.y = pos.y;
                    this.scores[i].object.visible = true;
                    this.scores[i].object.text = score;
                    break;
                }
            }
        }
    },
    /**
     * List with explosions that can be added to the scene
     */
    explosions: [],
    addExplosion: function (pos, range, ball) {

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
                this.batches.push({
                    type: 'damage',
                    object: this.objects[i],
                    value: Infinity,
                    ball: ball
                });
            }
        }

        for (var i = 0; i < this.explosions.length; i++) {
            if (this.explosions[i].object.visible == false) {
                this.explosions[i].object.position.x = pos.x;
                this.explosions[i].object.position.y = pos.y;
                this.explosions[i].object.visible = true;
                break;
            }
        }
    },
    init: function () {

        var backgroundWidth = 256;
        var backgroundHeight = 256;
        for (var x = 0; x < this.settings.width; x += backgroundWidth) {

            for (var y = 0; y < this.settings.height; y += backgroundHeight) {
                var background = new this.AssetBackground();
                background.init();
                background.add();
                background.object.position.x = x;
                background.object.position.y = y;
            }
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
            tmpPlayer.object.position.y = 150;
            tmpPlayer.team = 'B';
            var ball = new BreakOut.Ball({radius: 8});
            ball.init();
            ball.object.position.x = 8;
            ball.object.position.y = this.settings.height / 2;
            ball.add();
        }

        for (var i = 0; i < 5; i++) {
            var explosion = new BreakOut.Explosion();
            explosion.init();
            explosion.add();
            BreakOut.explosions.push(explosion);
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

        var ball = new BreakOut.Ball({radius: 8});
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