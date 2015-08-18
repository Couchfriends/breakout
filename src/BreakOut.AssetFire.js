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
BreakOut.AssetFire = function (settings) {

    BreakOut.Asset.call(this, settings);

    this.textures = [
        'torch-001.png',
        'torch-002.png',
        'torch-003.png',
        'torch-004.png',
        'torch-005.png',
        'torch-006.png',
        'torch-007.png',
        'torch-008.png',
        'torch-009.png'
    ];
    this.light = {};
};

BreakOut.AssetFire.prototype = Object.create(BreakOut.Asset.prototype);

BreakOut.AssetFire.prototype.init = function (settings) {

    BreakOut.Asset.prototype.init.call(this, settings);

    var color = 0xff0000;
    this.light = new PIXI.lights.PointLight(color, 1);
    this.object.addChild(this.light);

};