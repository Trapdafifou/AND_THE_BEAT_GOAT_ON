-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:3306
-- Généré le :  Jeu 30 Juin 2016 à 18:15
-- Version du serveur :  5.5.42
-- Version de PHP :  5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `goat`
--

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `pseudo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `best_score` int(10) unsigned NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adress` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` int(10) unsigned NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `pseudo`, `password`, `mail`, `best_score`, `firstname`, `lastname`, `adress`, `postal_code`, `city`) VALUES
(1, 'Alice', '1Nicomede', 'alicesevin@hetic.net', 0, 'Alice', 'Sevin', '12', 75000, 'Paris'),
(8, 'thibthib', '1122', 'thibthib@thib.com', 0, 'Marsal', 'Thibault', 'la rue du thib thib', 75000, 'Paris'),
(9, 'aaa', 'aaa', '111@11.com', 0, 'aaa', 'aaa', 'aaa', 11111, 'aaa'),
(10, 'aaa', 'aaa', '11aaa1@11.com', 0, 'aaa', 'aaaaaa', 'aaa', 11111, 'aaa'),
(11, 'Jilou', '1', 'jilou@ji.fr', 0, 'Alice', 'Sevin', 'dhizagdai', 11111, 'vhduagyuau');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
