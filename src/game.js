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
var renderer, stage, players = [], tmpPlayer = '', mousePos = {
    x: 0,
    y: 0
    }, light = {}, mouseHideTimeOut, sounds = {},
    soundFiles = [];

soundFiles.push(
    {
        key: 'background',
        src: 'Prop - Basic Pleasure.mp3',
        volume: .5,
        loop: true,
        autoplay: true
    },
    {
        key: 'coin',
        src: 'sound-effect-coin.wav'
    },
    {
        key: 'pickup',
        src: 'sound-effect-pickup.mp3',
        volume: 2
    },
    {
        key: 'pickup-wrong',
        src: 'sound-effect-pickup-negative.mp3'
    },
    {
        key: 'explosion',
        src: 'sound-effect-explosion.wav',
        volume: .5
    },
    {
        key: 'shoot',
        src: 'sound-effect-shoot.mp3',
        volume: .2
    },
    {
        key: 'next-level',
        src: 'sound-effect-winner.mp3'
    }
);

function hideCursor() {
    document.body.style.cursor = 'url(assets/empty-cursor.png), auto';
}
window.onload = init;
function init() {

    // Load sound effects
    for (var i = 0; i < soundFiles.length; i++) {
        var sound = soundFiles[i];
        sounds[sound.key] = new Howl(
            {
                src: BreakOut.settings.assetDir + sound.src,
                autoplay: sound.autoplay || false,
                volume: sound.volume || 1,
                loop: sound.loop || false
            }
        )
    }

    mouseHideTimeOut = setTimeout(hideCursor, 2000);
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 800);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 600);
    BreakOut.settings.width = w;
    BreakOut.settings.height = h;

    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    renderer = new PIXI.lights.WebGLDeferredRenderer(w, h, {transparent: true});

    stage = new PIXI.Container();
    document.getElementById('game').innerHTML = '';
    document.getElementById('game').appendChild(renderer.view);


    if (BreakOut.settings.debug == true) {
        var levels = [];
        levels.push('leveldebug.json');
        for (var i = 0; i < BreakOut.levels.length; i++) {
            levels.push(BreakOut.levels[i]);
        }
        BreakOut.levels = levels;
    }

    BreakOut.init();
    BreakOut.loadLevel();

    document.body.addEventListener('mousemove', function (e) {
        document.body.style.cursor = 'default';
        clearTimeout(mouseHideTimeOut);
        mouseHideTimeOut = setTimeout(hideCursor, 2000);
        if (tmpPlayer == '') {
            return;
        }
        tmpPlayer.object.position.x = e.clientX;
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    document.body.addEventListener('click', function (e) {
        document.body.style.cursor = 'default';
        clearTimeout(mouseHideTimeOut);
        mouseHideTimeOut = setTimeout(hideCursor, 2000);
        if (tmpPlayer != '') {
            tmpPlayer.shoot();
        }
    });
    requestAnimationFrame(update);
}

COUCHFRIENDS.on('connect', function () {
    var jsonData = {
        topic: 'game',
        action: 'host',
        data: {
            sessionKey: 'breakout-1234'
        }
    };
    COUCHFRIENDS.send(jsonData);
});

COUCHFRIENDS.on('player.join', function (data) {
    var player = BreakOut.addPlayer(data.id);
    console.log(player);
    var jsonData = {
        id: data.id,
        topic: 'player',
        action: 'identify',
        type: 'player.identify',
        data: {
            id: data.id,
            color: player.color
        }
    };
    COUCHFRIENDS.send(jsonData);

    var jsonData = {
        id: data.id,
        topic: 'interface',
        action: 'buttonAdd',
        data: {
            playerId: data.id,
            color: '#ff0000',
            id: 'buttonShoot'
        }
    };
    COUCHFRIENDS.send(jsonData);
});

COUCHFRIENDS.on('player.orientation', function (data) {
    var players = BreakOut.players;
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            var x = data.x * 20;
            players[i].element.setSpeed(x);
            return;
        }
    }

});

var shoot = function (data) {
    var playerId = data.player.id;
    var players = BreakOut.players;
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == playerId) {
            players[i].element.shoot();
            return;
        }
    }

};

COUCHFRIENDS.on('button.click', shoot);
COUCHFRIENDS.on('player.clickUp', shoot);
COUCHFRIENDS.on('player.buttonUp', shoot);

function vibrate(team, duration) {
    duration = duration || 200;
    for (var i = 0; i < BreakOut.players.length; i++) {
        if (BreakOut.players[i].team != team) {
            continue;
        }
        var jsonData = {
            topic: 'interface',
            action: 'vibrate',
            type: 'interface.vibrate',
            data: {
                playerId: BreakOut.players[i].id,
                duration: duration
            }
        };
        COUCHFRIENDS.send(jsonData);
    }
}

COUCHFRIENDS.on('player.left', function (data) {
    BreakOut.removePlayer(data.player.id);
});

function update(time) {
    requestAnimationFrame(update);
    //renderer.context.clearRect(0,0,BreakOut.settings.width,BreakOut.settings.height);
    BreakOut.update(time);
    renderer.render(stage);
}