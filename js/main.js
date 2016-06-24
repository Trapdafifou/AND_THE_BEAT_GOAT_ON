/**
 * Created by Thib on 23/06/2016.
 */
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.spritesheet('sprite', 'assets/link.png', 120, 130, 80);

}


var goat;
var goats;
var ground;


function create() {
    goats = game.add.group();


    function createGoats() {
        for (var i = 0; i <= 8; i++)
        {

            var goat = goats.create(300, 200, 'sprite');
            goat.scale.setTo(0.5, 0.5);
        }
    }
createGoats();


// face();


}

function update() {


    goats.forEach(function(g){
        g.y += 1;

    });
}

function render() {
    game.debug.spriteInfo(goats, 20, 32);
    game.debug.spriteInfo(ground, 900, 32);

}