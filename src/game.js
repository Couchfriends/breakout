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
var renderer, stage, players = [];
window.onload = init;
function init() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 800);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 600);
    BreakOut.settings.width = w;
    BreakOut.settings.height = h;

    renderer = new PIXI.autoDetectRenderer(w, h);
    stage = new PIXI.Container(0x000000);
    document.getElementById('game').innerHTML = '';
    document.getElementById('game').appendChild(renderer.view);

    requestAnimationFrame(update);

    for (var i = 0; i < 300; i++) {
        var ball = new BreakOut.Ball({radius: 15});
        ball.object.position.x = Math.random() * w;
        ball.object.position.y = Math.random() * h;
        ball.add();
    }
    var paddle = new BreakOut.Paddle();
    paddle.add();
    paddle.object.position.x = 600;
    paddle.object.position.y = 600;
    //var brick = new BreakOut.Brick();
    //brick.add();
    //var brick = new BreakOut.Brick();
    //brick.add();
    //var brick = new BreakOut.Brick();
    //brick.add();
    //var brick = new BreakOut.Brick();
    //brick.add();
}

function update(time) {
    requestAnimationFrame(update);
    BreakOut.update(time);
    renderer.render(stage);
}