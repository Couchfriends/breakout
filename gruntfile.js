module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**\n * @link www.couchfriends.com\n * @license MIT\n */\n'
            },
            build: {
                src: [
                    'src/howler.js',
                    'src/pixi.js',
                    'src/pixi.lights.js',
                    'src/lib.js',
                    'src/randomcolor.js',
                    'src/BreakOut.js',
                    'src/BreakOut.Element.js',
                    'src/BreakOut.Ball.js',
                    'src/BreakOut.Paddle.js',
                    'src/BreakOut.Brick.js',
                    'src/BreakOut.BrickDeco.js',
                    'src/BreakOut.BrickStone.js',
                    'src/BreakOut.BrickFourStones.js',
                    'src/BreakOut.BrickColorOrange.js',
                    'src/BreakOut.BrickColorRed.js',
                    'src/BreakOut.BrickColorPurple.js',
                    'src/BreakOut.BrickStar.js',
                    'src/BreakOut.BrickFire.js',
                    'src/BreakOut.BrickIce.js',
                    'src/BreakOut.BrickSand.js',
                    'src/BreakOut.Explosion.js',
                    'src/BreakOut.Bullet.js',
                    'src/BreakOut.Asset.js',
                    'src/BreakOut.AssetFire.js',
                    'src/BreakOut.AssetBackground.js',
                    'src/BreakOut.Bonus.js',
                    'src/BreakOut.BonusCoin.js',
                    'src/BreakOut.BonusFreeze.js',
                    'src/BreakOut.BonusSticky.js',
                    'src/BreakOut.BonusFire.js',
                    'src/BreakOut.BonusShoot.js',
                    'src/BreakOut.Text.js',
                    'src/BreakOut.TextBonus.js',
                    'src/BreakOut.TextScore.js',
                    'src/BreakOut.EffectPickup.js',
                    'src/BreakOut.EffectSparkles.js',
                    'src/game.js'
                ],
                dest: 'build/game.js'
            }
        },
        less: {
            production: {
                options: {
                    plugins: [
                        new (require('less-plugin-clean-css'))({})
                    ]
                },
                files: {
                    "build/game.css": [
                        'src/game.less'
                    ]
                }
            }
        },
        copy: {
            main: {
                src: 'src/assets/*',
                dest: 'build/assets/',
                flatten: true,
                expand: true,
                filter: 'isFile'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less', 'copy']);

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-contrib-copy');

};