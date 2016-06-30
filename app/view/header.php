<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>And the beat goat on | Vanez découvrir le jeu délirant de Rock en Seine</title>
    <link href="./assets/css/reset.css" type="text/css" rel="stylesheet">
    <link href="./assets/css/style.css" type="text/css" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script   src="https://code.jquery.com/jquery-2.2.4.min.js"   integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="   crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css?family=Bowlby+One+SC|Archivo+Black|Rammetto+One|Catamaran:100,200,300,400,500,600,700,800,900|Titan+One" rel="stylesheet">
</head>
<body>
<div class="<?=$view?>">
<header>
    <a href="/and_the_beat_goat_on/"><img class="logo" src="./assets/img/desktop/logo.png"></a>
    <nav>
        <ul>
            <?php
            foreach ($navSections as $key => $value):
                $href = $value['view'];
                if($value['method'] != ''){
                    $href .= '&a='.$value['method'];
                }
                ?>
                <li<?= isActive($view, $value['view']) ?>><a href="/and_the_beat_goat_on/?url=<?=$href?>"><?= $value['content'] ?></a>
                </li>
                <?php
            endforeach;
            ?>
        </ul>
    </nav>
</header>