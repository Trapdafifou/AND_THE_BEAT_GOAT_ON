// Prise en charge de l'audio de la page
window.PhaserGlobal = { disableWebAudio: true };

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
    game.load.image("background", "background.png");
    game.load.image('cadre', 'cadre.png');
    game.load.image('exit', 'exit.png');
    game.load.audio('bob', ['assets/audio/oedipus_wizball_highscore.mp3', 'assets/audio/oedipus_wizball_highscore.ogg']);
    game.load.audio('guetta', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
    game.load.audio('vide', ['assets/audio/goaman_intro.mp3', 'assets/audio/goaman_intro.ogg']);
    game.load.spritesheet('sprite', 'goat.png', 120, 130, 80);

}


var button;
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
var posY = 200;


function create() {

    // Ajout de la map
    var bkg = game.add.sprite(0,0,"background");

    // Création de la grille de cases
    for (var j = 0; j < 10; j++)
    {
        for (var i = 0; i < 14; i++)
        {
            // Décallage a chaque itération pour adapter a l'isometric
            button = game.add.button((-35*j) + (40 * i) + 388, (15 + 17.2*i) + (18 * j) + 183, 'tuile', openWindow, this, 2, 1, 0);
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
    var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth:500 };

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

    // Update de la musique si necessaire au click
    game.input.onDown.add(changeVolume, this);

    // Création des goats
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


    // Grille de debug 100x100
    game.add.sprite(0, 0, game.create.grid('grid', 100 * 9, 100 * 6, 100, 100, 'rgba(0, 250, 0, 1)'));
}

// Fonction d'ouverture du popup
function openWindow() {

    // Animation elastique d'ouverture
    if ((tween !== null && tween.isRunning) || popup.scale.x === 1)
    {
        return;
    }

    //  Agrandit la fenêtre si elle n'est pas déjà ouverte
    tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
    setTimeout(function() {
        musicText.alpha = 1;
        musicText2.alpha = 1;
    }, 400);
    popup.alpha = 1;

}

// Fermeture de la popup
function closeWindow() {

    if (tween && tween.isRunning || popup.scale.x === 0.1)
    {
        return;
    }

    //  Ferme la fenêtre si elle n'est pas déjà fermée
    tween = game.add.tween(popup.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);
    musicText.alpha = 0;
    musicText2.alpha = 0;
    setTimeout(function() {
        popup.alpha = 0;
    }, 500);
    selectedSong = "";
    changeVolume();
}


// Activation d'une case
function onDown (sprite) {

    text = "onDown: " + sprite.name;
    selectedX = sprite.caseX;
    selectedY = sprite.caseY;
    sprite.tint = 0x00ff00;

    if (selectedX % 3 == 0) {
        selectedSong = "guetta";
    } else {
        selectedSong = "bob";
    }
    if (selectedSong !== nowPlaying) {
        changeVolume();
    }


}

// Survol d'une case
function onOver (sprite) {

    text = "onOver: " + sprite.name;

    sprite.tint = 0xff0000;
    sprite.alpha = 1;

}

// Souris sortie de la case
function onOut (sprite) {

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

    // Déplacement des goats
    setTimeout(function(){
        goats.forEach(function () {
            goat.y += 0.1;
        });
        if(goat.y >= 600-130 ){
            goat.y += 0;
            goat.y = 0;
            goat.kill()
        }
    },2000);

}

// Affichages d'états pour le débugging
function render() {

    if (text === '')
    {
        game.debug.text("Interact with the Sprites.", 32, 32);
    }
    else
    {
        game.debug.text(text, 32, 32);
        game.debug.text(selectedX + " - " + selectedY + " - " + selectedSong, 32, 62);
    }

}

// Permet le drag and drop du sprite
function dragDrop(obj) {
    obj.inputEnabled = true;
    obj.input.enableDrag();
    obj.input.enableSnap(30,15,true,true);
    obj.input.enableSnap(45,30,true,true);
};

// Gestion de la musique jouée
function changeVolume(pointer) {

    if (selectedSong == "guetta")
    {
        bobSong.pause();
        videSong.pause();
        guettaSong.resume();
    }
    else if (selectedSong == "bob")
    {
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
