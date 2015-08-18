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
var BreakOut = {

    /**
     * Game width and height
     */
    settings: {
        width: 1280,
        height: 720,
        assetDir: 'assets/'
    },
    objects: [],
    /**
     * List with batch operations to execute
     */
    batches: [],
    update: function(time) {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(time);
        }
        var batches = [];
        var spliceIndexes = [];
        for (var i = 0; i < this.batches.length; i++) {
            switch (this.batches[i].type) {
                case 'damage':
                    this.batches[i].object.damage(this.batches[i].value);
                    continue;
                    break;
                default:
                    console.log(this.batches[i].type);
                    continue;
            }
            batches.push(this.batches[i]);
        }
        this.batches = batches;
    },
    /**
     * List with explosions that can be added to the scene
     */
    explosions: [],
    addExplosion: function (pos, range) {

        // find bricks in range...
        var minX = pos.x - range;
        var maxX = pos.x + range;
        var minY = pos.y - range;
        var maxY = pos.y + range;

        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].name != 'brick') {
                continue;
            }
            if (this.objects[i].object.position.x >= minX && this.objects[i].object.position.x <= maxX &&
                this.objects[i].object.position.y >= minY && this.objects[i].object.position.y <= maxY) {
                this.batches.push({
                    type: 'damage',
                    object: this.objects[i],
                    value: Infinity
                });
            }
        }

        for (var i = 0; i < this.explosions.length; i++) {
            if (this.explosions[i].object.visible == false) {
                this.explosions[i].object.position.x = pos.x;
                this.explosions[i].object.position.y = pos.y;
                this.explosions[i].object.visible = true;
                break;
            }
        }
    }
};