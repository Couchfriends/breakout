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

/**
 * Ball object
 * @constructor
 */
BreakOut.Paddle = function () {

    BreakOut.Element.call(this);

    this.name = 'paddle';

    this.team = 'A';

    this.color = randomColor().replace(/#/, '0x');

    this.texture = 'paddle001.png';

    this.speed = {
        x: 0
    };

    // List of effects that applied to the paddle. Like 'sticky', 'frozen'
    this.effects = [];

    this.ball = '';

    this.attachedBalls = [];

};

BreakOut.Paddle.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Paddle.prototype.init = function (settings) {

    this.texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.texture);
    this.object = new PIXI.Sprite(this.texture);
    //var normalMapTexture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + "brick-normal.png");
    //this.object.normalTexture = normalMapTexture;
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;
    if (BreakOut.settings.lighting == true) {
        var paddleLight = new PIXI.lights.PointLight(this.color, 1);
        this.object.addChild(paddleLight);
    }
    this.object.tint = this.color;

};

BreakOut.Paddle.prototype.setSpeed = function (x) {

    this.speed.x = x;

};

BreakOut.Paddle.prototype.shoot = function () {

    for (var i = 0; i < this.attachedBalls.length; i++) {
        var ball = this.attachedBalls[i];
        ball.attachtTo = '';
        ball.attachtToPos = {
            x: 0,
            y: 0
        };
        var speedY = ball.stats.maxSpeed / 2;
        var speedX = ball.stats.maxSpeed / 2;
        if (this.team == 'A') {
            speedY = -(ball.stats.maxSpeed / 2);
        }
        var xPosRelative = this.object.position.x - ball.object.position.x;
        var percent = 100 / (this.object.width / 2) * xPosRelative;
        speedX = speedX / 100 * percent;
        speedX *= -1;
        ball.stats.speed.x = speedX;
        ball.stats.speed.y = speedY;
        ball.setToMaxSpeed();
    }
    this.attachedBalls = [];

    for (var i = 0; i < this.effects.length; i++) {
        if (this.effects[i].effect == 'shoot') {
            BreakOut.shoot(this.team, {
                x: this.object.position.x - 10,
                y: this.object.position.y
            });
            sounds['shoot'].play();
            break;
        }
    }
};

BreakOut.Paddle.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }
    var speedX = this.speed.x;

    var removeEffects = [];
    for (var i = 0; i < this.effects.length; i++) {
        if (this.effects[i].endTimer < BreakOut.timer) {
            removeEffects.push(this.effects[i].effect);
            continue;
        }
        if (this.effects[i].endTimer - BreakOut.timer < 120 && this.effects[i].object != '') {
            var alpha = 1;
            if (BreakOut.timer % 20 < 5) {
                alpha = .2;
            }
            this.effects[i].object.alpha = alpha;
        }
        if (this.effects[i].effect == 'freeze') {
            speedX *= .3;
        }
    }
    if (removeEffects.length > 0) {
        this.removeEffect(removeEffects);
    }
    this.object.position.x += speedX;
    if (this.object.position.x < 0) {
        this.object.position.x = 0;
    }
    if (this.object.position.x > BreakOut.settings.width) {
        this.object.position.x = BreakOut.settings.width;
    }
    return true;
};