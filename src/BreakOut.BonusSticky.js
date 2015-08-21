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
BreakOut.BonusSticky = function (settings) {

    BreakOut.Bonus.call(this, settings);

    /**
     * list of textures. Start with the latest and move up to the first. Then it
     * get destroyed
     * @type {string[]}
     */
    this.textures = [
        'bonus-powerup-core-neutral.png'
    ];
    this.childTexture = 'bonus-powerup-container-neutral.png';

    /**
     * Inner core
     * @type {{}}
     */
    this.core = {};

    this.animationSpeed = 3;

    this.effect = 'sticky';

    this.color = 0x68c344;

    this.particles = [];

};

BreakOut.BonusSticky.prototype = Object.create(BreakOut.Bonus.prototype);

BreakOut.BonusSticky.prototype.init = function (settings) {

    BreakOut.Bonus.prototype.init.call(this, settings);

    if (BreakOut.settings.particles == true) {

        for (var i = 0; i < 3; i++) {
            var particle = new PIXI.Graphics();
            particle.beginFill(this.color, 1);
            particle.drawCircle(0, 0, 1 + Math.random() * 2);
            particle.rotateRadius = 18 + Math.random() * 4;
            particle.rotationSpeed = 6 + Math.random() * 4;
            this.particles.push(particle);
            this.object.addChild(particle);

        }
    }

};

BreakOut.BonusSticky.prototype.update = function (time) {

    if (!BreakOut.Bonus.prototype.update.call(this, time)) {
        return false;
    }
    this.core.rotation += .05;
    this.object.rotation -= .05;
    // smoothly fade out light when reaching off the screen
    if (BreakOut.settings.lighting == true &&
        (this.object.position.y < 100 || this.object.position.y > BreakOut.settings.height - 100)) {
        this.light.brightness -= .005;
    }
    if (BreakOut.settings.particles == true) {

        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];
            var particleRotationRadius = BreakOut.timer / particle.rotationSpeed;
            particle.x = particle.rotateRadius * Math.cos(particleRotationRadius);
            particle.y = particle.rotateRadius * Math.sin(particleRotationRadius);
        }
    }
    return true;
};