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
BreakOut.Ball = function (settings) {

    settings = settings || {};
    BreakOut.Element.call(this, settings);

    this.name = 'ball';

    this.texture = 'ball.png';

    this.team = '';

    this.color = 0xffffff;

    this.light = {};

    this.damage = 1;

    this.stats = {
        damage: 1,
        radius: settings.radius || 8.5,
        prevPosition: {
            x: 0,
            y: 0
        },
        speed: {
            x: -3,
            y: 3
        },
        maxSpeed: 3
    };
    this.collisionList = ['paddle', 'brick', 'ball'];

    /**
     * Every player that spawns get its own starting ball. So this increased
     * the difficulty with each player.
     * @type {object}
     */
    this.paddle = '';

    /**
     * Object wich the ball is attached to.
     * @type {string}
     */
    this.attachtTo = '';

    this.hasFire = false;

    this.attachtToPos = {
        x: 0,
        y: 0
    };

};

BreakOut.Ball.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Ball.prototype.init = function (settings) {

    this.texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.texture);
    this.object = new PIXI.Sprite(this.texture);
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;

    if (BreakOut.settings.lighting == true) {
        this.light = new PIXI.lights.PointLight(this.color, 1);
        this.object.addChild(this.light);
    }

};

BreakOut.Ball.prototype.collision = function (target) {

    // Get the direction of the bounce
    var adjustSpeed = false;

    if (target.name == 'paddle' || (target.name == 'brick' && this.hasFire == false)) {

        var adjustSpeed = false;
        var speed = this.stats.speed;
        var pos = this.object.position;
        var prevPos = this.prevPosition;
        var posTarget = target.object.position;
        var halfWidth = this.object.width / 2;
        var halfHeight = this.object.height / 2;
        var halfWidthTarget = target.object.width / 2;
        var halfHeightTarget = target.object.height / 2;

        // top
        if (prevPos.y < (posTarget.y - halfHeightTarget - this.stats.maxSpeed)) {
            adjustSpeed = true;
            speed.y *= -1;
            pos.y = (posTarget.y - halfHeightTarget) - halfHeight;
        }
        // bottom
        else if (prevPos.y > (posTarget.y + halfHeightTarget + this.stats.maxSpeed)) {
            adjustSpeed = true;
            speed.y *= -1;
            pos.y = (posTarget.y + halfHeightTarget) + halfHeight;
        }
        // left
        else if (prevPos.x < (posTarget.x - halfWidthTarget - this.stats.maxSpeed)) {
            speed.x *= -1;
            pos.x = (posTarget.x - halfWidthTarget) - halfWidth;
        }
        // right
        else if (prevPos.x > (posTarget.x + halfWidthTarget + this.stats.maxSpeed)) {
            speed.x *= -1;
            pos.x = (posTarget.x + halfWidthTarget) + halfWidth;
        }
        else {
            // probably stuck inside due speed
            // @todo fix me
            console.log('fix me!');
            if (speed.y > 0) {
                pos.y = (posTarget.y - halfHeightTarget) - halfHeight - this.stats.maxSpeed;
                speed.y = Math.abs(speed.y);
            }
            else {
                pos.y = (posTarget.y + halfHeightTarget) + halfHeight + this.stats.maxSpeed;
                speed.y = -(Math.abs(speed.y));
            }
        }

    }

    if (target.name == 'paddle' && adjustSpeed == true) {
        var xPosRelative = posTarget.x - pos.x;
        var percent = 100 / halfWidthTarget * xPosRelative;
        speed.x = (this.stats.maxSpeed / 2) / 100 * percent;
        speed.x *= -1;
    }
    //speed.y = addY;
    if (target.name == 'brick') {
        target.damage(this.team, this.damage);
    }

    // Apply ball effects if needed
    if (target.name == 'paddle' && target.effects.length > 0) {
        for (var i = 0; i < target.effects.length; i++) {
            if (target.effects[i].effect == 'sticky') {
                this.attachtTo = target;
                var yPos = -22;
                if (target.team == 'B') {
                    yPos = 22;
                }
                this.attachtToPos = {
                    x: (pos.x - target.object.position.x),
                    y: yPos
                };
                target.ball = this;
                target.attachedBalls.push(this);
            }
            else if (target.effects[i].effect == 'fire') {
                this.applyEffect('fire');
            }
        }
    }

    if (target.name == 'paddle') {
        this.object.tint = target.color;
        this.team = target.team;
        this.light.color = target.color;
        this.color = target.color;

        var speedX = this.stats.maxSpeed;
        var xPosRelative = target.object.position.x - this.object.position.x;
        var percent = 100 / (target.object.width / 2) * xPosRelative;
        speedX = speedX / 100 * percent;
        speedX *= -1;
        this.stats.speed.x = speedX;
        //
        //
        //var addPercent = (100 / (this.stats.maxSpeed) * (Math.abs(speed.x) + Math.abs(speed.y)));
        //addPercent = addPercent * .01;
        //if (addPercent < 1) {
        //    speed.x *= 1 + addPercent;
        //    //speed.y *= 1 + addPercent;
        //}
    }

    if (target.name == 'ball') {

        var ball2 = target;

        var dx = ball2.object.position.x - this.object.position.x;
        var dy = ball2.object.position.y - this.object.position.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var minDist = ball2.stats.radius / 1.1 + this.stats.radius / 1.1;
        if (distance < minDist) {
            var angle = Math.atan2(dy, dx);
            var targetX = this.object.position.x + Math.cos(angle) * minDist;
            var targetY = this.object.position.y + Math.sin(angle) * minDist;
            var ax = (targetX - ball2.object.position.x);
            var ay = (targetY - ball2.object.position.y);
            this.stats.speed.x -= ax;
            this.stats.speed.y -= ay;
            ball2.stats.speed.x += ax;
            ball2.stats.speed.y += ay;
        }

        target.setToMaxSpeed();
    }
    this.setToMaxSpeed();
};

BreakOut.Ball.prototype.applyEffect = function (effect, applyVisual) {

    BreakOut.Element.prototype.applyEffect.call(this, effect, applyVisual);

    if (effect == 'fire') {
        this.hasFire = true;
    }
};

BreakOut.Ball.prototype.removeEffect = function (effect) {

    BreakOut.Element.prototype.removeEffect.call(this, effect);

    if (effect == 'fire') {
        this.hasFire = false;
    }
};

BreakOut.Ball.prototype.setToMaxSpeed = function () {

    var addSpeed = (this.stats.maxSpeed - (Math.abs(this.stats.speed.x) + Math.abs(this.stats.speed.y)) / 2);
    if (addSpeed != 0) {
        if (this.stats.speed.x < 0) {
            this.stats.speed.x -= addSpeed;
        }
        else {
            this.stats.speed.x += addSpeed;
        }
        if (this.stats.speed.y < 0) {
            this.stats.speed.y -= addSpeed;
        }
        else {
            this.stats.speed.y += addSpeed;
        }
    }
    if (this.stats.speed.y > -.2 && this.stats.speed.y < .2) {
        this.stats.speed.y = .2
    }

};

BreakOut.Ball.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }

    var pos = this.object.position;
    var radius = this.stats.radius;
    var speed = this.stats.speed;
    var settings = BreakOut.settings;

    var removeEffects = [];
    for (var i = 0; i < this.effects.length; i++) {
        if (this.effects[i].endTimer < BreakOut.timer) {
            removeEffects.push(this.effects[i].effect);

        }
    }
    if (removeEffects.length > 0) {
        this.removeEffect(removeEffects);
    }

    if (this.hasFire == true && BreakOut.timer % 15 == 0) {
        BreakOut.addSparkleEffect({x: pos.x, y: pos.y}, 0xff0000);
    }

    if (this.attachtTo != '') {
        pos.x = this.attachtTo.object.position.x + this.attachtToPos.x;
        pos.y = this.attachtTo.object.position.y + this.attachtToPos.y;
    }
    else {
        pos.x += speed.x;
        pos.y += speed.y;

        if (pos.y > (settings.height - radius)) {
            speed.y = -speed.y;
            pos.y = (settings.height - radius);
            var removeScore = Math.floor(BreakOut.score.A * .5);
            if (removeScore > 50) {
                removeScore = 50;
            }
            //BreakOut.score.A -= removeScore;
            BreakOut.addScore('A', -removeScore, {x: pos.x, y: pos.y});
            vibrate('A', 250);
        }
        else if (pos.y < radius) {
            speed.y = Math.abs(speed.y);
            pos.y = radius;
            var removeScore = Math.floor(BreakOut.score.B * .5);
            if (removeScore > 50) {
                removeScore = 50;
            }
            BreakOut.addScore('B', -removeScore, {x: pos.x, y: pos.y});
            //BreakOut.score.B -= removeScore;
            vibrate('B', 250);
        }
        else if (pos.x > (settings.width - radius)) {
            speed.x = -speed.x;
            pos.x = (settings.width - radius);
        }
        else if (pos.x < radius) {
            speed.x = Math.abs(speed.x);
            pos.x = radius;
        }
    }
};