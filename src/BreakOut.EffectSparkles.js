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
 * Brick object
 * @constructor
 */
BreakOut.EffectSparkles = function (settings) {

    BreakOut.Element.call(this, settings);

    this.light = {};
    this.children = [];
};

BreakOut.EffectSparkles.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.EffectSparkles.prototype.init = function (settings) {

    this.object = new PIXI.Graphics();
    this.object.beginFill(0xffffff, 0);
    this.object.drawRect(0, 0, 1, 1);
    this.object.visible = false;

    if (BreakOut.settings.lighting == true) {
        //var color = 0xffffff;
        //this.light = new PIXI.lights.PointLight(color, 1);
        //this.object.addChild(this.light);
    }

    for (var i = 0; i < 5; i++) {
        var child = new PIXI.Graphics();
        child.beginFill(0xffffff, 1);
        child.drawCircle(0, 0, Math.random() * 5);
        child.speedX = -2 + (Math.random() * 4);
        child.speedY = -2 + (Math.random() * 4);

        this.object.addChild(child);
        this.children.push(child);
    }

};

BreakOut.EffectSparkles.prototype.setColor = function (color) {

    if (color == null || color == '') {
        return false;
    }
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].tint = color;
    }
    if (BreakOut.settings.lighting == true) {
        //this.light.color = color;
    }
};

BreakOut.EffectSparkles.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }
    for (var i = 0; i < this.children.length; i++) {

        var yAdd = this.object.alpha * this.children[i].speedY;
        var xAdd = this.object.alpha * this.children[i].speedX;
        this.children[i].position.x += xAdd;
        this.children[i].position.y += yAdd;
    }
    if (BreakOut.settings.lighting == true) {
        //this.light.brightness *= .95;
    }

    this.object.alpha *= .95;
    if (this.object.alpha < .1) {
        this.object.alpha = 1;
        this.setColor(0xffffff);
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].position.x = 0;
            this.children[i].position.y = 0;
        }
        this.object.visible = false;
        if (BreakOut.settings.lighting == true) {
            this.light.brightness = 1;
        }
    }

};