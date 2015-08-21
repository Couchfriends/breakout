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
BreakOut.TextBonus = function (settings) {

    BreakOut.Text.call(this, settings);

    this.name = 'text';
    this.text = '0';
    this.team = 'A';

    this.font = 'bold 24px Arial';
    this.fill = '#ff9900';
    this.align = 'center';
    this.stroke = '#ffffff';
    this.strokeThickness = 3;

};

BreakOut.TextBonus.prototype = Object.create(BreakOut.Text.prototype);

BreakOut.TextBonus.prototype.update = function (time) {

    if (!BreakOut.Text.prototype.update.call(this, time)) {
        return false;
    }
    this.object.alpha -= .05;
    if (this.team == 'B') {
        this.object.position.y += 1;
    }
    else {
        this.object.position.y -= 1;
    }
    if (this.object.alpha <= 0) {
        this.object.visible = false;
        this.object.alpha = 1;
        this.fill = this.object._style.fill = '#ff9900';
    }

};