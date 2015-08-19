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
BreakOut.Text = function (settings) {

    BreakOut.Element.call(this, settings);

    this.name = 'text';
    this.text = 'Bonus!';

    this.font = 'bold 60px Arial';
    this.fill = '#ff9900';
    this.align = 'center';
    this.stroke = '#ffffff';
    this.strokeThickness = 6;

};

BreakOut.Text.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Text.prototype.init = function (settings) {

    this.object = new PIXI.Text(this.text, {
        font: this.font,
        fill: this.fill,
        align: this.align,
        stroke: this.stroke,
        strokeThickness: this.strokeThickness
    });
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;

};

BreakOut.Text.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }
    return true;
};