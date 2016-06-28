// Prise en charge de l'audio de la page
window.PhaserGlobal = {disableWebAudio: true};

// Création de l'instance du jeu
var game = new Phaser.Game(900, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    // Préchargement du jeu
    game.load.image('tuile', 'case-xs-light.png');
    game.load.image("background", "carte.png");
    game.load.image('cadre', 'cadre.png');
    game.load.image('enceinte', 'enceinte.png');
    game.load.image('pluie', 'pluie.png');
    game.load.image('tornade', 'tornade.png');
    game.load.image('exit', 'exit.png');
    game.load.audio('bob', ['assets/audio/oedipus_wizball_highscore.mp3', 'assets/audio/oedipus_wizball_highscore.ogg']);
    game.load.audio('guetta', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
    game.load.audio('vide', ['assets/audio/goaman_intro.mp3', 'assets/audio/goaman_intro.ogg']);
    game.load.image('sprite', 'chevresright.png');
    game.load.image('spriteLeft', 'chevres.png');
    game.load.image('spriteUpLeft', 'chevresUpLeft.png');
    game.load.image('spriteUpRight', 'chevresUpRight.png')
    game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
    game.load.image('smoke', 'smoke-puff.png');


}

// 0 case disponible
// 1 case chemin
// 2 3 4 5 Cases enceintes
var map = [
    [   0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0   ],
    [   1,  1,  0,  1,  1,  1,  1,  0,  1,  0,  0,  0,  1,  0   ],
    [   0,  1,  0,  1,  0,  0,  1,  0,  1,  1,  1,  0,  1,  0   ],
    [   1,  1,  0,  1,  1,  0,  1,  0,  0,  0,  1,  0,  1,  0   ],
    [   1,  0,  0,  0,  1,  0,  1,  0,  1,  1,  1,  0,  1,  0   ],
    [   1,  1,  0,  0,  1,  0,  1,  0,  1,  0,  0,  0,  1,  0   ],
    [   0,  1,  0,  1,  1,  0,  1,  1,  1,  0,  1,  1,  1,  0   ],
    [   0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0   ],
    [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1   ],
    [   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0   ],
];

var button;
var enceintes;
var popup;
var tween = null;
var text = '';
var musicText;
var musicText2 = '';
var artist = ["Bob Marley", "David Guetouille"];
var selectedX;
var selectedY;
var selectedSong = "";
var nowPlaying;
var bobSong;
var guettaSong;
var videSong;
var music;
var goat;
var goats;
var goatX = (-35 * 1) + (39.7 * 1);
var goatY = (14 + 17 * 1) + (17.2 * 1);
var counter = 0;
var core = {};
var emitter;
var smoke;
var tornade;



function create() {

    // Ajout de la map
    var bkg = game.add.sprite(0, 0, "background");

    // Création de la grille de cases
    for (var j = 0; j < 10; j++) {
        for (var i = 0; i < 14; i++) {
            // Décallage a chaque itération pour adapter a l'isometric
            button = game.add.button((-35 * j) + (39.7 * i) + 325, (14 + 17 * i) + (17.2 * j) + 65, 'tuile', building, this, 2, 1, 0);
            button.name = 'X' + i + '-Y' + j;
            button.caseX = i;
            button.caseY = j;
            button.input.useHandCursor = true;
            button.alpha = 0;
            button.events.onInputDown.add(onDown, this);
            button.events.onInputOver.add(onOver, this);
            button.events.onInputOut.add(onOut, this);
        }
    }

    //  Fenêtre de profil de la case
    popup = game.add.sprite(200, 200, 'cadre');
    popup.alpha = 0.8;
    popup.anchor.set(0.5);
    popup.inputEnabled = true;
    // Permet le déplacement
    popup.input.enableDrag();
    popup.alpha = 0;
    // Placement de la croix de fermeture en haut à droite
    var pw = (popup.width / 2) - 30;
    var ph = (popup.height / 2) - 8;
    var closeButton = game.make.sprite(pw, -ph, 'exit');
    closeButton.scale.setTo(0.2, 0.2);
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;
    closeButton.events.onInputDown.add(closeWindow, this);
    popup.addChild(closeButton);
    popup.scale.set(0.1);

    // Style CSS du texte du popup
    var style = {font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 500};

    // Ajout des texts du popup
    musicText = game.add.text(0, 0, "", style);
    musicText.anchor.set(0.5);
    musicText.alpha = 0;
    musicText2 = game.add.text(0, 0, "", style);
    musicText2.anchor.set(0.5);
    musicText2.alpha = 0;

    // Chargement des sons dans le navigateur
    bobSong = game.add.audio('bob');
    guettaSong = game.add.audio('guetta');
    videSong = game.add.audio('vide');
    videSong.play();
    guettaSong.play();
    bobSong.play();
    bobSong.pause();
    guettaSong.pause();

    // Passage en mode constructeur
    var enceinte = game.add.button(50, 450, 'enceinte', buildMode, this, 2, 1, 0);
    enceinte.scale.setTo(0.2,0.2);

    // Passage en mode pluie
    var meteo = game.add.button(50, 350, 'pluie', rainMode, this, 2, 1, 0);
    meteo.scale.setTo(0.3,0.3);

    // Passage en mode tempête de vomi
    var tornade = game.add.button(150, 450, 'tornade', vomiMode, this, 2, 1, 0);
    tornade.scale.setTo(0.1,0.1);


    // Update de la musique si necessaire au click
    game.input.onDown.add(changeVolume, this);

    // Création des goats
    goats = game.add.group();
    function createGoats(wave) {
        // createGoats generate the goats.
        for (var i = 0; i <= wave; i++) {
            goat = goats.create(305, 90 , 'sprite');
            goat.scale.setTo(0.07, 0.07);
        }
    }

    createGoats(3);


    // Grille de debug 100x100
    game.add.sprite(0, 0, game.create.grid('grid', 100 * 9, 100 * 6, 100, 100, 'rgba(0, 250, 0, 1)'));



    // Mode pluie
    emitter = game.add.emitter(game.world.centerX, 0, 400);
    emitter.width = game.world.width;
    // emitter.angle = 30; // uncomment to set an angle for the rain.
    emitter.makeParticles('rain');
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;
    emitter.setYSpeed(400, 600);
    emitter.setXSpeed(-10, 10);
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.start(false, 1600, 5, 0);
    emitter.alpha = 0;

    // Mode tornade de vomi
    //  Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    smoke = game.add.emitter(game.world.centerX, 500, 400);
    //  This smoke will have a width of 800px, so a particle can emit from anywhere in the range smoke.x += smoke.width / 2
    // smoke.width = 800;
    smoke.makeParticles('smoke');
    smoke.setXSpeed(0, 0);
    smoke.setYSpeed(0, 0);
    smoke.setRotation(0, 0);
    smoke.setAlpha(0.1, 1, 3000);
    smoke.setScale(0.4, 2, 0.4, 2, 6000, Phaser.Easing.Quintic.Out);
    smoke.gravity = -10;
    smoke.start(false, 4000, 20);
    smoke.emitX = 64;
    smoke.emitY = 500;
    game.add.tween(smoke).to( { emitX: 800-64 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    game.add.tween(smoke).to( { emitY: 200 }, 4000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    smoke.alpha = 0;

}

// Fonction d'ouverture du popup
function openWindow() {

    // Animation elastique d'ouverture
    if ((tween !== null && tween.isRunning) || popup.scale.x === 1) {
        return;
    }

    //  Agrandit la fenêtre si elle n'est pas déjà ouverte
    tween = game.add.tween(popup.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);
    setTimeout(function () {
        musicText.alpha = 1;
        musicText2.alpha = 1;
    }, 400);
    popup.alpha = 1;

}

// Fermeture de la popup
function closeWindow() {

    if (tween && tween.isRunning || popup.scale.x === 0.1) {
        return;
    }

    //  Ferme la fenêtre si elle n'est pas déjà fermée
    tween = game.add.tween(popup.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.In, true);
    musicText.alpha = 0;
    musicText2.alpha = 0;
    setTimeout(function () {
        popup.alpha = 0;
    }, 500);
    selectedSong = "";
    changeVolume();
}


// Activation d'une case
function onDown(sprite) {


        text = "onDown: " + sprite.name;
        selectedX = sprite.caseX;
        selectedY = sprite.caseY;
        sprite.tint = 0xff0000;

        if (core.etat == "builder" && map[selectedY][selectedX] == 0) {
            building(selectedX, selectedY);
        }


}

// Survol d'une case
function onOver(sprite) {

    if (core.etat == "builder" && map[sprite.caseY][sprite.caseX] == 0) {
        sprite.alpha = 1;
        sprite.tint = 0x00ff00;
    } else if (core.etat == "builder") {
        sprite.alpha = 1;
        sprite.tint = 0xff0000;
    }
    text = "onOver: " + sprite.name;

}

// Souris sortie de la case
function onOut(sprite) {

    text = "onOut: " + sprite.name;

    sprite.tint = 0xffffff;
    sprite.alpha = 0;

}

// Mise à jour des données du jeu
function update() {

    // Suivi des texts d'information sur le popup
    musicText.x = Math.floor(popup.x + musicText.width / 2) - 120;
    musicText.y = Math.floor(popup.y + musicText.height / 2) - 80;
    musicText.text = selectedSong;
    musicText2.x = Math.floor(popup.x + musicText.width / 2) - 120;
    musicText2.y = Math.floor(popup.y + musicText.height / 2) - 60;
    musicText2.text = selectedX + " - " + selectedY + " - " + selectedSong;

    // random vomi
    smoke.customSort(scaleSort, this);

    // checkGoat();
}
function moveIt(){
    var rightG = {
        x : 34,
        y : 18
    };
    var leftG = {
        x : -38,
        y : -18
    };
    var downG =  {
        x : -33,
        y : 18
    };
        setInterval(function () {
            counter++;
            console.log(counter);
            if (counter <= 1) {
                goat.x += rightG.x;
                goat.y += rightG.y;
                goat.loadTexture('sprite');
            }
            else if (counter > 1 && counter <= 3) {
                goat.x += downG.x;
                goat.y += downG.y;
                goat.loadTexture('spriteLeft');
            }
            if(counter >3 && counter <=4 ){
                goat.x += leftG.x;
                goat.y += leftG.y;
                goat.loadTexture('spriteUpLeft');
            }
            else if(counter > 4 && counter <= 6){
                goat.x += downG.x;
                goat.y += downG.y;
                goat.loadTexture('spriteLeft');
            }
            if(counter > 6 && counter <=7 ){
                goat.x += rightG.x;
                goat.y += rightG.y;
                goat.loadTexture('sprite');
            }
            else if(counter > 7 && counter <= 9){
                goat.x += downG.x;
                goat.y += downG.y;
                goat.loadTexture('spriteLeft');
            }
            if(counter > 9 && counter <= 11){
                goat.x += rightG.x;
                goat.y += rightG.y;
                goat.loadTexture('sprite');
            }
            else if(counter > 11 && counter <= 12){
                goat.x += -downG.x;
                goat.y += -downG.y;
                goat.loadTexture('spriteUpRight');
            }
            if(counter > 12 && counter <= 13){
                goat.x += rightG.x+15;
                goat.y += rightG.y-3;
                goat.loadTexture('sprite');
            }
           else if(counter > 13 && counter <= 16){
                goat.x += -downG.x;
                goat.y += -downG.y;
                goat.loadTexture('spriteUpRight');
            }
            if(counter > 16 && counter <= 17){
                goat.x += leftG.x;
                goat.y += leftG.y;
                goat.loadTexture('spriteUpLeft');
            }
            else if(counter > 17 && counter <= 19){
                goat.x += -downG.x;
                goat.y += -downG.y;
                goat.loadTexture('spriteUpRight');
            }
            if(counter > 19 && counter <= 22){
                goat.x += rightG.x+10;
                goat.y += rightG.y;
                goat.loadTexture('sprite');
            }
            else if(counter > 22 && counter <= 27){
                goat.x += downG.x-1;
                goat.y += downG.y;
                goat.loadTexture('spriteLeft');
            }
            if(counter > 27 && counter <= 29){
                goat.x += rightG.x;
                goat.y += rightG.y;
                goat.loadTexture('sprite');
            }
            else if(counter > 29 && counter <= 31){
                goat.x += -downG.x;
                goat.y += -downG.y;
                goat.loadTexture('spriteUpRight');
            }
            if(counter > 31 && counter <= 33){
                goat.x += rightG.x+2;
                goat.y += rightG.y-5;
                goat.loadTexture('sprite');
            }
            else if(counter > 33 && counter <= 35){
                goat.x += -downG.x;
                goat.y += -downG.y;
                goat.loadTexture('spriteUpRight');
            }
            if(counter > 35 && counter <= 37){
                goat.x += leftG.x;
                goat.y += leftG.y;
                goat.loadTexture('spriteUpLeft');
            }
            else if(counter > 37 && counter <= 39){
                goat.x += -downG.x;
                goat.y += -downG.y;
                goat.loadTexture('spriteUpRight');
            }
            if(counter > 39 && counter <= 43){
                goat.x += rightG.x;
                goat.y += rightG.y;
                goat.loadTexture('sprite');
            }
            else if(counter > 43 && counter <= 49){
                goat.x += downG.x;
                goat.y += downG.y;
                goat.loadTexture('spriteLeft');
            }
            if(counter > 49 && counter <= 51){
                goat.x += leftG.x;
                goat.y += leftG.y;
                goat.loadTexture('spriteUpLeft');
            }
            else if(counter > 51 && counter <= 53){
                goat.x += downG.x;
                goat.y += downG.y;
                goat.loadTexture('spriteLeft');
            }
            if(counter > 53 && counter <= 56){
                goat.x += rightG.x;
                goat.y += rightG.y;
                goat.loadTexture('sprite');
            }
            if(counter==56){
                clearInterval(this);
                counter += 0;
                goat.kill();
            }

        }, 500);
}
moveIt();
// Affichages d'états pour le débugging
function render() {

    if (text === '') {
        game.debug.text("Interact with the Sprites.", 32, 32);
    }
    else {
        game.debug.text(text, 32, 32);
        game.debug.text(selectedX + " - " + selectedY + " - " + selectedSong, 32, 62);
    }

}

// Permet le drag and drop du sprite
function dragDrop(obj) {
    obj.inputEnabled = true;
    obj.input.enableDrag();
    obj.input.enableSnap(30, 15, true, true);
    obj.input.enableSnap(45, 30, true, true);
};

// Gestion de la musique jouée
function changeVolume(pointer) {

    if (selectedSong == "guetta") {
        bobSong.pause();
        videSong.pause();
        guettaSong.resume();
    }
    else if (selectedSong == "bob") {
        guettaSong.pause();
        videSong.pause();
        bobSong.resume();
    } else {
        bobSong.pause();
        guettaSong.pause();
        videSong.resume();
    }
    nowPlaying = selectedSong;

}


function buildMode() {
    if (core.etat == "builder") {
        core.etat = "repos";
    } else {
        core.etat = "builder";
    }
}

function rainMode() {
    if (core.meteo == "pluie") {
        core.meteo = "sec";
        emitter.alpha = 0;
    } else {
        core.meteo = "pluie";
        emitter.alpha = 1;
    }
}

function vomiMode() {
    if (core.vomi == "sec") {
        core.vomi = "vomi";
        smoke.alpha = 0;
    } else {
        core.vomi = "sec";
        smoke.alpha = 1;
    }
}

function building(caseX, caseY) {
    if (map[selectedY][selectedX] == 0) {
        var enceinte = game.add.image((-35*caseY) + (39.7 * caseX) + 325, (14 + 17*caseX) + (17.2 * caseY) + 45, "enceinte");
        enceinte.scale.setTo(0.1,0.1);
        enceinte.name = caseX + "-" + caseY;
        map[selectedY][selectedX] = 5;
    }
}


function scaleSort(a, b) {
    if (a.scale.x < b.scale.x)
    {
        return -1;
    }
    else if (a.scale.x > b.scale.x)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

function checkGoat(){
    if (goats.length > 100) {
        console.log(goats);
        goats.forEach(partyGoat);
    }
}

function partyGoat(caseX, caseY) {
    var posX = this.caseX;
    var posY = this.caseY;
    if (map[(caseY -1)][(caseX -1)] == 5) {
        console.log("case -1 -1 proc");
    }
}

function recycle() {

}
