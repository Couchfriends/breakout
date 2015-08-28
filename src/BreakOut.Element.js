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
 * Global object class for all objects in BreakOut. All objects should extend
 * from this object.
 * @constructor
 */
BreakOut.Element = function (settings) {

    /**
     * Name of the object. Used for collision detection.
     * @see this.collisionList
     * @type {string}
     */
    this.name = '';

    this.prevPosition = {
        x: 0,
        y: 0
    };

    this.object = {};

    this.hitArea = null;

    this.collisionList = [];


    this.effects = [];

    this.texture = '';
    this.textures = [];
    this.animationSpeed = 0; // Increase to animate this.textures;

};

BreakOut.Element.prototype = {

    init: function () {

        console.warn('Init not implemented on Object.', this);
        this.object = new PIXI.Graphics();
        this.object.beginFill(0xff0000, 1);
        this.object.drawCircle(0, 0, 15);

    },

    /**
     * Update the object during the gameloop. Might return false if the update
     * is not allowed.
     *
     * @param time
     *
     * @return {boolean}
     */
    update: function (time) {

        if (this.object.visible == false) {
            return false
        }
        this.prevPosition.x = this.object.position.x;
        this.prevPosition.y = this.object.position.y;
        // Do some collision detection here
        var collisionObject = this.checkCollision();
        if (collisionObject != false) {
            this.collision(collisionObject);
        }

        if (this.textures.length > 1 && this.animationSpeed > 0) {
            if (BreakOut.timer % this.animationSpeed == 0) {
                var nextTexture = this.textures.indexOf(this.object.texture) + 1;
                if (typeof this.textures[nextTexture] == 'undefined') {
                    nextTexture = 0;
                }
                this.object._originalTexture = this.textures[nextTexture];
            }
        }

        return true;
    },

    add: function () {
        this.object.Element = this;
        BreakOut.objects.push(this);
        if (this.object != null) {
            stage.addChild(this.object);
        }
    },

    remove: function () {
        if (this.name == 'brick') {
            BreakOut.totalBricks--;
            if (BreakOut.totalBricks <= 0) {
                BreakOut.loadLevel();
            }
        }
        if (this.object != null) {
            stage.removeChild(this.object);
        }
        var indexOf = BreakOut.objects.indexOf(this);
        BreakOut.objects.splice(indexOf, 1);
    },

    collision: function (target) {

    },

    /**
     * Collision detection
     */
    checkCollision: function () {
        if (this.collisionList.length == 0) {
            return false;
        }
        for (var i = 0; i < BreakOut.objects.length; i++) {
            var object = BreakOut.objects[i];
            if (object.name == '' || this.collisionList.indexOf(object.name) < 0 || object == this) {
                continue;
            }
            if (object.object.hitArea != null) {
                var halfWidth = (this.object.width / 2);
                var halfHeight = (this.object.height / 2);
                // Get bounds, not just the center
                var minX = this.object.position.x - (object.object.position.x - halfWidth);
                var minY = this.object.position.y - (object.object.position.y - halfHeight);

                var maxX = this.object.position.x - (object.object.position.x + halfWidth);
                var maxY = this.object.position.y - (object.object.position.y + halfHeight);
                if (object.object.hitArea.contains(minX, minY) || object.object.hitArea.contains(minX, maxY) || object.object.hitArea.contains(maxX, minY) || object.object.hitArea.contains(maxX, maxY)) {
                    return object;
                }

                var x = this.object.position.x - (object.object.position.x - halfWidth);
                var y = this.object.position.y - (object.object.position.y - halfHeight);
                if (object.object.hitArea.contains(x, y)) {
                    return object;
                }
            }
            else {
                // Simple AABB collision detection
                var xdist = object.object.position.x - this.object.position.x;

                if (xdist > -(object.object.width + this.object.width) / 2 && xdist < (object.object.width + this.object.width) / 2) {
                    var ydist = object.object.position.y - this.object.position.y;

                    if (ydist > -(object.object.height + this.object.height) / 2 && ydist < (object.object.height + this.object.height) / 2) {
                        return object;
                    }
                }
            }
        }
        return false;
    }

};

// @todo move this to the effect and add target paddle
BreakOut.Element.prototype.applyEffect = function (effect, applyVisual) {

    applyVisual = applyVisual || false;
    var timeouts = {
        freeze: 320,
        sticky: 1200,
        fire: 400,
        shoot: 320
    };
    switch (effect) {
        case 'freeze':
        case 'sticky':
        case 'fire':
        case 'shoot':
            var timeout = timeouts[effect]; // in fps
            var effectObject = {
                effect: effect,
                endTimer: BreakOut.timer + timeout,
                object: ''
            };
            var found = false;
            for (var i = 0; i < this.effects.length; i++) {
                if (this.effects[i].effect == effect) {
                    effectObject.endTimer = (this.effects[i].endTimer + timeout);
                    effectObject.object = this.effects[i].object;
                    if (effectObject.object != '') {
                        effectObject.object.alpha = 1;
                    }
                    this.effects.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (found == false && applyVisual) {
                // add freezing effect
                var texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + 'effect-' + effect + '.png');
                var object = new PIXI.Sprite(texture);
                object.alpha = 1;
                object.anchor.x = .5;
                object.anchor.y = .5;
                effectObject.object = object;
                this.object.addChild(object);
            }
            this.effects.push(effectObject);
            break;
        default:
            console.log(effect);
    }

};

/**
 * Remove one or more effects
 */
BreakOut.Element.prototype.removeEffect = function (effect) {

    var effects = [];
    if (typeof effect == 'string') {
        effect = [effect];
    }
    for (var i = 0; i < effect.length; i++) {
        for (var i = 0; i < this.effects.length; i++) {
            if (this.effects[i].effect == effect[i]) {
                if (effect[i] == 'sticky') {
                    this.shoot();
                }
                // Might wanna do something
                if (this.effects[i].object != '') {
                    this.effects[i].object.alpha = 0;
                    this.object.removeChild(this.effects[i].object);
                }
                continue;
            }
            effects.push(this.effects[i]);
        }
    }
    this.effects = effects;
};
