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
 * @constructor
 */
BreakOut.Bullet = function (settings) {

    BreakOut.Element.call(this, settings);

    this.textures = [
        'bullet.png'
    ];
    this.light = {};
    this.team = 'A';

    this.damage = 1;
    this.collisionList = ['brick'];
};

BreakOut.Bullet.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Bullet.prototype.init = function (settings) {

    for (var i = 0; i < this.textures.length; i++) {
        this.textures[i] = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.textures[i]);
    }
    this.object = new PIXI.Sprite();
    this.object.texture = this.textures[0];
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;
    this.object.visible = false;

    if (BreakOut.settings.lighting == true) {
        var color = 0xffff00;
        this.light = new PIXI.lights.PointLight(color, .2);
        this.object.addChild(this.light);
    }

};

BreakOut.Bullet.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }
    var y = -5;
    if (this.team == 'B') {
        y = 5;
    }
    this.object.position.y += y;
    if (this.object.position.y < -10 || this.object.position.y > BreakOut.settings.height + 10) {
        this.object.visible = false;
    }

};

BreakOut.Bullet.prototype.collision = function (target) {
    if (target.name == 'brick') {
        target.damage(this.team, this.damage);
    }
    this.object.visible = false;
};