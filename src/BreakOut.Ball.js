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
BreakOut.Ball = function () {

    BreakOut.Element.call(this);

    this.name = 'ball';

    this.stats = {
        speed: {
            x: -5,
            y: 5
        }
    };

    /**
     * Pixi.js object
     * @type {Object}
     */
    //this.object = new PIXI.Graphics();
    //this.object.beginFill(0xff9900, 1);
    //this.object.drawCircle(0, 0, 15);
    //this.object.position.x = 300;
    //this.object.position.y = 300;
    this.body = Matter.Bodies.circle(
        20,
        20,
        10,
        {
            isStatic: false,
            density: 0.001,
            friction: 0,
            slop: 0,
            frictionAir: 0,
            restitution: 1,
            render: {
                fillStyle: '0xff9900',
                strokeStyle: '#000000',
                lineWidth: 1
            }
        }
    );

    this.collisionList = ['paddle', 'brick'];
};

BreakOut.Ball.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Ball.prototype.collision = function (target) {

    console.log(target);

};