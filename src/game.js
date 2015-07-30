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

    var options = {
        render: {
            element: document.getElementById('game'),
            controller: Matter.RenderPixi,
            options: {
                width: w,
                height: h,
                hasBounds: true
            }
        }
    };

    BreakOut._engine = Matter.Engine.create(options);
    BreakOut._engine.world.width = w;
    BreakOut._engine.world.height = h;
    BreakOut._engine.world.gravity.x = 0;
    BreakOut._engine.world.gravity.y = 0;
    BreakOut._engine.render.options.wireframes = false;

    var ball = new BreakOut.Ball();
    ball.add();
    Matter.Body.applyForce(
        ball.body,
        {
            x: 0,
            y: 0
        },
        {
            x: .005,
            y: .005
        }
    );
    var brick = new BreakOut.Brick();
    brick.body = Matter.Bodies.rectangle(
        w / 2,
        h + 10,
        w,
        20,
        {
            isStatic: true,
            restitution: 1,
            render: {
                fillStyle: '0xff0000',
                lineWidth: 0
            }
        }
    );
    brick.add();
    var brick = new BreakOut.Brick();
    brick.body = Matter.Bodies.rectangle(
        w / 2,
        -10,
        w,
        20,
        {
            isStatic: true,
            restitution: 1,
            render: {
                fillStyle: '0xff0000',
                lineWidth: 0
            }
        }
    );
    brick.add();
    var brick = new BreakOut.Brick();
    brick.body = Matter.Bodies.rectangle(
        -10,
        h / 2,
        20,
        h,
        {
            isStatic: true,
            restitution: 1,
            render: {
                fillStyle: '0xff0000',
                lineWidth: 0
            }
        }
    );
    brick.add();
    var brick = new BreakOut.Brick();
    brick.body = Matter.Bodies.rectangle(
        w+10,
        h / 2,
        20,
        h,
        {
            isStatic: true,
            restitution: 1,
            render: {
                fillStyle: '0xff0000',
                lineWidth: 0
            }
        }
    );
    brick.add();
    //new BreakOut.Paddle().add();
    //requestAnimationFrame(update);
    Matter.Engine.run(BreakOut._engine);
}

function update(time) {
    requestAnimationFrame(update);
    BreakOut.update(time);
    renderer.render(stage);
}