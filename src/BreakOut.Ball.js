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
        prevPosition: {
            x: 0,
            y: 0
        },
        speed: {
            x: -5,
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


BreakOut.Ball.prototype.init = function () {

    this.object = new PIXI.Graphics();
    this.object.beginFill(0xff9900, 1);
    this.object.drawCircle(0, 0, this.stats.radius);
};

BreakOut.Ball.prototype.collision = function (target) {

    // Get the direction of the bounce
    if (target.name == 'paddle' || target.name == 'brick') {

        var adjustSpeed = false;
        if (this.object.position.x < (target.object.position.x - (target.object.width / 2))) {
            this.stats.speed.x *= -1;
            this.object.position.x = (target.object.position.x - (target.object.width / 2)) - (this.object.width / 2);
        }
        else if (this.object.position.x > (target.object.position.x + (target.object.width / 2))) {
            this.stats.speed.x *= -1;
            this.object.position.x = (target.object.position.x + (target.object.width / 2)) + (this.object.width / 2);
        }
        else if (this.object.position.y < (target.object.position.y - (target.object.height / 2))) {
            adjustSpeed = true;
            this.stats.speed.y *= -1;
            this.object.position.y = (target.object.position.y - (target.object.height / 2)) - (this.object.height / 2);
        }
        else {
            adjustSpeed = true;
            this.stats.speed.y *= -1;
            this.object.position.y = (target.object.position.y + (target.object.height / 2)) + (this.object.height / 2);
        }
        if (target.name == 'paddle' && adjustSpeed == true) {
            var xPosRelative = this.object.position.x
        }

        var dx = target.object.position.x - this.object.position.x;
        var dy = target.object.position.y - this.object.position.y;

        //if(this.object.position.x < target.object.position.x) {
        //    dx -= this.object.width;
        //} else {
        //    dx += target.object.width;
        //}
        //
        //if(this.object.position.y < target.object.position.y) {
        //    dy -= this.object.height;
        //} else {
        //    dy += target.object.height;
        //}

        //if(Math.abs(dx) < Math.abs(dy)) {
        //    this.stats.speed.x *= -1;
        //    //this.object.position.x = this.prevPosition.x + this.stats.speed.x;
        //} else {
        //    this.stats.speed.y *= -1;
        //    //this.object.position.y = this.prevPosition.y + this.stats.speed.y;
        //}


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
        if (0) {
            if (this.object.position.y <= target.object.position.y - (target.object.height / 2)) {
                console.log('bottom');
                this.stats.speed.y = Math.abs(this.stats.speed.y);
            }
            else if (this.object.position.y >= target.object.position.y + (target.object.height / 2)) {
                console.log('top');
                this.stats.speed.y = -(Math.abs(this.stats.speed.y));
            }
            if (this.object.position.x < target.object.position.x) {
                console.log('left');
                this.stats.speed.x = -(Math.abs(this.stats.speed.x));
            }
            else if (this.object.position.x > target.object.position.x) {
                console.log('right');
                this.stats.speed.x = Math.abs(this.stats.speed.x);
            }
        }
        if (0) {
            var targetHalfWidth = target.object.width / 2;
            var ballHalfWidth = this.object.width / 2;
            var targetHalfHeight = target.object.height / 2;
            var ballHalfHeight = this.object.height / 2;
            var cRx = Math.abs(target.object.position.x - targetHalfWidth - this.object.position.x);
            var cRy = Math.abs(target.object.position.y - targetHalfHeight - this.object.position.y);

            var spacing = Math.max(target.object.width * .1, 10);
            // 25 70 10
            console.log(spacing, cRx, cRy, this.object.position.y, target.object.position.y);
            // top left corner
            if (cRx < spacing && cRy < spacing) {
                console.log('top left');
                this.stats.speed.x = -(Math.abs(this.stats.speed.x));
                this.stats.speed.y = -(Math.abs(this.stats.speed.y));
            }
            // top right corner
            else if (cRx > (targetHalfWidth + ballHalfWidth - spacing) && cRy < spacing) {
                console.log('top right');
                this.stats.speed.x = Math.abs(this.stats.speed.x);
                this.stats.speed.y = -(Math.abs(this.stats.speed.y));
            }
            // bottom right corner
            else if (cRx > (targetHalfWidth + ballHalfWidth - spacing) && cRy > (targetHalfHeight + ballHalfHeight - spacing)) {
                console.log('bottom right');
                this.stats.speed.x = Math.abs(this.stats.speed.x);
                this.stats.speed.y = Math.abs(this.stats.speed.y);
            }
            // bottom left corner
            else if (cRx < spacing && cRy > (targetHalfHeight + ballHalfHeight - spacing)) {
                console.log('bottom left');
                this.stats.speed.x = -(Math.abs(this.stats.speed.x));
                this.stats.speed.y = Math.abs(this.stats.speed.y);
            }
            // left
            else if (cRx < cRy) {
                console.log('left');
                this.stats.speed.x = -(Math.abs(this.stats.speed.x));
            }
            // right
            else if (cRx > cRy && !((cRy < targetHalfHeight || target.object.position.y > this.object.position.y))) {
                console.log('right');
                this.stats.speed.x = Math.abs(this.stats.speed.x);
            }
            // top or bottom
            else {
                if (cRy < targetHalfHeight || target.object.position.y > this.object.position.y) {
                    console.log('top');
                    this.stats.speed.y = -(Math.abs(this.stats.speed.y));
                }
                else {
                    console.log('bottom');
                    this.stats.speed.y = Math.abs(this.stats.speed.y);
                }

                if (target.name == 'paddle') {
                    var percentX = 100 / target.object.width * cRx;
                    if (percentX < 40) {
                        this.stats.speed.x = (this.stats.speed.x / 100 * percentX);
                    }
                    else if (percentX > 60) {
                        this.stats.speed.x = -(this.stats.speed.x / 100 * percentX);
                    }
                }
            }
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