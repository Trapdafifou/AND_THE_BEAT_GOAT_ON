<?php
require_once 'init.php';
if (!isset($_SESSION)) {
    session_start();
}
$frontController = new Controller\FrontController($pdo);
$frontController->main();