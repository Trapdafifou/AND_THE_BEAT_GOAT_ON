// Prise en charge de l'audio de la page
window.PhaserGlobal = {disableWebAudio: true};

// Création du canvas de jeu
var game = new Phaser.Game(900, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {

    // Chargement des fichiers du jeu
    game.load.image('tuile', 'assets/case-xs-light.png');
    game.load.image("background", "assets/background.png");
    game.load.image('cadre', 'assets/cadre.png');
    game.load.image('pause', 'assets/pause.png');

    game.load.image('enceinte', 'assets/enceinte/enceinte-off.png');
    game.load.image('rap', 'assets/enceinte/enceinte-rap.png');
    game.load.image('metal', 'assets/enceinte/enceinte-rock.png');
    game.load.image('regge', 'assets/enceinte/enceinte-reggae.png');


    game.load.image('pluie', 'assets/pluie.png');
    game.load.image('tornade', 'assets/tornade.png');
    game.load.image('exit', 'assets/exit.png');
    game.load.audio('bob', ['assets/audio/oedipus_wizball_highscore.mp3', 'assets/audio/oedipus_wizball_highscore.ogg']);
    game.load.audio('guetta', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);

    //Chevre Musique
    game.load.audio('scream1', 'assets/audio/goat_scream.mp3');
    game.load.audio('scream2', 'assets/audio/goat_scream_1.mp3');
    game.load.audio('rap', 'assets/audio/rap.mp3');
    game.load.audio('reggae', 'assets/audio/reggae.mp3');
    game.load.audio('metal', 'assets/audio/metal.mp3');

    // Chevre rock
    game.load.image('goat-rightdown', 'assets/chevres/rock/ChevreRockDownRight.png');
    game.load.image('goat-leftdown', 'assets/chevres/rock/ChevreRockDownLeft.png');
    game.load.image('goat-leftup', 'assets/chevres/rock/ChevreRockUpLeft.png');
    game.load.image('goat-rightup', 'assets/chevres/rock/ChevreRockUpRight.png');

    // Chevre reggae
    game.load.image('goat-yellow-rightdown', 'assets/chevres/reggae/ChevreReggaeDownRight.png');
    game.load.image('goat-yellow-leftdown', 'assets/chevres/reggae/ChevreReggaeDownleft.png');
    game.load.image('goat-yellow-leftup', 'assets/chevres/reggae/ChevreReggaeUpLeft.png');
    game.load.image('goat-yellow-rightup', 'assets/chevres/reggae/ChevreReggaeUpRight.png');

    // Chevre rap
    game.load.image('goat-blue-rightdown', 'assets/chevres/rap/ChevreRapDownRight.png');
    game.load.image('goat-blue-leftdown', 'assets/chevres/rap/ChevreRapDownleft.png');
    game.load.image('goat-blue-leftup', 'assets/chevres/rap/ChevreRapUpLeft.png');
    game.load.image('goat-blue-rightup', 'assets/chevres/rap/ChevreRapUpRight.png');
    game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
    game.load.image('smoke', 'assets/smoke-puff.png');

}

// Map du jeu
// 0 case disponible
// 1 case chemin
// 3 case rap
// 4 case metal
// 5 case regge
// 9 case morte
var map = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 9],
    [9, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 9],
    [9, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 9],
    [9, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 9],
    [9, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 9],
    [9, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 9],
    [9, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 9],
    [9, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
];

// Variables du jeu
var saveMap;
var score;
var button;
var enceintes = [];
var tween = null;
var selectedX;
var selectedY;
var goat;
var capaciteSite = 200;
var tableGoat = [];
var goats;
var counter = 0;
var core = {};
var emitter;
var smoke;
var tornade;
var music;
var musicOn;
var rap;
var metal;
var reggae;

// Création au lancement du jeu des éléments présents dans create
function create() {
    pause_label = game.add.image(game.width -100, 20, 'pause');

    // Etat initial du jeu
    core.score = 0;
    // pas d'enceinte selectionnee
    core.etat = "repos";

    // Ajout de la map
    var bkg = game.add.sprite(0, 0, "background");
    game.stage.backgroundColor= '#7ec0ee';

    //Ajout des musiques

    rap = game.add.audio('rap');
    metal = game.add.audio('metal');
    reggae = game.add.audio('reggae');

    // Bouton du passage en mode constructeur regge
    var boutonRegge = game.add.button(50, 450, 'regge', buildRegge, this, 2, 1, 0);
    boutonRegge.scale.setTo(0.2, 0.2);

    // Bouton du passage en mode constructeur metal
    var boutonMetal = game.add.button(50, 350, 'metal', buildMetal, this, 2, 1, 0);
    boutonMetal.scale.setTo(0.2, 0.2);

    // Bouton du passage en mode constructeur rap
    var boutonRap = game.add.button(150, 450, 'rap', buildRap, this, 2, 1, 0);
    boutonRap.scale.setTo(0.2, 0.2);

    // Création de la grille de cases
    for (var j = 0; j < 12; j++) {
        for (var i = 0; i < 16; i++) {
            // Décallage a chaque itération pour adapter a l'isometric
            button = game.add.button(
                (-35 * j) + (39.7 * i) + 322,            // Position en X
                (14 + 17 * i) + (17.2 * j) + 31,         // Position en Y
                'tuile', building, this, 2, 1, 0);      // Visuel de la case
            button.name = 'X' + i + '-Y' + j;
            button.caseX = i;
            button.caseY = j;
            button.input.useHandCursor = true;
            button.alpha = 0; // Caché par défaut
            button.events.onInputDown.add(onDown, this);    // Event au click
            button.events.onInputOver.add(onOver, this);    // Event au survol
            button.events.onInputOut.add(onOut, this);      // Event au leave
        }
    }

    // Création du groupe de goats
    goats = game.add.group();

    // Création d'un bon nombre de goats par interval entre 2 et 8 secondes
    setInterval(function () {
        goat = createGoat();
        goatScream();
    }, 2000 * game.rnd.integerInRange(1, 3));

    // Mode pluie
    emitter = game.add.emitter(game.world.centerX, 0, 400);
    emitter.width = game.world.width;
    emitter.angle = 30;
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
    smoke = game.add.emitter(game.world.centerX, 500, 400);
    smoke.width = 800;
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
    game.add.tween(smoke).to({emitX: 800 - 64}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    game.add.tween(smoke).to({emitY: 200}, 4000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    smoke.alpha = 0;

}

// Click sur une case
function onDown(sprite) {

    selectedX = sprite.caseX;
    selectedY = sprite.caseY;
    sprite.tint = 0xff0000;

    // Construction d'une enceinte rap si permise
    if (core.etat == "rap" && map[selectedY][selectedX] == 0) {
        building(selectedX, selectedY, "rap");
    }
    // Construction d'une enceinte metal si permise
    if (core.etat == "metal" && map[selectedY][selectedX] == 0) {
        building(selectedX, selectedY, "metal");
    }
    // Construction d'une enceinte regge si permise
    if (core.etat == "regge" && map[selectedY][selectedX] == 0) {
        building(selectedX, selectedY, "regge");
    }

}

// Survol d'une case
function onOver(sprite) {

    // Vérification si constructible : valeur 0 dans la map et enceinte choisie
    if (core.etat !== "repos" && map[sprite.caseY][sprite.caseX] == 0) {
        // Coloration verte pour signaler la construction
        sprite.alpha = 1;
        sprite.tint = 0x00ff00;
        // Coloration rouge pour signaler le refus de construction
    } else if (core.etat !== "repos") {
        sprite.alpha = 1;
        sprite.tint = 0xff0000;
    }

}

// Fin de survol de la case
function onOut(sprite) {

    // On cache les sprites non survolés
    sprite.tint = 0xffffff;
    sprite.alpha = 0;

}

// Permet le drag and drop du sprite
function dragDrop(obj) {

    obj.inputEnabled = true;
    obj.input.enableDrag();
    obj.input.enableSnap(30, 15, true, true);
    obj.input.enableSnap(45, 30, true, true);

}


// Changement du mode de construction à Rap
function buildRap() {

    if (core.etat == "repos") {
        core.etat = "rap";
    } else {
        core.etat = "rap";
    }

}

// Changement du mode de construction à Metal
function buildMetal() {

    if (core.etat == "repos") {
        core.etat = "metal";
    } else {
        core.etat = "metal";
    }

}

// Changement du mode de construction à Regge
function buildRegge() {

    if (core.etat == "repos") {
        core.etat = "regge";
    } else {
        core.etat = "regge";
    }

}
function musical() {

    if (core.etat == "rap") {
        rap.play();

        metal.pause();
        reggae.pause();
    }

    else if (core.etat == "regge") {
        reggae.play();

        metal.pause();
        rap.pause();
    }
    else if (core.etat == "metal") {
        metal.play();

        reggae.pause();
        rap.pause();
    }
}


console.log(core.etat);
// Construction d'une enceinte
function building(caseX, caseY) {

    if (map[selectedY][selectedX] == 0) {

        // Visuellement
        var enceinte = game.add.image((-35 * caseY) + (39.7 * caseX) + 322, (14 + 17 * caseX) + (17.2 * caseY) + 11, core.etat);
        enceinte.scale.setTo(0.1, 0.1);
        enceinte.name = caseX + "-" + caseY;
        enceinte.selectedX = selectedX;
        enceinte.selectedY = selectedY;
        enceintes.push(enceinte);

        // L'enceinte se dégrade avec le temps et est inactive après 5s
        setTimeout(function () {
            destroy(enceinte);
        }, 5000);

        // Dans le code enregistré dans map
        if (core.etat == "rap") {
            map[selectedY][selectedX] = 3;
            musical();
        }
        else if (core.etat == "metal") {
            map[selectedY][selectedX] = 4;
            musical();
        } else if (core.etat == "regge") {
            map[selectedY][selectedX] = 5;
            musical();
        }

    }
}

function destroy(enceinte) {

    var selectedX = enceinte.selectedX;
    var selectedY = enceinte.selectedY;
    enceinte.kill();
    enceinte = game.add.image((-35 * enceinte.selectedY) + (39.7 * enceinte.selectedX) + 322,
        (14 + 17 * enceinte.selectedX) + (17.2 * enceinte.selectedY) + 11, "enceinte");
    enceinte.scale.setTo(0.1, 0.1);
    map[selectedY][selectedX] = 9;
}


// Déplacement du sprite au mouvement de la chèvre
// Les valeurs de déplacement sont adaptées au maillage de la map
var moveLeft = function (goat) {

    goat.x -= 38;
    goat.y -= 13;

};

var moveRight = function (goat) {

    goat.x += 37;
    goat.y += 13;

};

var moveUp = function (goat) {

    goat.x += 35;
    goat.y -= 17;

};

var moveDown = function (goat) {

    goat.x -= 33;
    goat.y += 20;

};

// Déplacement et interraction de la chèvre
var actionGoat = function (goat) {

    // Si elle est fatiguée, elle ne fait rien
    if (goat.fatigue == 1) {
        return null;
    }

    // Détection d'une enceinte par vérification successive des cases adjacentes
    // goat.style == 3 : rap
    // goat.style == 4 : regge
    // goat.style == 5 : metal
    if (map[goat.caseY + 1][goat.caseX - 1] == goat.style) { // Bas gauche
        goat.moral += 5;
    }
    if (map[goat.caseY + 1][goat.caseX] == goat.style) { // Bas
        goat.moral += 5;
    }
    if (map[goat.caseY + 1][goat.caseX + 1] == goat.style) { // Bas droite
        goat.moral += 5;
    }
    if (map[goat.caseY][goat.caseX - 1] == goat.style) { // Gauche
        goat.moral += 5;
    }
    if (map[goat.caseY][goat.caseX + 1] == goat.style) { // Droite
        goat.moral += 5;
    }
    if (map[goat.caseY - 1][goat.caseX - 1] == goat.style) { // Haut gauche
        goat.moral += 5;
    }
    if (map[goat.caseY - 1][goat.caseX] == goat.style) { // Haut
        goat.moral += 5;
    }
    if (map[goat.caseY - 1][goat.caseX + 1] == goat.style) { // Haut droite
        goat.moral += 5;
    }

    if (goat.moral > 200) {
        goat.kill();
        console.log("Elle a kiffé !");
    }

    // Déplacement vers la prochaine case chemin à proximitée
    // Selection du visuel en fonction du style et de son trajet
    // Vers la droite
    if (map[goat.caseY][goat.caseX + 1] == 1 && (goat.caseX + 1 !== goat.lastX)) {
        if (game.rnd.integerInRange(1, 2) == 1) {
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
            goat.caseX += 1;
        }

        // Vers le bas
    } else if (map[goat.caseY + 1][goat.caseX] == 1 && (goat.caseY + 1 !== goat.lastY)) {
        if (game.rnd.integerInRange(1, 2) == 1) {
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
            goat.caseY += 1;
        } else {
            return null;
        }

        // Vers la gauche
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
            goat.caseX -= 1;
        } else {
            return null;
        }

        // Vers le haut
    } else if (map[goat.caseY - 1][goat.caseX] == 1 && (map[goat.caseY - 1][goat.caseX] !== goat.lastY)) {
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
            goat.caseY -= 1;
        } else {
            return null;
        }

        // On bute la chevre à l'arrivée
    } else if (goat.caseX == 14 && goat.caseY == 9) {
        goat.kill();
    }
    // La chèvre est fatiguée
    goat.fatigue = 1;
    // Elle redevient active après un temps dépendant de son endurance
    setTimeout(function () {
        goat.fatigue = 0;
    }, (1 / goat.endurence) * 1000);

}

// Création des chèvres
function createGoat() {

    goat = goats.create(305, 90, 'goat-rightdown');
    goat.scale.setTo(0.1, 0.1);
    goat.caseX = 1;
    goat.caseY = 2;
    goat.lastX = 1;
    goat.lastY = 1;
    goat.fatigue = 0;
    goat.moral = 100;
    goat.endurence = game.rnd.integerInRange(1, 3); // Endu aléatoire
    goat.style = game.rnd.integerInRange(3, 5); // Style musical aléatoire
    tableGoat.push(goat); // Ajout au tableau de goats
    return goat;

}


// Pogo de chèvres
function anarchyGoat() {

    saveMap = map.slice(0);
    for (var j = 0; j < 12; j++) {
        for (var i = 0; i < 16; i++) {
            // Toutes les cases constructibles deviennent chemin
            if (map[j][i] == 0) {
                map[j][i] = 1;
            }
        }
    }

}

// Rangement par taille
function scaleSort(a, b) {
    if (a.scale.x < b.scale.x) {
        return -1;
    }
    else if (a.scale.x > b.scale.x) {
        return 1;
    }
    else {
        return 0;
    }
}

// Permet de nettoyer une enceinte hors d'usage
function recycle(caseX, caseY) {

    function cleanEnceinte(enceinte) {
        return enceinte.name === (caseX + "-" + caseY);
    }

    enceintes.find(cleanEnceinte);

}


// Affichages d'états pour le débugging
function render() {

}


// Mise à jour des données du jeu
function update() {

    // random vomi
    smoke.customSort(scaleSort, this);

    // On boucle le tableau de goats pour les faire se mouvoir
    for (var i = 0; i < tableGoat.length; i++) {
        actionGoat(tableGoat[i]);
    }

}
function goatScream() {
    var musicTab = ['scream1', 'scream2'];
    var i = Math.floor(Math.random() * (2 - 0)) + 0;
    music = game.add.audio(musicTab[i]);
    var randPlay = Math.floor(Math.random() * (3 - 0)) + 0;
    if (randPlay == 1) {
        music.play();
    }
}