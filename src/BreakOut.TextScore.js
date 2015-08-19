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
BreakOut.TextScore = function (settings) {

    BreakOut.Element.call(this, settings);

    this.name = 'score';
    this.team = 'A';
    this.text = '0';
    this.displayScore = 0;

    this.font = 'bold 32px Arial';
    this.fill = '#ff9900';
    this.align = 'center';
    this.stroke = '#ffffff';
    this.strokeThickness = 2;

};

BreakOut.TextScore.prototype = Object.create(BreakOut.Text.prototype);

BreakOut.TextScore.prototype.update = function (time) {

    if (!BreakOut.Text.prototype.update.call(this, time)) {
        return false;
    }
    var score = BreakOut.score[this.team];
    if (this.displayScore == score) {
        return true;
    }

    if (this.displayScore < (score - 10000)) {
        this.displayScore += 10000;
    }
    else if (this.displayScore < (score - 1000)) {
        this.displayScore += 1000;
    }
    else if (this.displayScore < (score - 100)) {
        this.displayScore += 100;
    }
    else if (this.displayScore < (score - 10)) {
        this.displayScore += 10;
    }
    else if (this.displayScore < score) {
        this.displayScore++;
    }
    else if (this.displayScore > (score + 10000)) {
        this.displayScore -= 10000;
    }
    else if (this.displayScore > (score + 1000)) {
        this.displayScore -= 1000;
    }
    else if (this.displayScore > (score + 100)) {
        this.displayScore -= 100;
    }
    else if (this.displayScore > (score + 10)) {
        this.displayScore -= 10;
    }
    else {
        this.displayScore--;
    }
    this.object.text = this.displayScore;

    return true;
};