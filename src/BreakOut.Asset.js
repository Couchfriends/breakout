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
BreakOut.Asset = function (settings) {

    BreakOut.Element.call(this, settings);

    this.textures = [
        'torch-001.png',
        'torch-002.png'
    ];
    this.light = {};
    this.animationSpeed = 15;
};

BreakOut.Asset.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Asset.prototype.init = function (settings) {

    for (var i = 0; i < this.textures.length; i++) {
        this.textures[i] = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.textures[i]);
    }
    this.object = new PIXI.Sprite();
    this.object.texture = this.textures[0];
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;

};