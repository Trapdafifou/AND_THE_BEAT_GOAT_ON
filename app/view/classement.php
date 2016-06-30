<?= $nav ?>
<div class="content">
    <h1>Classement</h1>
    <ul>
        <?php
        $compteur = 1;
        foreach ($classement as $key => $value):?>
            <li>
                <ul class="list_classement">
                    <li class="classement_rank"><?= $compteur ?></li>
                    <li class="classement_pseudo"><?= $value->pseudo ?></li>
                    <li class="separator"><span></span></li>
                    <li class="classement_score"><?= $value->best_score ?> pts</li>
                </ul>
            </li>
            <?php
            $compteur++;
        endforeach;
        ?>
        <li>
            <ul class="list_classement line_separator">
                <li>0</li>
                <li>. . .</li>
                <li>0</li>
                <li>. . .</li>
            </ul>
        </li>
        <li>
            <?php
            if (count($userClassement) > 0) {
                ?>
                <ul class="list_classement">
                    <li class="classement_rank"><?= $userClassement['rank'] ?></li>
                    <li class="classement_pseudo"><?= $userClassement['pseudo'] ?></li>
                    <li class="separator"><span></span></li>
                    <li class="classement_score"><?= $userClassement['best_score'] ?> pts</li>
                </ul>
                <?php
            } else {
                ?>
                <strong>Connectez-vous</strong> ou <strong>inscrivez-vous</strong> pour connaitre votre position .
                <?php
            }
            ?>
        </li>
    </ul>
    <button><a href="/and_the_beat_goat_on?url=jeu">Je relève le défi</a></button>
</div>
<a class="rockenseine" href="#"><img src="./assets/img/desktop/logo_rockenseine.png" alt="Rock en seine"></a>
</div>
</body>
</html>