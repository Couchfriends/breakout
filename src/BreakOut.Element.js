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
BreakOut.Element = function () {

    /**
     * Name of the object. Used for collision detection.
     * @see this.collisionList
     * @type {string}
     */
    this.name = '';

    /**
     * Matter body
     * @type {Object}
     */
    this.body = {};

    this.collisionList = [];
};

BreakOut.Element.prototype = {

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

        var collisionObject = this.checkCollision();
        if (collisionObject != false) {
            this.collision(collisionObject);
        }

        return true;
    },

    add: function () {
        BreakOut.objects.push(this);
        if (this.body != null) {
            Matter.World.add(BreakOut._engine.world, this.body);
        }
    },

    remove: function () {
        if (this.body != null) {
            Matter.World.remove(BreakOut._engine.world, this.body);
        }
        var indexOf = BreakOut.objects.indexOf(this);
        BreakOut.objects.splice(indexOf, 1);
    },

    /**
     * Loops through all other objects of the game and check for collisions.
     *
     * @returns {boolean|object} false on no collision or returns the target
     * Object.
     */
    checkCollision: function () {

        if (this.collisionList.length == 0) {
            return false;
        }
        for (var i = 0; i < BreakOut.objects.length; i++) {
            var object = BreakOut.objects[i];
            if (object.name == '' || this.collisionList.indexOf(object.name) < 0) {
                continue;
            }

            // Simple AABB collision detection
            var xdist = object.object.position.x - this.object.position.x;
            if (xdist > -(object.object.width + this.object.width) / 2 && xdist < (object.object.width + this.object.width) / 2) {
                var ydist = object.object.position.y - this.object.position.y;
                if (ydist > -(object.object.height + this.object.height) / 2 && ydist < (object.object.height + this.object.height) / 2) {
                    return object;
                }
            }
        }
        return false;
    },

    collision: function (target) {

    }

};