<?= $nav ?>
<div class="content">
    <h1>Connexion</h1>
    <form action="/and_the_beat_goat_on/?url=authentification&a=connexion" method="post">
        <input type="text" name="pseudo" placeholder="Pseudo" value="<?= isEmpty('pseudo') ?>">
        <input type="password" name="password" placeholder="Mot de passe" value="<?= isEmpty('password') ?>">
        <button class="connexion" type="submit">Se connecter</button>
    </form>
    <span>ou</span>
    <button><a href="/and_the_beat_goat_on/?url=inscription">S'inscrire</a></button>
    </body>
</div>
<a class="rockenseine" href="#"><img src="./assets/img/desktop/logo_rockenseine.png" alt="Rock en seine"></a>
</div>
</html>