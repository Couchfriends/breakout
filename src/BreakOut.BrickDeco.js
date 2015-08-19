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
BreakOut.BrickDeco = function (settings) {

    BreakOut.Brick.call(this, settings);

    settings = settings || {};
    settings.texture = settings.texture || 'brickdeco001.png';
    settings.normalTexture = settings.normalTexture || 'brickdeco001-normal.png';

    this.name = 'brick';

    this.team = '';

    this.texture = settings.texture;
    this.normalTexture = settings.normalTexture;
};

BreakOut.BrickDeco.prototype = Object.create(BreakOut.Brick.prototype);

BreakOut.BrickDeco.prototype.init = function (settings) {

    this.texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.texture);
    this.object = new PIXI.Sprite(this.texture);
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;

    if (BreakOut.settings.lighting == true) {
        var normalMapTexture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.normalTexture);
        this.object.normalTexture = normalMapTexture;
    }

};

BreakOut.BrickDeco.prototype.damage = function (ball) {

    if (typeof BreakOut.score[this.team] != 'undefined') {
        BreakOut.score[this.team] = Math.floor(BreakOut.score[this.team] * .5);
        vibrate(this.team, 500);
    }
};