<?= $nav ?>
<div class="content">
    <h1>Inscription</h1>
    <form action="/and_the_beat_goat_on/?url=inscription&a=add" method="post">
        <div>
            <div class="left_form">
                <h2>Informations Pour<br>les dotations *</h2>
                <input type="text" name="firstname" placeholder="Prénom" value="<?= isEmpty('firstname') ?>">
                <input type="text" name="lastname" placeholder="Nom" value="<?= isEmpty('lastname') ?>">
                <input type="text" name="adress" placeholder="Adresse" value="<?= isEmpty('adress') ?>">
                <input type="text" name="postal_code" placeholder="Code postal" value="<?= isEmpty('postal_code') ?>">
                <input type="text" name="city" placeholder="Ville" value="<?= isEmpty('city') ?>">
                <small>* Ces Informations resteront exclusivement
                    confidentielle et ne seront utilisées que dans
                    le cadre de la réception des lots.</small>
            </div>
            <div class="right_form">
                <h2>Informations sur<br>votre compte</h2>
                <input type="text" name="pseudo" placeholder="Pseudo" value="<?= isEmpty('pseudo') ?>">
                <input type="password" name="password" placeholder="Mot de passe" value="<?= isEmpty('password') ?>">
                <input type="password" name="verify_password" placeholder="Vérification mot de passe"
                       value="<?= isEmpty('verify_password') ?>">
                <input type="email" name="mail" placeholder="Adresse mail" value="<?= isEmpty('mail') ?>">
                <div>
                    <input type="checkbox" value="1" name="reglement">
                    <label>J'accepte le <a>réglement du jeu</a></label>
                </div>
                <div>
                    <input type="checkbox" value="1" name="newsletter">
                    <label>J'aimerais recevoir les actualités de Rock en scène</a></label>
                </div>
            </div>
        </div>
        <button type="submit">S'inscrire</button>
    </form>
</div>
</div>
</body>
</html>