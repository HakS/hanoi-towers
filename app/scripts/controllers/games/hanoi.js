'use strict';

/**
 * @ngdoc function
 * @name haksGamesApp.controller:HanoiCtrl
 * @description
 * # HanoiCtrl
 * Controller of the haksGamesApp
 */

angular.module('haksGamesApp')
    .directive('hanoiGame', function($compile) {

        //var Animal = (function() {
        //    function Animal(name) {
        //        this.name = name;
        //    }
        //
        //    Animal.prototype.move = function(meters) {
        //        return alert(this.name + (" moved " + meters + "m."));
        //    };
        //
        //    return Animal;
        //
        //})();
        //
        //var sam = new Animal("Sammy the Python");
        //sam.move();

        //var SpriteContainer = (function() {
        //    function SpriteContainer(name, ) {
        //
        //    }
        //});

        var renderGame = function(scope, element) {
            var canvasCompile = $compile('<canvas></canvas>')(scope);
            element.append(canvasCompile);

            var canvas = canvasCompile[0];
            var ctx = canvas.getContext("2d");
            canvas.width = 1024;
            canvas.height = 800;


            // Sprite image
            var spriteReady = false;
            var spriteImage = new Image();
            spriteImage.onload = function () {
                spriteReady = true;
            };
            spriteImage.src = "images/games/hanoi/sprites.gif";




            // Hero image
            var heroReady = false;
            var heroImage = new Image();
            heroImage.onload = function () {
                heroReady = true;
            };
            heroImage.src = "images/games/hanoi/hero.png";

            // Monster image
            var monsterReady = false;
            var monsterImage = new Image();
            monsterImage.onload = function () {
                monsterReady = true;
            };
            monsterImage.src = "images/games/hanoi/monster.png";

            // Game objects
            var hero = {
                speed: 256 // movement in pixels per second
            };
            var monster = {};
            var monstersCaught = 0;

            // Handle keyboard controls
            var keysDown = {};

            addEventListener("keydown", function (e) {
                keysDown[e.keyCode] = true;
                e.preventDefault();
            }, false);

            addEventListener("keyup", function (e) {
                delete keysDown[e.keyCode];
            }, false);

            // Reset the game when the player catches a monster
            var reset = function () {
                hero.x = canvas.width / 2;
                hero.y = canvas.height / 2;

                // Throw the monster somewhere on the screen randomly
                monster.x = 32 + (Math.random() * (canvas.width - 64));
                monster.y = 32 + (Math.random() * (canvas.height - 64));
            };

            // Update game objects
            var update = function (modifier) {
                if (38 in keysDown) { // Player holding up
                    hero.y -= hero.speed * modifier;
                }
                if (40 in keysDown) { // Player holding down
                    hero.y += hero.speed * modifier;
                }
                if (37 in keysDown) { // Player holding left
                    hero.x -= hero.speed * modifier;
                }
                if (39 in keysDown) { // Player holding right
                    hero.x += hero.speed * modifier;
                }

                // Are they touching?
                if (
                    hero.x <= (monster.x + 32)
                    && monster.x <= (hero.x + 32)
                    && hero.y <= (monster.y + 32)
                    && monster.y <= (hero.y + 32)
                ) {
                    ++monstersCaught;
                    reset();
                }
            };

            // Draw everything
            var render = function () {
                if (spriteReady) {
                    ctx.drawImage(spriteImage, 0, 0);
                }





                if (heroReady) {
                    ctx.drawImage(heroImage, hero.x, hero.y);
                }
                if (monsterReady) {
                    ctx.drawImage(monsterImage, monster.x, monster.y);
                }

                // Score
                ctx.fillStyle = "rgb(250, 250, 250)";
                ctx.font = "24px Helvetica";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
            };

            // The main game loop
            var main = function () {
                var now = Date.now();
                var delta = now - then;

                update(delta / 1000);
                render();

                then = now;

                // Request to do this again ASAP
                requestAnimationFrame(main);
            };

            // Cross-browser support for requestAnimationFrame
            var w = window;
            requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

            // Let's play this game!
            var then = Date.now();
            reset();
            main();
        };

        return {
            restrict: 'E',
            link: function(scope, element) {
                renderGame(scope, element);
            }
        };
    });
