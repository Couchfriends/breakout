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
BreakOut.AssetBackground = function (settings) {

    BreakOut.Asset.call(this, settings);

    this.name = 'background';

    settings = settings || {};
    //settings.texture = settings.texture || 'tiled-background.png';
    //settings.normalTexture = settings.normalTexture || 'tiled-background-normal.png';
    //settings.texture = settings.texture || 'background.png';
    //settings.normalTexture = settings.normalTexture || 'background-normal.png';
    //settings.texture = settings.texture || 'tumblr_nttodhSDts1qm4qbbo1_1280.png';
    //settings.normalTexture = settings.normalTexture || 'tumblr_nttodhSDts1qm4qbbo1_1280-normal.png';
    settings.texture = settings.texture || 'background-self.png';
    settings.normalTexture = settings.normalTexture || 'background-self-normal.png';

    this.texture = settings.texture;
    this.normalTexture = settings.normalTexture;
};

BreakOut.AssetBackground.prototype = Object.create(BreakOut.Asset.prototype);

BreakOut.AssetBackground.prototype.init = function (settings) {

    this.texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.texture);
    this.object = new PIXI.Sprite(this.texture);
    if (BreakOut.settings.lighting == true) {
        var normalMapTexture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.normalTexture);
        this.object.normalTexture = normalMapTexture;
    }

};

BreakOut.AssetBackground.prototype.update = function (time) {

};