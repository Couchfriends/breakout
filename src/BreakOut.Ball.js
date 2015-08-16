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

    this.stats = {
        radius: settings.radius || 11,
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

};

BreakOut.Ball.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Ball.prototype.init = function (settings) {

    this.texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.texture);
    this.object = new PIXI.Sprite(this.texture);
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;

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

        if (pos.x < (posTarget.x - halfWidthTarget)) {
            speed.x *= -1;
            pos.x = (posTarget.x - halfWidthTarget) - halfWidth;
        }
        else if (pos.x > (posTarget.x + halfWidthTarget)) {
            speed.x *= -1;
            pos.x = (posTarget.x + halfWidthTarget) + halfWidth;
        }
        else if (pos.y < (posTarget.y - halfHeightTarget)) {
            adjustSpeed = true;
            speed.y *= -1;
            pos.y = (posTarget.y - halfHeightTarget) - halfHeight;
        }
        else {
            adjustSpeed = true;
            speed.y *= -1;
            pos.y = (posTarget.y + halfHeightTarget) + halfHeight;
        }
        if (target.name == 'paddle' && adjustSpeed == true) {
            var xPosRelative = posTarget.x - pos.x;
            var percent = 100 / halfWidthTarget * xPosRelative;
            speed.x = this.stats.maxSpeed.x / 100 * percent;
            speed.x *= -1;
        }
        if (0) {
            // Speed velocity for paddle
            var magnitude = (this.distanceTo(paddle) - this.size.y / 2 - paddle.size.y / 2);
            var ratio = magnitude / (paddle.size.x / 2) * 2.5;

            if (this.pos.x + this.size.x / 2 < paddle.pos.x + paddle.size.x / 2) {
                // send the ball to the left if hit on the left side of the paddle, and vice versa
                ratio = -ratio;
            }

            return this.speed * ratio;
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

    pos.x += speed.x;
    pos.y += speed.y;

    if (pos.y > (settings.height - radius)) {
        speed.y = -speed.y;
        pos.y = (settings.height - radius);
    }
    else if (pos.y < radius) {
        speed.y = Math.abs(speed.y);
        pos.y = radius;
    }
    else if (pos.x > (settings.width - radius)) {
        speed.x = -speed.x;
        pos.x = (settings.width - radius);
    }
    else if (pos.x < radius) {
        speed.x = Math.abs(speed.x);
        pos.x = radius;
    }
};