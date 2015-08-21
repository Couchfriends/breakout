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

    BreakOut.Element.call(this, settings);

    this.name = 'ball';

    this.texture = 'ball.png';

    this.team = '';

    this.color = 0xffffff;

    this.light = {};

    this.stats = {
        damage: 1,
        radius: settings.radius || 8,
        prevPosition: {
            x: 0,
            y: 0
        },
        speed: {
            x: -3,
            y: 3
        },
        maxSpeed: {
            x: 3,
            y: 3
        }
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
    if (target.name == 'paddle' || target.name == 'brick') {

        var adjustSpeed = false;
        var speed = this.stats.speed;
        var pos = this.object.position;
        var posTarget = target.object.position;
        var halfWidth = this.object.width / 2;
        var halfHeight = this.object.height / 2;
        var halfWidthTarget = target.object.width / 2;
        var halfHeightTarget = target.object.height / 2;

        // top
        if (pos.y < (posTarget.y - halfHeightTarget - speed.y)) {
            adjustSpeed = true;
            speed.y *= -1;
            pos.y = (posTarget.y - halfHeightTarget) - halfHeight;
        }
        // bottom
        else if (pos.y > (posTarget.y + halfHeightTarget + speed.y)) {
            adjustSpeed = true;
            speed.y *= -1;
            pos.y = (posTarget.y + halfHeightTarget) + halfHeight;
        }
        // left
        else if (pos.x < (posTarget.x - halfWidthTarget - speed.x)) {
            speed.x *= -1;
            pos.x = (posTarget.x - halfWidthTarget) - halfWidth;
        }
        // right
        else if (pos.x > (posTarget.x + halfWidthTarget + speed.x)) {
            speed.x *= -1;
            pos.x = (posTarget.x + halfWidthTarget) + halfWidth;
        }
        else {
            // probably stuck inside due speed
            // @todo fix me
            if (speed.y > 0) {
                pos.y = (posTarget.y + halfHeightTarget) + halfHeight;
                speed.y = Math.abs(speed.y);
            }
            else {
                pos.y = (posTarget.y - halfHeightTarget) - halfHeight;
                speed.y = -(Math.abs(speed.y));
            }
        }
        if (target.name == 'paddle' && adjustSpeed == true) {
            var xPosRelative = posTarget.x - pos.x;
            var percent = 100 / halfWidthTarget * xPosRelative;
            speed.x = this.stats.maxSpeed.x / 100 * percent;
            speed.x *= -1;
        }
        //speed.y = addY;
        if (target.name == 'brick') {
            target.damage(this);
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
            }
        }
    }

    if (target.name == 'paddle') {
        this.object.tint = target.color;
        this.team = target.team;
        this.light.color = target.color;
        var addPercent = (100 / (this.stats.maxSpeed.x + this.stats.maxSpeed.y) * (Math.abs(speed.x) + Math.abs(speed.y)));
        addPercent = addPercent * .01;
        if (addPercent < 1) {
            speed.x *= 1 + addPercent;
            speed.y *= 1 + addPercent;
        }
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

        if (target.stats.speed.x > target.stats.maxSpeed.x) {
            target.stats.speed.x = target.stats.maxSpeed.x;
        }
        else if (target.stats.speed.x < -(target.stats.maxSpeed.x)) {
            target.stats.speed.x = -(target.stats.maxSpeed.x);
        }
        if (target.stats.speed.y > target.stats.maxSpeed.y) {
            target.stats.speed.y = target.stats.maxSpeed.y;
        }
        else if (target.stats.speed.y < -(target.stats.maxSpeed.y)) {
            target.stats.speed.y = -(target.stats.maxSpeed.y);
        }
    }
    if (this.stats.speed.x > this.stats.maxSpeed.x) {
        this.stats.speed.x = this.stats.maxSpeed.x;
    }
    else if (this.stats.speed.x < -(this.stats.maxSpeed.x)) {
        this.stats.speed.x = -(this.stats.maxSpeed.x);
    }
    if (this.stats.speed.y > this.stats.maxSpeed.y) {
        this.stats.speed.y = this.stats.maxSpeed.y;
    }
    else if (this.stats.speed.y < -(this.stats.maxSpeed.y)) {
        this.stats.speed.y = -(this.stats.maxSpeed.y);
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
            if (removeScore > 100) {
                removeScore = 100;
            }
            BreakOut.score.A = removeScore;
            vibrate('A', 250);
        }
        else if (pos.y < radius) {
            speed.y = Math.abs(speed.y);
            pos.y = radius;
            var removeScore = Math.floor(BreakOut.score.B * .5);
            if (removeScore > 100) {
                removeScore = 100;
            }
            BreakOut.score.B = removeScore;
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