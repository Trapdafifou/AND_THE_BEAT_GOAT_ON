/**
 * Created by Thib on 23/06/2016.
 */
var style =["rap", "reggae", "metal"];
var scene = {
  life : 30
};


var game = new Phaser.Game(900, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});


function preload() {
    //Load images
    game.load.spritesheet('sprite', 'assets/link.png', 120, 130, 80);

}


var goat;
var goats;
var posY = 200;

function create() {
    goats = game.add.group();


    function createGoats() {
        // createGoats generate the goats.
        for (var i = 0; i <= 8; i++) {
            goat = goats.create(game.world.centerX, game.world.top, 'sprite');
            goat.scale.setTo(0.5, 0.5);
            console.log(goat)
        }
    }
    game.time.events.loop(Phaser.Timer.SECOND * 2, createGoats, this)
}

function update() {
    //Goats move from Y min to Y max and are killed
    setTimeout(function(){
        goats.forEach(function () {
            goat.y += 1;
        });
        if(goat.y >= 600-130 ){
            goat.y += 0;
            goat.y = 0;
            goat.kill()
        }
    },2000);
}


function render() {
}