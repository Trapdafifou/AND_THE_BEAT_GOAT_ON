<?php
namespace Controller;

class FrontController
{
    private static $navSections = [
        ['view' => 'dotations', 'method' => '', 'content' => 'Dotations'],
        ['view' => 'classement', 'method' => '', 'content' => 'Classement'],
        ['view' => 'authentification', 'method' => '', 'content' => 'Inscription/Connexion']
    ];

    public function __construct(\PDO $PDO)
    {
        $this->user = new UserController($PDO);
        $url = $this->parseUrl();
        if (method_exists($this, 'display' . ucfirst($url[0]))) {
            $this->page = $url[0];
        } else {
            $this->page = 'accueil';
        }
        if (isset($url[1])) {
            if (method_exists($this, $url[1])) {
                $this->action = $url[1];
            }
        }
    }

    public function parseUrl()
    {
        if (isset($_GET['url'])) {
            $url[] = $_GET['url'];
        }else{
            $url[] = 'accueil';
        }
        if (isset($_GET['a'])) {
            $url[] = $_GET['a'];
        }else{
            $url[] = '';
        }
        return $url;
    }

    public function main()
    {
        if(isset($this->action)){
            call_user_func(array($this,$this->action));
        }
       call_user_func(array($this, 'display' . ucfirst($this->page)));
    }

    public function displayAccueil()
    {
        $nav = $this->generateHeader();
        include dirname(__DIR__) . '/view/accueil.php';
    }

    public function displayJeu()
    {
        $bestScore = $this->displayScore();
        $nav = $this->generateHeader();
        include dirname(__DIR__) . '/view/jeu.php';
    }

    public function displayClassement()
    {
        $userClassement = $this->getUserClassement();
        $classement = $this->user->classementBestUsers();
        $nav = $this->generateHeader();
        include dirname(__DIR__) . '/view/classement.php';
    }

    public function displayDotations()
    {
        $dotations = $this->getDotations();
        $nav = $this->generateHeader();
        include dirname(__DIR__) . '/view/dotations.php';
    }

    public function displayAuthentification()
    {
        $nav = $this->generateHeader();
        include dirname(__DIR__) . '/view/authentification.php';
    }

    public function displayInscription()
    {
        $nav = $this->generateHeader();
        include dirname(__DIR__) . '/view/inscription.php';
    }

    public function connexion()
    {
        // in case of empty data session
        if (count($_SESSION) == 0 && $this->page == 'authentification') {
            //call user connexionUser controller
            $data = $this->user->connexionUser();
            // if return number
            if (is_int($data)) {
                // data  = id
                $_SESSION['id'] = $data;
                header('Location:/and_the_beat_goat_on/?url=classement');
            } else {
                // else data = errors
                $errors = $data;
                // display errors
                var_dump($errors);
            }
        }
    }

    public function deconnexion()
    {
        // destroy session and redirect to home
        if (isset($_SESSION['id'])) {
            unset($_SESSION['id']);
            session_destroy();
        }
    }

    public function update()
    {
        $score = $_POST['update'];
        echo '1';
    }
    public function add(){
        if (count($_SESSION) == 0 && $this->page == 'inscription') {
            $data = $this->user->inscriptionUser();
            if (!$data) {
                header('Location:/and_the_beat_goat_on/?url=authentification');
            } else {
                // else data = errors
                $errors = $data;
                // display errors
                var_dump($errors);
            }
        }
    }
    private function displayScore()
    {
        $bestScore = '';
        if (isset($_SESSION) && count($_SESSION) > 0) {
            $id = $_SESSION['id'];
            $bestScore = '<p>Meilleur Score : ' . $this->user->displayBestScore($id) . '</p>';
        }
        return $bestScore;
    }

    private function giftCount($usersCount)
    {
        // calculate gift number due to users number
        $giftCount = round($usersCount / 13);
        if ($giftCount < 20) {
            $giftCount = 20;
        }
        return $giftCount;
    }

    private function getDotations()
    {
        $usersCount = $this->user->CountUsers();
        $giftCount = $this->giftCount($usersCount);
        // add 's' if users are more than 1
        $pluriel = ' participation.';
        if ($usersCount > 1) {
            $pluriel = ' participations.';
        }
        return 'Il y a actuellement <span>' . $giftCount . '</span> lots à gagner pour <span>' . $usersCount .'</span>'. $pluriel;
    }


    private function getUserClassement()
    {
        // if user is loaded display user score data
        $userClassement = [];
        if (isset($_SESSION) && count($_SESSION) > 0) {
            $userId = $_SESSION['id'];
            $userClassement = $this->user->showUser($userId);
        }
        return $userClassement;
    }

    private function generateHeader()
    {
        $view = $this->page;
        $navSections = self::$navSections;
        if (isset($_SESSION['id'])) {
            $userId = $_SESSION['id'];
            $pseudo = $this->user->showUser($userId)['pseudo'];
            array_splice($navSections, -1, 1,
                [
                    ['view' => 'accueil', 'method' => 'deconnexion', 'content' => $pseudo . ' <span>0</span>']
                ]);
        }
        // display header
        ob_start();
        include dirname(__DIR__) . "/view/header.php";
        $nav = ob_get_clean();
        return $nav;
    }
}