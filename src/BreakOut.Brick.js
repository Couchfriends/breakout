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
BreakOut.Brick = function (settings) {

    BreakOut.Element.call(this, settings);

    this.name = 'brick';

    /**
     * list of textures. Start with the latest and move up to the first. Then it
     * get destroyed
     * @type {string[]}
     */
    this.textures = [
        'brick.png'
    ];


    this.team = 'A';

    this.score = 10;
    this.normalTexture = '';
    /**
     * List of bonuses that can be spawned
     * @type {Array}
     */
    this.bonuses = [
        'bonus-coin',
        'bonus-freeze',
        'bonus-sticky',
        'bonus-fire',
        'bonus-shoot'
    ];
    /**
     * Drop chance in percent
     * @type {number}
     */
    this.dropChance = 5;
    if (BreakOut.settings.debug == true) {
        this.dropChance = 100;
    }
};

BreakOut.Brick.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Brick.prototype.init = function (settings) {

    for (var i = 0; i < this.textures.length; i++) {
        this.textures[i] = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.textures[i]);
    }
    this.object = new PIXI.Sprite();
    this.object.texture = this.textures[this.textures.length - 1];
    if (this.normalTexture != '' && BreakOut.settings.lighting == true) {
        var normalMapTexture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.normalTexture);
        this.object.normalTexture = normalMapTexture;
    }
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;

};

BreakOut.Brick.prototype.damage = function (team, damage) {

    var damage = damage || 1;
    this.team = team;
    var newTexture = this.textures.indexOf(this.object.texture) - damage;
    if (typeof this.textures[newTexture] == 'undefined') {
        BreakOut.addScore(
            team,
            this.score,
            {
                x: this.object.position.x,
                y: this.object.position.y
            }
        );
        this.remove();
    }
    else {
        // Probably a bug with the light plugin?
        this.object._originalTexture = this.textures[newTexture];
    }

};

BreakOut.Brick.prototype.remove = function () {

    if (this.bonuses.length > 0 && Math.random() * 100 < this.dropChance) {
        var bonus = this.bonuses[Math.floor(Math.random() * this.bonuses.length)];
        switch (bonus) {
            case 'bonus-coin':
                bonus = new BreakOut.BonusCoin();
                break;
            case 'bonus-freeze':
                bonus = new BreakOut.BonusFreeze();
                break;
            case 'bonus-sticky':
                bonus = new BreakOut.BonusSticky();
                break;
            case 'bonus-fire':
                bonus = new BreakOut.BonusFire();
                break;
            case 'bonus-shoot':
                bonus = new BreakOut.BonusShoot();
                break;
            default:
                console.log(bonus);
                bonus = new BreakOut.Bonus();
        }
        bonus.init();
        bonus.add();
        bonus.object.position.x = this.object.position.x;
        bonus.object.position.y = this.object.position.y;
        bonus.team = this.team;
    }

    BreakOut.Element.prototype.remove.call(this);

};