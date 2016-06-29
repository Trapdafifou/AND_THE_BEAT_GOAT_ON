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

    // Chevre nue
    game.load.image('goat-rightdown', 'chevresright.png');
    game.load.image('goat-leftdown', 'chevres.png');
    game.load.image('goat-leftup', 'chevresUpLeft.png');
    game.load.image('goat-rightup', 'chevresUpRight.png');
    
    // Chevre bleue
    game.load.image('goat-yellow-rightdown', 'chevresright-jaune.png');
    game.load.image('goat-yellow-leftdown', 'chevres-jaune.png');
    game.load.image('goat-yellow-leftup', 'chevresUpLeft-jaune.png');
    game.load.image('goat-yellow-rightup', 'chevresUpRight-jaune.png');

    // Chevre jaune
    game.load.image('goat-blue-rightdown', 'chevresright-bleu.png');
    game.load.image('goat-blue-leftdown', 'chevres-bleu.png');
    game.load.image('goat-blue-leftup', 'chevresUpLeft-bleu.png');
    game.load.image('goat-blue-rightup', 'chevresUpRight-bleu.png');
    game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
    game.load.image('smoke', 'smoke-puff.png');


}

// 0 case disponible
// 1 case chemin
// 2 3 4 5 Cases enceintes
var map = [
    [   9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9   ],
    [   9,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  9   ],
    [   9,  1,  1,  0,  1,  1,  1,  1,  0,  1,  0,  0,  0,  1,  0,  9   ],
    [   9,  0,  1,  0,  1,  0,  0,  1,  0,  1,  1,  1,  0,  1,  0,  9   ],
    [   9,  1,  1,  0,  1,  1,  0,  1,  0,  0,  0,  1,  0,  1,  0,  9   ],
    [   9,  1,  0,  0,  0,  1,  0,  1,  0,  1,  1,  1,  0,  1,  0,  9   ],
    [   9,  1,  1,  0,  0,  1,  0,  1,  0,  1,  0,  0,  0,  1,  0,  9   ],
    [   9,  0,  1,  0,  1,  1,  0,  1,  1,  1,  0,  1,  1,  1,  0,  9   ],
    [   9,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  9   ],
    [   9,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  9   ],
    [   9,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  9   ],
    [   9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9   ],
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
var capaciteSite = 200;
var tableGoat = [];
var goat1;
var goat2;
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
    for (var j = 0; j < 12; j++) {
        for (var i = 0; i < 16; i++) {
            // Décallage a chaque itération pour adapter a l'isometric
            button = game.add.button((-35 * j) + (39.7 * i) + 322, (14 + 17 * i) + (17.2 * j) + 31, 'tuile', building, this, 2, 1, 0);
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


    // Création d'un bon nombre de goats
    setInterval(function() {
        goat = createGoat();
    }, 1000);

    
    // Etat initial du jeu
    core.score = 0;
    // pas d'enceinte selectionnee
    core.etat = "repos";



    // Grille de debug 100x100
    // game.add.sprite(0, 0, game.create.grid('grid', 100 * 9, 100 * 6, 100, 100, 'rgba(0, 250, 0, 1)'));



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
    for (var i = 0; i < tableGoat.length; i++) {
        actionGoat(tableGoat[i]);
    }

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
        var enceinte = game.add.image((-35*caseY) + (39.7 * caseX) + 322, (14 + 17*caseX) + (17.2 * caseY) + 11, core.etat);
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

var actionGoat = function(goat) {
    if (goat.fatigue == 1) {
        return null;
    }


    // Débug du bord de map  
    var caseUpLeft = 9;
    var caseUp = 9;
    var caseUpRight = 9;
    if (map[goat.caseY -1][goat.caseX -1] !== undefined) {
        caseUpLeft = map[goat.caseY -1][goat.caseX -1];
    } 
    if (map[goat.caseY -1][goat.caseX] !== undefined) {
        caseUp = map[goat.caseY -1][goat.caseX];
    }
    if (map[goat.caseY -1][goat.caseX +1] !== undefined) {
        caseUpRight = map[goat.caseY -1][goat.caseX +1];
    }

    // Détection d'une enceinte Regge
    if (map[goat.caseY + 1][goat.caseX - 1] == goat.style) { // Bas gauche
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }
    if (map[goat.caseY + 1][goat.caseX] == goat.style) { // Bas
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }
    if (map[goat.caseY + 1][goat.caseX + 1] == goat.style) { // Bas droite
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }
    if (map[goat.caseY][goat.caseX - 1] == goat.style) { // Gauche
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }
    if (map[goat.caseY][goat.caseX + 1] == goat.style) { // Droite
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }
    if (caseUpLeft == goat.style) { // Haut gauche
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }
    if (caseUp == goat.style) { // Haut
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }
    if (caseUpRight == goat.style) { // Haut droite
        goat.kill();
        core.score += goat.style;
        console.log("Goat absorbée. Update du score : " + core.score + " !")
    }          


    // Déplacement sur une case libre
    // Retour en arriere empeché
    // Droite
    if (map[goat.caseY][goat.caseX + 1] == 1 && (goat.caseX + 1 !== goat.lastX)) {
        if (game.rnd.integerInRange(1, 4) == 1) {
            moveRight(goat);
            if (goat.style == "3") {
                goat.loadTexture('goat-yellow-rightdown');    
            } else if (goat.style == "5") {
                goat.loadTexture('goat-blue-rightdown');    
            } else {
                goat.loadTexture('goat-rightdown');   
            }
            
            goat.lastX = goat.caseX;
            goat.lastY = goat.caseY;
            goat.caseX +=1;
        } else {
            return null;
        }
        
    // Bas
    } else if (map[goat.caseY + 1][goat.caseX] == 1 && (goat.caseY + 1 !== goat.lastY)) {
        if (game.rnd.integerInRange(1, 3) == 1) {
            moveDown(goat);
            if (goat.style == "3") {
                goat.loadTexture('goat-yellow-leftdown');    
            } else if (goat.style == "5") {
                goat.loadTexture('goat-blue-leftdown');    
            } else {
                goat.loadTexture('goat-leftdown');   
            }
            goat.lastX = goat.caseX;
            goat.lastY = goat.caseY;
            goat.caseY +=1;
        } else {
            return null;
        }
    // Gauche
    } else if (map[goat.caseY][goat.caseX - 1] == 1 && (goat.caseX - 1 !== goat.lastX)) {
        if (game.rnd.integerInRange(1, 2) == 1) {
            moveLeft(goat);
            if (goat.style == "3") {
                goat.loadTexture('goat-yellow-leftup');    
            } else if (goat.style == "5") {
                goat.loadTexture('goat-blue-leftup');    
            } else {
                goat.loadTexture('goat-leftup');   
            }
            goat.lastX = goat.caseX;
            goat.lastY = goat.caseY;
            goat.caseX -=1;
        } else {
            return null;
        }
    // Haut
    } else if (caseUp == 1 && (caseUp !== goat.lastY)) {
        if (game.rnd.integerInRange(1, 2) == 1) {
            moveUp(goat);
            if (goat.style == "3") {
                goat.loadTexture('goat-yellow-rightup');    
            } else if (goat.style == "5") {
                goat.loadTexture('goat-blue-rightup');    
            } else {
                goat.loadTexture('goat-rightup');   
            }
            goat.lastX = goat.caseX;
            goat.lastY = goat.caseY;
            goat.caseY -=1;
        } else {
            return null;
        }
    // On bute la chevre à l'arrivée
    } else if (goat.caseX == 13 && goat.caseY == 8) {
        goat.kill();
    }
    goat.fatigue = 1;
    setTimeout(function(){
        goat.fatigue = 0;
    }, (1 / goat.endurence) * 1000);

};

function createGoat() {

    goat = goats.create(305, 90 , 'goat-rightdown');
    goat.scale.setTo(0.07, 0.07);
    goat.caseX = 1;
    goat.caseY = 2;
    goat.lastX = 1;
    goat.lastY = 1;
    goat.fatigue = 0;
    goat.endurence = game.rnd.integerInRange(1, 3);
    goat.style = game.rnd.integerInRange(3, 5);
    tableGoat.push(goat);
    return goat;

}




/// ON LIEBERE LES CHEVRES