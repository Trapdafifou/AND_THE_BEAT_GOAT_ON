<?php
namespace Model;

class UserRepository
{

    private $PDO;

    public function __construct(\PDO $PDO)
    {
        $this->PDO = $PDO;
    }

    public function addUser(array $data)
    {
        $sql = "INSERT INTO
                    `user`
                    (`firstname`,
                    `lastname`,
                    `pseudo`,
                    `password`,
                    `adress`,
                    `city`,
                    `mail`,
                    `postal_code`)
                VALUES
                    (:firstname,
                    :lastname,
                    :pseudo,
                    :password,
                    :adress,
                    :city,
                    :mail,
                    :postal_code)
                ";
        $stmt = $this->PDO->prepare($sql);
        $stmt->bindParam(':firstname', $data['firstname'], \PDO::PARAM_STR);
        $stmt->bindParam(':lastname', $data['lastname'], \PDO::PARAM_STR);
        $stmt->bindParam(':pseudo', $data['pseudo'], \PDO::PARAM_STR);
        $stmt->bindParam(':password', $data['password'], \PDO::PARAM_STR);
        $stmt->bindParam(':adress', $data['adress'], \PDO::PARAM_STR);
        $stmt->bindParam(':city', $data['city'], \PDO::PARAM_STR);
        $stmt->bindParam(':mail', $data['mail'], \PDO::PARAM_STR);
        $stmt->bindParam(':postal_code', $data['postal_code'], \PDO::PARAM_INT);
        $stmt->execute();
    }

    public function getUserRank($id)
    {
        $sql = "SELECT
                  count(*)
                FROM
                  `user`
                WHERE
                  `best_score` > (select `best_score` FROM `user` WHERE `id` :id )
                  ";
        $stmt = $this->PDO->prepare($sql);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchObject();
    }

    public function getCountUsers()
    {
        $sql = "SELECT
                  count(*) as count
                FROM
                  `user`
                  ";
        $stmt = $this->PDO->prepare($sql);
        $stmt->execute();
        return $stmt->fetchObject();
    }

    public function getBestUsers()
    {
        $sql = "SELECT
                    `best_score`,
                    `pseudo`
                  FROM
                    `user`
                  order by `best_score` desc
                  LIMIT 5";
        $stmt = $this->PDO->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_OBJ);
    }
    public function getUserById($id)
    {
        $sql = "SELECT
                  `best_score`,
                  `pseudo`
                FROM
                    `user`
                WHERE
                    `id` = :id
                ";
        $stmt = $this->PDO->prepare($sql);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchObject();
    }
    public function getUserByPseudo($pseudo, $password)
    {
        $sql = "SELECT
                  `id`
                FROM
                    `user`
                WHERE
                    `pseudo` = :pseudo AND `password` = :password
                ";
        $stmt = $this->PDO->prepare($sql);
        $stmt->bindParam(':pseudo', $pseudo, \PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, \PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchObject();
    }

    public function getMail($mail)
    {
        $sql = "SELECT
                  count(*) as count
                FROM
                    `user`
                WHERE
                    `mail` = :mail
                ";
        $stmt = $this->PDO->prepare($sql);
        $stmt->bindParam(':mail', $mail, \PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchObject();
    }
}