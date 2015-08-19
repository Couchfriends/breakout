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
BreakOut.Explosion = function (settings) {

    BreakOut.Element.call(this, settings);

    this.textures = [
        'expl1-001.png',
        'expl1-002.png',
        'expl1-003.png',
        'expl1-004.png',
        'expl1-005.png',
        'expl1-006.png',
        'expl1-007.png',
        'expl1-008.png',
        'expl1-009.png',
        'expl1-010.png',
        'expl1-011.png',
        'expl1-012.png',
        'expl1-013.png',
        'expl1-014.png',
        'expl1-015.png',
        'expl1-016.png',
        'expl1-017.png',
        'expl1-018.png',
        'expl1-019.png',
        'expl1-020.png',
        'expl1-021.png',
        'expl1-022.png',
        'expl1-023.png',
        'expl1-024.png',
        'expl1-025.png',
        'expl1-026.png',
        'expl1-027.png',
        'expl1-028.png',
        'expl1-029.png',
        'expl1-030.png',
        'expl1-031.png',
        'expl1-032.png',
        'expl1-033.png',
        'expl1-034.png',
        'expl1-035.png',
        'expl1-036.png'
    ];
    this.light = {};
};

BreakOut.Explosion.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Explosion.prototype.init = function (settings) {

    for (var i = 0; i < this.textures.length; i++) {
        this.textures[i] = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.textures[i]);
    }
    this.object = new PIXI.Sprite();
    this.object.texture = this.textures[0];
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;
    this.object.visible = false;


    if (BreakOut.settings.lighting == true) {
        var color = 0xff0000;
        this.light = new PIXI.lights.PointLight(color, 1);
        this.object.addChild(this.light);
    }

};

BreakOut.Explosion.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }
    var nextTexture = this.textures.indexOf(this.object.texture) + 1;
    if (typeof this.textures[nextTexture] == 'undefined') {
        this.object._originalTexture = this.textures[0];
        this.object.texture = this.textures[0];
        this.object.visible = false;
        this.light.brightness = 1;
    }
    else {
        var brightness = nextTexture;
        if (nextTexture > (this.textures.length / 2)) {
            brightness = this.textures.length - nextTexture;
        }
        this.object._originalTexture = this.textures[nextTexture];
        this.light.brightness = (brightness * .5);
    }

};