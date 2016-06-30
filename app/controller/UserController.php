<?php
namespace Controller;

use Model\UserRepository;

class UserController
{
    public function __construct(\PDO $PDO)
    {
        $this->repository = new UserRepository($PDO);
    }

    public function showUser($id)
    {
        $id = $id*1 ;
        $user['rank'] = ($this->repository->getUserRank($id)) + 1;
        $user['pseudo'] = $this->repository->getUserById($id)->pseudo;
        $user['best_score'] = $this->repository->getUserById($id)->best_score;
        return $user;
    }

    public function CountUsers(){
        return $this->repository->getCountUsers()->count;
    }
    public function classementBestUsers()
    {
        return $this->repository->getBestUsers();
    }

    public function displayBestScore($id)
    {
        return $this->repository->getUserById($id)->best_score;
    }

    public function connexionUser()
    {
        $pseudo = $_POST['pseudo'];
        $pwd = $_POST['password'];
        $errorsConnexion = [];
        $errorsConnexion = $this->verifyEmptyField($_POST, $errorsConnexion);
        if (count($errorsConnexion) == 0) {
            // Check password and pseudo into database
            $user = $this->repository->getUserByPseudo($pseudo, $pwd);
            if ($user) {
                //Launch connexion
                return intval($user->id);
            } else {
                // return bad password
                return 'Votre mot de passe ou pseudo est incorrecte';
            }
        } else {
            // return empty fields
            return $errorsConnexion;
        }
    }

    public function inscriptionUser()
    {
        $errorsInscription = [];
        // Add error empty field
        $errorsInscription = $this->checkForm($_POST);
        if (!isset($_POST['reglement'])) {
            // Add error reglement not checked
            $errorsInscription['reglement'] = "Vous devez accepter le réglement du jeu !";
        }
        if (count($errorsInscription) == 0) {
            // Add user to database
            $this->repository->addUser($_POST);
        } else {
            // return errors
            return $errorsInscription;
        }
        return false;
    }

    private function verifyEmptyField($inputs, $errors)
    {
        $empty = [];
        // Verify empty fields
        foreach ($inputs as $key => $value) {
            if ($value == '') {
                $empty[$key] = 1;
            }
        }
        if (count($empty) > 0) {
            $errors['empty'] = $empty;
        }
        return $errors;
    }

    private function checkForm($saisies)
    {
        $errors = [];
        $errors = $this->verifyEmptyField($saisies, $errors);
        // Verify password
        if (!isset($errors['empty']['password']) && !isset($errors['empty']['verify_password'])) {
            if (strlen($saisies['password']) < 8 && !preg_match("#[0-9]+#",
                    $saisies['password']) && !preg_match("#[a-zA-Z]+#", $saisies['password'])
            ) {
                $errors['password'] = "Votre mot de passe n'est pas valide.";
            } else {
                if ($saisies['password'] != $saisies['verify_password']) {
                    $errors['verify'] = "Votre mot de passe et sa vérification ne correspondent pas.";
                }
            }
        }
        // Verify Email
        if (!isset($errors['empty']['mail'])) {
            if (!(filter_var($saisies['mail'], FILTER_VALIDATE_EMAIL))) {
                $errors['mail'] = "Votre email n'est pas valide";
            } else {
                //Verify if email isn't already set into database
                $verifyMail = $this->repository->getMail($saisies['mail']);
                if ($verifyMail->count>0) {
                    $errors['mail'] = "Cette adresse mail est déjà utilisée";
                }
            }
        }
        // Verify postal code
        if (!isset($errors['empty']['postal_code'])) {
            if (preg_match ("/[^0-9]/", $saisies['postal_code']) || !(strlen($saisies['postal_code']) == 5)) {
                $errors['postal_code'] = "Votre code postal n'est pas valide";
            }
        }
        return $errors;
    }
}