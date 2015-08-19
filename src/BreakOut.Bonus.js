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
BreakOut.Bonus = function (settings) {

    BreakOut.Element.call(this, settings);

    this.name = 'bonus';

    /**
     * list of textures. Start with the latest and move up to the first. Then it
     * get destroyed
     * @type {string[]}
     */
    this.textures = [
        'bonus.png'
    ];

    this.team = '';

    this.score = 0;

    this.collisionList = [
        'paddle'
    ];

};

BreakOut.Bonus.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Bonus.prototype.init = function (settings) {

    for (var i = 0; i < this.textures.length; i++) {
        this.textures[i] = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.textures[i]);
    }
    this.object = new PIXI.Sprite();
    this.object.texture = this.textures[this.textures.length - 1];
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;

};

BreakOut.Bonus.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }
    if (this.team == 'B') {
        this.object.position.y -= 1;
    }
    else {
        this.object.position.y += 1;
    }
    if (this.object.position.y < -(this.object.height) || this.object.position.y > (BreakOut.settings.height + this.object.height)) {
        this.remove();
    }
    return true;
};

BreakOut.Bonus.prototype.collision = function (target) {
    if (target.name == 'paddle' && this.score > 0) {
        BreakOut.addScore(this.team, this.score, this.object.position);
    }
    this.remove();
};

BreakOut.Bonus.prototype.remove = function () {

    BreakOut.Element.prototype.remove.call(this);

};