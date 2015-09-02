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
BreakOut.BonusCoin = function (settings) {

    BreakOut.Bonus.call(this, settings);

    /**
     * list of textures. Start with the latest and move up to the first. Then it
     * get destroyed
     * @type {string[]}
     */
    this.textures = [
        'bonus-coin-001.png',
        'bonus-coin-002.png',
        'bonus-coin-003.png',
        'bonus-coin-004.png',
        'bonus-coin-005.png',
        'bonus-coin-006.png',
        'bonus-coin-007.png',
        'bonus-coin-008.png',
        'bonus-coin-009.png',
        'bonus-coin-010.png',
        'bonus-coin-011.png',
        'bonus-coin-012.png',
        'bonus-coin-013.png',
        'bonus-coin-014.png',
        'bonus-coin-015.png',
        'bonus-coin-016.png'
    ];

    this.animationSpeed = 3;

    this.score = 100;

    this.color = 0xfff600;

    this.soundEffect = 'coin';

};

BreakOut.BonusCoin.prototype = Object.create(BreakOut.Bonus.prototype);

BreakOut.BonusCoin.prototype.init = function (settings) {

    BreakOut.Bonus.prototype.init.call(this, settings);

    if (BreakOut.settings.lighting == true) {
        var color = this.color;
        this.light = new PIXI.lights.PointLight(color, .5);
        this.object.addChild(this.light);
    }

};

BreakOut.BonusCoin.prototype.update = function (time) {

    if (!BreakOut.Bonus.prototype.update.call(this, time)) {
        return false;
    }
    // smoothly fade out light when reaching off the screen
    if (BreakOut.settings.lighting == true &&
        (this.object.position.y < 100 || this.object.position.y > BreakOut.settings.height - 100)) {
        this.light.brightness -= .005;
    }
    return true;
};