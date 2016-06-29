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
    game.load.image('rap', 'enceinte-jaune.png');
    game.load.image('metal', 'enceinte-rouge.png');
    game.load.image('regge', 'enceinte-bleu.png');
    game.load.image('pluie', 'pluie.png');
    game.load.image('tornade', 'tornade.png');
    game.load.image('exit', 'exit.png');
    game.load.audio('bob', ['assets/audio/oedipus_wizball_highscore.mp3', 'assets/audio/oedipus_wizball_highscore.ogg']);
    game.load.audio('guetta', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
    game.load.image('goat-rightdown', 'chevresright.png');
    game.load.image('goat-leftdown', 'chevres.png');
    game.load.image('goat-leftup', 'chevresUpLeft.png');
    game.load.image('goat-rightup', 'chevresUpRight.png');
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

var score;
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


    // Passage en mode constructeur
    var boutonRegge = game.add.button(50, 450, 'regge', buildRegge, this, 2, 1, 0);
    boutonRegge.scale.setTo(0.2,0.2);

    // Passage en mode pluie
    var boutonMetal = game.add.button(50, 350, 'metal', buildMetal, this, 2, 1, 0);
    boutonMetal.scale.setTo(0.2,0.2);

    // Passage en mode tempête de vomi
    var boutonRap = game.add.button(150, 450, 'rap', buildRap, this, 2, 1, 0);
    boutonRap.scale.setTo(0.2,0.2);


    // Création des goats
    goats = game.add.group();

    function createGoat() {

        goat = goats.create(305, 90 , 'goat-rightdown');
        goat.scale.setTo(0.07, 0.07);
        goat.caseX = 0;
        goat.caseY = 1;
        goat.lastX = 0;
        goat.lastY = 0;



        // Déplacement du sprite au mouvement de la chèvre
        var moveLeft= function(goat) {
            goat.x -= 38;
            goat.y -= 13;
        };

        var moveRight = function(goat) {
            goat.x += 37;
            goat.y += 13;
        };

        var moveUp = function(goat) {
            goat.x += 35;
            goat.y -= 17;
        };

        var moveDown = function(goat) {
            goat.x -= 33;
            goat.y += 20;
        };

        var actionGoat = function(caseX, caseY, lastX, lastY) {

            // Détection d'une enceinte Regge
            if (map[caseY + 1][caseX - 1] == 5) { // Bas gauche
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }
            if (map[caseY + 1][caseX] == 5) { // Bas
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }
            if (map[caseY + 1][caseX + 1] == 5) { // Bas droite
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }
            if (map[caseY][caseX - 1] == 5) { // Gauche
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }
            if (map[caseY][caseX + 1] == 5) { // Droite
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }
            if (map[caseY - 1][caseX - 1] == 5) { // Haut gauche
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }
            if (map[caseY - 1][caseX] == 5) { // Haut
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }
            if (map[caseY - 1][caseX + 1] == 5) { // Haut droite
                goat.kill();
                console.log("Goat absorbée. Vive le " + core.etat + " !!")
            }            


            // Déplacement sur une case libre
            // Retour en arriere empeché
            // Droite
            if (map[caseY][caseX + 1] == 1 && (caseX + 1 !== lastX)) {
                moveRight(goat);
                goat.loadTexture('goat-rightdown');
                goat.lastX = goat.caseX;
                goat.lastY = goat.caseY;
                goat.caseX +=1;
            // Bas
            } else if (map[caseY + 1][caseX] == 1 && (caseY + 1 !== lastY)) {
                moveDown(goat);
                goat.loadTexture('goat-leftdown');
                goat.lastX = goat.caseX;
                goat.lastY = goat.caseY;
                goat.caseY +=1;
            // Gauche
            } else if (map[caseY][caseX - 1] == 1 && (caseX - 1 !== lastX)) {
                moveLeft(goat);
                goat.loadTexture('goat-leftup');
                goat.lastX = goat.caseX;
                goat.lastY = goat.caseY;
                goat.caseX -=1;
            // Haut
            } else if (map[caseY - 1][caseX] == 1 && (caseY - 1 !== lastY)) {
                moveUp(goat);
                goat.loadTexture('goat-rightup');
                goat.lastX = goat.caseX;
                goat.lastY = goat.caseY;
                goat.caseY -=1;
            // On bute la chevre à l'arrivée
            } else if (caseX == 13 && caseY == 8) {
                goat.kill();
            }
            setTimeout(function() {
                actionGoat(goat.caseX, goat.caseY, goat.lastX, goat.lastY);
            }, 500);
        }

        actionGoat(goat.caseX, goat.caseY);

        setTimeout(function() {
            createGoat();
        }, 500);    

    }
    createGoat();

    

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

    if (core.etat == "rap" && map[selectedY][selectedX] == 0) {
        building(selectedX, selectedY, "rap");
    }
    if (core.etat == "metal" && map[selectedY][selectedX] == 0) {
        building(selectedX, selectedY, "metal");
    }
    if (core.etat == "regge" && map[selectedY][selectedX] == 0) {
        building(selectedX, selectedY, "regge");
    }


}

// Survol d'une case
function onOver(sprite) {

    if (core.etat !== "repos" && map[sprite.caseY][sprite.caseX] == 0) {
        sprite.alpha = 1;
        sprite.tint = 0x00ff00;
    } else if (core.etat !== "repos") {
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

    // random vomi
    smoke.customSort(scaleSort, this);

    // checkGoat();
}

// Affichages d'états pour le débugging
function render() {

}

// Permet le drag and drop du sprite
function dragDrop(obj) {
    obj.inputEnabled = true;
    obj.input.enableDrag();
    obj.input.enableSnap(30, 15, true, true);
    obj.input.enableSnap(45, 30, true, true);
};


/*
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

}*/


function buildRap() {
    if (core.etat == "repos") {
        core.etat = "rap";
    } else {
        core.etat = "rap";
    }
}

function buildMetal() {
    if (core.etat == "repos") {
        core.etat = "metal";
    } else {
        core.etat = "metal";
    }
}

function buildRegge() {
    if (core.etat == "repos") {
        core.etat = "regge";
    } else {
        core.etat = "regge";
    }
}

function building(caseX, caseY) {
    if (map[selectedY][selectedX] == 0) {
        var enceinte = game.add.image((-35*caseY) + (39.7 * caseX) + 325, (14 + 17*caseX) + (17.2 * caseY) + 45, core.etat);
        // Enceinte minifiée
        enceinte.scale.setTo(0.1,0.1);
        enceinte.name = caseX + "-" + caseY;
        // Sauvegarde dans le tableau map
        if (core.etat == "rap") {
            map[selectedY][selectedX] = 3;    
        } else if (core.etat == "metal") {
            map[selectedY][selectedX] = 4;    
        } else if (core.etat == "regge") {
            map[selectedY][selectedX] = 5;    
        }
        
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
