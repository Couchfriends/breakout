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
 *
 */
if (typeof COUCHFRIENDS == 'undefined') {
    console.warn('This game needs the COUCHFRIENDS API included to work.');
}
if (typeof BreakOut == 'undefined') {
    console.warn('This game needs the BreakOut object in order to work.');
}
var renderer, stage, players = [], tmpPlayer, mousePos = {
    x: 0,
    y: 0
}, light = {};
window.onload = init;
function init() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 800);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 600);
    BreakOut.settings.width = w;
    BreakOut.settings.height = h;

    renderer = new PIXI.lights.WebGLDeferredRenderer(w, h, {transparent: true});

    stage = new PIXI.Container();
    document.getElementById('game').innerHTML = '';
    document.getElementById('game').appendChild(renderer.view);


    // Levels are build for 1280x520 (720 - (2 * 100)) resolutions. Let's make sure the level is
    // rendered in the center
    ajax(BreakOut.settings.assetDir + 'level001.json', function (jsonData) {
        jsonData = JSON.parse(jsonData);


        var backgroundWidth = 256;
        var backgroundHeight = 256;
        for (var x = 0; x < BreakOut.settings.width; x += backgroundWidth) {

            for (var y = 0; y < BreakOut.settings.height; y += backgroundHeight) {
                var background = new BreakOut.AssetBackground();
                background.init();
                background.add();
                background.object.position.x = x;
                background.object.position.y = y;
            }
        }


        // Bottom wall
        var decoI = 32;
        var rightPos = BreakOut.settings.width;
        var heightPos = BreakOut.settings.height - 42;

        var settings = {
            texture: 'brickdeco002.png',
            normalTexture: 'brickdeco002-normal.png'
        };
        while (decoI < rightPos) {
            var DecoBrick = new BreakOut.BrickDeco(settings);
            DecoBrick.init();
            DecoBrick.add();
            DecoBrick.object.position.x = decoI;
            DecoBrick.object.position.y = heightPos;
            decoI += 64;
        }
        for (var i = 0; i < 5; i++) {
            var ball = new BreakOut.Ball({radius: 15});
            ball.init();
            ball.object.position.x = Math.random() * 10;
            ball.object.position.y = h - 250 + (Math.random() * 50);
            ball.add();
        }
        tmpPlayer = new BreakOut.Paddle();
        tmpPlayer.init();
        tmpPlayer.add();
        tmpPlayer.object.position.x = w / 2;
        tmpPlayer.object.position.y = h - 150;

        var tileWidth = jsonData.tilewidth;
        var tileHeight = jsonData.tileheight;
        var tiles = [];
        var mapWidth = jsonData.width * tileWidth;
        var mapHeight = jsonData.height * tileHeight;
        var startX = (BreakOut.settings.width / 2) - (mapWidth / 2);
        var startY = (BreakOut.settings.height / 2) - (mapHeight / 2);

        for (var i = 0; i < jsonData.tilesets.length; i++) {
            for (var index in jsonData.tilesets[i].tiles) {
                if (jsonData.tilesets[i].tiles.hasOwnProperty(index)) {
                    var brick = 'brick'; // Default key
                    try {
                        brick = jsonData.tilesets[i].tiles[index].image.replace(/(\.([a-zA-Z]+)$)/, '');
                    }
                    catch (e) {

                    }
                    jsonData.tilesets[i].tiles[index].key = brick;
                    tiles.push(jsonData.tilesets[i].tiles[index]);

                }
            }
        }
        // Loop through the layers and place bricks
        var x = startX;
        var y = startY;
        for (var i = 0; i < jsonData.layers.length; i++) {
            for (var j = 0; j < jsonData.layers[i].data.length; j++) {

                if (j % jsonData.width == 0) {
                    y += tileHeight;
                    x = startX;
                }

                var tileIndex = jsonData.layers[i].data[j] - 1;
                if (typeof tiles[tileIndex] != 'undefined') {
                    var brick;
                    switch (tiles[tileIndex].key) {
                        case 'brick-star':
                            brick = new BreakOut.BrickStar();
                            break;
                        case 'brick-fire':
                            brick = new BreakOut.BrickFire();
                            break;
                        case 'brick-ice':
                            brick = new BreakOut.BrickIce();
                            break;
                        case 'brick-color-orange':
                            brick = new BreakOut.BrickColorOrange();
                            break;
                        case 'brick-color-red':
                            brick = new BreakOut.BrickColorRed();
                            break;
                        case 'brick-color-purple':
                            brick = new BreakOut.BrickColorPurple();
                            break;
                        case 'brick-sand':
                            brick = new BreakOut.BrickSand();
                            break;
                        case 'brick-stone-003':
                            brick = new BreakOut.BrickStone();
                            break;
                        case 'brick-4-001':
                            brick = new BreakOut.BrickFourStones();
                            break;
                        default:
                            console.log(tiles[tileIndex].key);
                            brick = new BreakOut.Brick();
                    }
                    brick.init();
                    brick.add();
                    brick.object.position.x = x;
                    brick.object.position.y = y;
                }
                x += tileWidth;
            }
        }

        for (var i = 0; i < 5; i++) {
            var explosion = new BreakOut.Explosion();
            explosion.init();
            explosion.add();
            BreakOut.explosions.push(explosion);
        }

        var fire = new BreakOut.AssetFire();
        fire.init();
        fire.add();
        fire.object.position.x = 64;
        fire.object.position.y = BreakOut.settings.height - 102;

        var fire = new BreakOut.AssetFire();
        fire.init();
        fire.add();
        fire.object.position.x = BreakOut.settings.width - 64;
        fire.object.position.y = BreakOut.settings.height - 102;
    });

    window.addEventListener('mousemove', function (e) {
        tmpPlayer.object.position.x = e.clientX;
        var x = (2 / BreakOut.settings.width * e.clientX) - 1;
        var y = (2 / BreakOut.settings.height * e.clientY) - 1;
        x *= -1;
        y *= -1;
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    requestAnimationFrame(update);
}

function update(time) {
    requestAnimationFrame(update);
    //renderer.context.clearRect(0,0,BreakOut.settings.width,BreakOut.settings.height);
    BreakOut.update(time);
    renderer.render(stage);
}