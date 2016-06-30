<?php
require_once __DIR__ . "/vendor/autoload.php";
try {
    $pdo = new \PDO("mysql:host=localhost;dbname=goat", "root", "rooot");
    $pdo->query("SET NAMES 'UTF8';");
} catch (PDOException $e) {
    die($e->getMessage());
}
function isActive($value1, $value2)
{
    if ($value1 == $value2) {
        return ' class="active" ';
    }
    return '';
}
function isEmpty($value)
{
    if ((isset($_POST[$value])) && ($_POST[$value] != '')) {
        return $_POST[$value];
    }
    return '';
}