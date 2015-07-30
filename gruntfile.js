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
                    'src/pixi.js',
                    'src/matter.js',
                    'src/BreakOut.js',
                    'src/BreakOut.Element.js',
                    'src/BreakOut.Ball.js',
                    'src/BreakOut.Paddle.js',
                    'src/BreakOut.Brick.js',
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