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

    this.stats = {
        radius: settings.radius || 15,
        speed: {
            x: 5,
            y: 5
        },
        maxSpeed: {
            x: 5,
            y: 5
        }
    };
    this.collisionList = ['paddle', 'brick', 'ball'];

};

BreakOut.Ball.prototype = Object.create(BreakOut.Element.prototype);


BreakOut.Ball.prototype.init = function (settings) {

    this.object = new PIXI.Graphics();
    this.object.beginFill(0xff9900, 1);
    var radius = settings.radius || 15;
    this.object.drawCircle(0, 0, radius);
};

BreakOut.Ball.prototype.collision = function (target) {

    // Get the direction of the bounce
    if (target.name == 'paddle') {
        var paddle = target;
        if (paddle.object.position.y > this.object.position.y) {
            this.stats.speed.y = -(this.stats.speed.y);
        }
        else {
            this.stats.speed.y = Math.abs(this.stats.speed.y);
        }

        // Calculate the speed of x
        var collisionX = Math.abs((paddle.object.position.x - (paddle.object.width / 2)) - (this.object.position.x - (this.object.width / 2)));
        var percentX = 100 / paddle.object.width * collisionX;
        if (percentX < 10) {
            this.stats.speed.x = -(this.stats.maxSpeed.x);
        }
        else if (percentX > 90) {
            this.stats.speed.x = this.stats.maxSpeed.x;
        }
        else if (percentX < 25) {
            this.stats.speed.x = (5 / 100 * percentX) - 5;
        }
        else if (percentX > 75) {
            this.stats.speed.x = -((5 / 100 * percentX) - 5);
        }

        this.object.position.y += this.stats.speed.y;

    }

    else if (target.name == 'ball') {

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
    this.object.position.x += this.stats.speed.x;
    this.object.position.y += this.stats.speed.y;
    if (this.object.position.y > (BreakOut.settings.height - this.stats.radius)) {
        this.stats.speed.y = -this.stats.speed.y;
        this.object.position.y = (BreakOut.settings.height - this.stats.radius);
    }
    else if (this.object.position.y < this.stats.radius) {
        this.stats.speed.y = Math.abs(this.stats.speed.y);
        this.object.position.y = this.stats.radius;
    }
    if (this.object.position.x > (BreakOut.settings.width - this.stats.radius)) {
        this.stats.speed.x = -this.stats.speed.x;
        this.object.position.x = (BreakOut.settings.width - this.stats.radius);
    }
    if (this.object.position.x < this.stats.radius) {
        this.stats.speed.x = Math.abs(this.stats.speed.x);
        this.object.position.x = this.stats.radius;
    }
};