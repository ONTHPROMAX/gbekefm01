-- ==========================================================================
--  GBÊKÊ FM — Base de données MySQL / MariaDB
--  Script généré automatiquement — importable dans phpMyAdmin (XAMPP)
--  Modèle : 17 tables (cahier des charges GBÊKÊ FM v1.0)
--  Encodage : UTF-8 (utf8mb4)
-- ==========================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- --------------------------------------------------------------------------
--  Création de la base de données
-- --------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `gbekefm`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE `gbekefm`;

-- Suppression des tables si elles existent (ré-import propre)
DROP TABLE IF EXISTS `ROLE_PERMISSION`;
DROP TABLE IF EXISTS `FAVORI`;
DROP TABLE IF EXISTS `HISTORIQUE_ECOUTE`;
DROP TABLE IF EXISTS `TELECHARGEMENT`;
DROP TABLE IF EXISTS `ECOUTE`;
DROP TABLE IF EXISTS `VISITE`;
DROP TABLE IF EXISTS `STATISTIQUE_LIVE`;
DROP TABLE IF EXISTS `ABONNEMENT_NEWSLETTER`;
DROP TABLE IF EXISTS `PODCAST`;
DROP TABLE IF EXISTS `ARTICLE`;
DROP TABLE IF EXISTS `EMISSION`;
DROP TABLE IF EXISTS `CATEGORIE`;
DROP TABLE IF EXISTS `MESSAGE`;
DROP TABLE IF EXISTS `UTILISATEUR`;
DROP TABLE IF EXISTS `PERMISSION`;
DROP TABLE IF EXISTS `ROLE`;
DROP TABLE IF EXISTS `RADIO`;

-- --------------------------------------------------------------------------
--  Table : ROLE
-- --------------------------------------------------------------------------
CREATE TABLE `ROLE` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`         VARCHAR(50)  NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : PERMISSION
-- --------------------------------------------------------------------------
CREATE TABLE `PERMISSION` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code`        VARCHAR(60)  NOT NULL,
  `nom`         VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : ROLE_PERMISSION (liaison ROLE <-> PERMISSION)
-- --------------------------------------------------------------------------
CREATE TABLE `ROLE_PERMISSION` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`       INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  KEY `idx_rp_permission` (`permission_id`),
  CONSTRAINT `fk_rp_role`       FOREIGN KEY (`role_id`)       REFERENCES `ROLE` (`id`)       ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `PERMISSION` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : UTILISATEUR
-- --------------------------------------------------------------------------
CREATE TABLE `UTILISATEUR` (
  `id`                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`                VARCHAR(80)  NOT NULL,
  `prenom`             VARCHAR(80)  NOT NULL,
  `email`              VARCHAR(150) NOT NULL,
  `password`           VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt uniquement',
  `role_id`            INT UNSIGNED NOT NULL,
  `telephone`          VARCHAR(30)  DEFAULT NULL,
  `statut`             ENUM('actif','inactif','bloque') NOT NULL DEFAULT 'actif',
  `is_demo`            TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'Compte de démonstration (supprimable)',
  `derniere_connexion` DATETIME     DEFAULT NULL,
  `created_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_utilisateur_email` (`email`),
  KEY `idx_utilisateur_role` (`role_id`),
  CONSTRAINT `fk_utilisateur_role` FOREIGN KEY (`role_id`) REFERENCES `ROLE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : RADIO (configuration du flux en direct)
-- --------------------------------------------------------------------------
CREATE TABLE `RADIO` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`         VARCHAR(100) NOT NULL,
  `slogan`      VARCHAR(150) DEFAULT NULL,
  `frequence`   VARCHAR(30)  DEFAULT NULL,
  `ville`       VARCHAR(100) DEFAULT NULL,
  `description` TEXT         DEFAULT NULL,
  `logo`        VARCHAR(255) DEFAULT NULL,
  `stream_url`  VARCHAR(255) NOT NULL COMMENT 'URL du flux audio en direct',
  `live_page`   VARCHAR(255) DEFAULT NULL COMMENT 'Page publique du direct',
  `statut`      ENUM('en_direct','hors_ligne') NOT NULL DEFAULT 'hors_ligne',
  `auditeurs`   INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : CATEGORIE
-- --------------------------------------------------------------------------
CREATE TABLE `CATEGORIE` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`         VARCHAR(80)  NOT NULL,
  `slug`        VARCHAR(80)  NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `icone`       VARCHAR(50)  DEFAULT NULL,
  `statut`      ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categorie_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : EMISSION
-- --------------------------------------------------------------------------
CREATE TABLE `EMISSION` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`          VARCHAR(150) NOT NULL,
  `slug`         VARCHAR(150) NOT NULL,
  `categorie_id` INT UNSIGNED NOT NULL,
  `animateur`    VARCHAR(150) DEFAULT NULL,
  `diffusion`    VARCHAR(100) DEFAULT NULL COMMENT 'Ex : Mardi 12h00',
  `image`        VARCHAR(255) DEFAULT NULL,
  `description`  TEXT         DEFAULT NULL,
  `statut`       ENUM('publie','brouillon','archive') NOT NULL DEFAULT 'brouillon',
  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_emission_slug` (`slug`),
  KEY `idx_emission_categorie` (`categorie_id`),
  CONSTRAINT `fk_emission_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `CATEGORIE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : PODCAST
-- --------------------------------------------------------------------------
CREATE TABLE `PODCAST` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre`            VARCHAR(200) NOT NULL,
  `emission_id`      INT UNSIGNED NOT NULL,
  `categorie_id`     INT UNSIGNED NOT NULL,
  `createur`         VARCHAR(150) DEFAULT NULL,
  `duree`            VARCHAR(10)  DEFAULT NULL COMMENT 'Format mm:ss',
  `duree_sec`        INT UNSIGNED DEFAULT NULL COMMENT 'Durée en secondes',
  `date_publication` DATE         DEFAULT NULL,
  `image`            VARCHAR(255) DEFAULT NULL,
  `audio`            VARCHAR(255) DEFAULT NULL COMMENT 'Chemin ou URL du fichier audio',
  `description`      TEXT         DEFAULT NULL,
  `statut`           ENUM('publie','brouillon','archive') NOT NULL DEFAULT 'brouillon',
  `ecoute`           INT UNSIGNED NOT NULL DEFAULT 0,
  `telechargements`  INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_podcast_emission` (`emission_id`),
  KEY `idx_podcast_categorie` (`categorie_id`),
  KEY `idx_podcast_date` (`date_publication`),
  CONSTRAINT `fk_podcast_emission`  FOREIGN KEY (`emission_id`)  REFERENCES `EMISSION` (`id`)  ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_podcast_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `CATEGORIE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : ARTICLE
-- --------------------------------------------------------------------------
CREATE TABLE `ARTICLE` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre`            VARCHAR(200) NOT NULL,
  `resume`           VARCHAR(500) DEFAULT NULL,
  `contenu`          LONGTEXT     DEFAULT NULL,
  `image`            VARCHAR(255) DEFAULT NULL,
  `categorie_id`     INT UNSIGNED NOT NULL,
  `auteur`           VARCHAR(150) DEFAULT NULL,
  `date_publication` DATE         DEFAULT NULL,
  `statut`           ENUM('publie','brouillon','archive') NOT NULL DEFAULT 'brouillon',
  `vues`             INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_article_categorie` (`categorie_id`),
  KEY `idx_article_date` (`date_publication`),
  CONSTRAINT `fk_article_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `CATEGORIE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : VISITE (statistiques de fréquentation)
-- --------------------------------------------------------------------------
CREATE TABLE `VISITE` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page`        VARCHAR(255) NOT NULL,
  `ip_hash`     VARCHAR(64)  DEFAULT NULL COMMENT 'IP anonymisée (hash)',
  `user_id`     INT UNSIGNED DEFAULT NULL,
  `user_agent`  VARCHAR(255) DEFAULT NULL,
  `referer`     VARCHAR(255) DEFAULT NULL,
  `date_visite` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_visite_user` (`user_id`),
  KEY `idx_visite_date` (`date_visite`),
  CONSTRAINT `fk_visite_user` FOREIGN KEY (`user_id`) REFERENCES `UTILISATEUR` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : ECOUTE (écoutes de podcasts)
-- --------------------------------------------------------------------------
CREATE TABLE `ECOUTE` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `podcast_id`    INT UNSIGNED NOT NULL,
  `user_id`       INT UNSIGNED DEFAULT NULL COMMENT 'NULL = visiteur anonyme',
  `ip_hash`       VARCHAR(64)  DEFAULT NULL,
  `position`      INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Position de lecture (s)',
  `duree_ecoutee` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Durée écoutée (s)',
  `source`        ENUM('web','mobile','embed') NOT NULL DEFAULT 'web',
  `date_ecoute`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ecoute_podcast` (`podcast_id`),
  KEY `idx_ecoute_user` (`user_id`),
  KEY `idx_ecoute_date` (`date_ecoute`),
  CONSTRAINT `fk_ecoute_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ecoute_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : TELECHARGEMENT
-- --------------------------------------------------------------------------
CREATE TABLE `TELECHARGEMENT` (
  `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `podcast_id`            INT UNSIGNED NOT NULL,
  `user_id`               INT UNSIGNED DEFAULT NULL COMMENT 'NULL = visiteur anonyme',
  `ip_hash`               VARCHAR(64)  DEFAULT NULL,
  `date_telechargement`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tel_podcast` (`podcast_id`),
  KEY `idx_tel_user` (`user_id`),
  KEY `idx_tel_date` (`date_telechargement`),
  CONSTRAINT `fk_tel_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tel_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : FAVORI
-- --------------------------------------------------------------------------
CREATE TABLE `FAVORI` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `podcast_id` INT UNSIGNED NOT NULL,
  `date_ajout` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_favori_user_podcast` (`user_id`, `podcast_id`),
  KEY `idx_favori_podcast` (`podcast_id`),
  CONSTRAINT `fk_favori_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favori_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`)     ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : HISTORIQUE_ECOUTE
-- --------------------------------------------------------------------------
CREATE TABLE `HISTORIQUE_ECOUTE` (
  `id`                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`              INT UNSIGNED NOT NULL,
  `podcast_id`           INT UNSIGNED NOT NULL,
  `position`             INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Position de reprise (s)',
  `date_derniere_ecoute` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_hist_user_podcast` (`user_id`, `podcast_id`),
  KEY `idx_hist_podcast` (`podcast_id`),
  CONSTRAINT `fk_hist_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_hist_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`)     ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : MESSAGE
-- --------------------------------------------------------------------------
CREATE TABLE `MESSAGE` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom`          VARCHAR(120) NOT NULL,
  `email`        VARCHAR(150) NOT NULL,
  `sujet`        VARCHAR(150) DEFAULT NULL,
  `message`      TEXT         NOT NULL,
  `statut`       ENUM('non_lu','lu','traite','archive') NOT NULL DEFAULT 'non_lu',
  `date_message` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_message_statut` (`statut`),
  KEY `idx_message_date` (`date_message`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : STATISTIQUE_LIVE (audience du direct)
-- --------------------------------------------------------------------------
CREATE TABLE `STATISTIQUE_LIVE` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `radio_id`    INT UNSIGNED NOT NULL,
  `auditeurs`   INT UNSIGNED NOT NULL DEFAULT 0,
  `date_mesure` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_live_radio` (`radio_id`),
  KEY `idx_live_date` (`date_mesure`),
  CONSTRAINT `fk_live_radio` FOREIGN KEY (`radio_id`) REFERENCES `RADIO` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
--  Table : ABONNEMENT_NEWSLETTER
-- --------------------------------------------------------------------------
CREATE TABLE `ABONNEMENT_NEWSLETTER` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`            VARCHAR(150) NOT NULL,
  `statut`           ENUM('actif','desabonne') NOT NULL DEFAULT 'actif',
  `date_inscription` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================================
--  DONNÉES INITIALES / DE DÉMONSTRATION
-- ==========================================================================

-- Rôles
INSERT INTO `ROLE` (`id`, `nom`, `description`) VALUES
(1, 'Administrateur', 'Accès complet à toutes les fonctionnalités.'),
(2, 'Éditeur', 'Gestion des contenus éditoriaux.'),
(3, 'Animateur', 'Gestion de ses propres émissions et podcasts.'),
(4, 'Utilisateur', 'Compte public avec favoris et historique.');

-- Permissions
INSERT INTO `PERMISSION` (`id`, `code`, `nom`, `description`) VALUES
(1, 'gerer_utilisateurs', 'Gérer les utilisateurs', 'Permission : Gérer les utilisateurs'),
(2, 'gerer_roles', 'Gérer les rôles', 'Permission : Gérer les rôles'),
(3, 'gerer_emissions', 'Gérer les émissions', 'Permission : Gérer les émissions'),
(4, 'gerer_podcasts', 'Gérer les podcasts', 'Permission : Gérer les podcasts'),
(5, 'gerer_articles', 'Gérer les articles', 'Permission : Gérer les articles'),
(6, 'gerer_categories', 'Gérer les catégories', 'Permission : Gérer les catégories'),
(7, 'gerer_messages', 'Gérer les messages', 'Permission : Gérer les messages'),
(8, 'gerer_radio', 'Gérer la radio', 'Permission : Gérer la radio'),
(9, 'voir_statistiques', 'Voir les statistiques', 'Permission : Voir les statistiques');

-- Permissions par rôle
INSERT INTO `ROLE_PERMISSION` (`id`, `role_id`, `permission_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 2, 3),
(11, 2, 4),
(12, 2, 5),
(13, 2, 6),
(14, 2, 7),
(15, 2, 9),
(16, 3, 3),
(17, 3, 4),
(18, 3, 9);

-- Utilisateurs (mots de passe hachés en bcrypt)
INSERT INTO `UTILISATEUR` (`id`, `nom`, `prenom`, `email`, `password`, `role_id`, `statut`, `is_demo`, `created_at`) VALUES
(1, 'Koné', 'Amadou', 'amadou.kone@gbekefm.com', '$2y$10$y0gA5tCdddtXpCwAz4zvEeCWCFWxh1ZtPBPqwS5CqK9P1PRw9YsBy', 1, 'actif', 0, '2024-01-10 08:00:00'),
(2, 'Bamba', 'Awa', 'awa.bamba@gbekefm.com', '$2y$10$XV6W9UPWMY.cPrKNLpM09.ZMFPReFeG2iW8aPFoDGzK74Etn0YpKa', 1, 'actif', 0, '2024-03-22 08:00:00'),
(3, 'Traoré', 'Ibrahim', 'ibrahim.traore@gbekefm.com', '$2y$10$tzqfG877OV8c/YpwDIOhDuDtKO35iKw9zTLSU165zjOwJtmnHUA2a', 1, 'actif', 0, '2024-05-04 08:00:00'),
(4, 'Sanogo', 'Alima', 'alima.sanogo@gbekefm.com', '$2y$10$.An5kxPxPLhUxvhVhYzFUODqP2DYqLOB/i2aFCbBd8ypTR/LEXXv6', 3, 'actif', 0, '2024-06-18 08:00:00'),
(5, 'Dosso', 'Yacouba', 'y.dosso@email.ci', '$2y$10$JkOJkwteRcHOs5877dRWtuW/XcNWM1VfB07DTTsoCmZZO3okqexaS', 4, 'inactif', 0, '2025-02-11 08:00:00'),
(6, 'Coulibaly', 'Mariam', 'm.coulibaly@email.ci', '$2y$10$5hbuAXUiOl26cR3x7z3Z2Oo47rAWjQjTFLPWHEVaYlEmSrW55m7Za', 4, 'bloque', 0, '2025-07-30 08:00:00'),
(7, 'Admin', 'Démo', 'demo.admin@gbekefm.com', '$2y$10$JAF3eS9K0iYqcm3buOqY1ONCuubL4fWIzah2BXyeGgghRXyW.bwOe', 1, 'actif', 1, '2025-10-01 08:00:00'),
(8, 'Auditeur', 'Démo', 'demo.auditeur@email.ci', '$2y$10$8eW.tdS5eeSTl1xIX4AXpO43FmJPtDssZ9JBBk7.KAzd..n1ruO8S', 4, 'actif', 1, '2025-10-01 08:00:00');

-- Configuration de la radio
INSERT INTO `RADIO` (`id`, `nom`, `slogan`, `frequence`, `ville`, `description`, `logo`, `stream_url`, `live_page`, `statut`, `auditeurs`) VALUES
(1, 'GBÊKÊ FM', 'Jusqu''au bout du monde !', '105.2 MHz', 'Bouaké, Côte d''Ivoire', 'GBÊKÊ FM, premier média de Côte d''Ivoire certifié JTI à la norme CWA 17493. Votre radio de proximité : information, culture, musique et divertissement.', 'assets/brand/gbeke-logo.png', 'https://stream.zeno.fm/m0982tsy908uv', 'https://zeno.fm/radio/gbeke-fm/', 'en_direct', 1284);

-- Catégories
INSERT INTO `CATEGORIE` (`id`, `nom`, `slug`, `description`, `icone`, `statut`) VALUES
(1, 'Culture', 'culture', 'Arts, société et grands débats contemporains.', 'book', 'active'),
(2, 'Musique', 'musique', 'Artistes, sons et industrie musicale.', 'music', 'active'),
(3, 'Santé', 'sante', 'Bien-être, prévention et conseils santé.', 'heart', 'active'),
(4, 'Éducation', 'education', 'École, jeunesse et apprentissage.', 'cap', 'active'),
(5, 'Société', 'societe', 'Vie quotidienne, matinales et actualité locale.', 'users', 'active'),
(6, 'Sport', 'sport', 'Football, athlétisme et grands rendez-vous sportifs.', 'ball', 'active');

-- Émissions
INSERT INTO `EMISSION` (`id`, `nom`, `slug`, `categorie_id`, `animateur`, `diffusion`, `image`, `description`, `statut`) VALUES
(1, 'Les Ateliers de la Culture', 'ateliers-de-la-culture', 1, 'Eba Doris', 'Mardi 12h00', 'assets/img/emission-culture.jpg', 'Une émission de réflexion portée sur les grands sujets du monde contemporain, dédiée aux intellectuels et universitaires.', 'publie'),
(2, 'Gossip Star', 'gossip-star', 2, 'Ange A. Koffi & Sanogo Alima', 'Jeudi & Samedi 10h00', 'assets/img/emission-music.jpg', 'Émission musicale dédiée à la promotion des artistes et aux acteurs de l''industrie musicale d''ici et d''ailleurs.', 'publie'),
(3, 'Mag'' Santé', 'mag-sante', 3, 'Barthelemy Koné', 'Vendredi 15h00', 'assets/img/emission-sante.jpg', 'Magazine de santé hebdomadaire qui sensibilise, informe et partage des astuces de santé avec la population pour son bien-être.', 'publie'),
(4, 'Virée Scolaire', 'viree-scolaire', 4, 'Namizata', 'Jeudi 13h00', 'assets/img/emission-scolaire.jpg', 'Émission dédiée aux élèves afin de les familiariser au monde de la radio, avec des jeux scolaires et du divertissement.', 'publie'),
(5, 'Les Matins chez nous', 'matins-chez-nous', 5, 'Prospersensus & KS Caméléon', 'Lundi au Vendredi 07h00', 'assets/img/emission-matin.jpg', 'La matinale de la radio : le matin du bonheur et de la bonne humeur, entre sujets sérieux et divertissants.', 'publie'),
(6, 'Parlons Sport', 'parlons-sport', 6, 'Ibrahim Traoré', 'Samedi 18h00', 'assets/img/emission-sport.jpg', 'Le rendez-vous sportif de GBÊKÊ FM : résultats, analyses et portraits des acteurs du sport ivoirien.', 'publie');

-- Podcasts
INSERT INTO `PODCAST` (`id`, `titre`, `emission_id`, `categorie_id`, `createur`, `duree`, `duree_sec`, `date_publication`, `image`, `audio`, `description`, `statut`, `ecoute`, `telechargements`) VALUES
(1, 'La jeunesse africaine face au défi de l''IA', 1, 1, 'Eba Doris', '42:18', 2538, '2025-09-30', 'assets/img/emission-culture.jpg', 'assets/audio/podcast-1.mp3', 'Nous recevons trois universitaires pour débattre de l''impact de l''intelligence artificielle sur l''emploi et la formation des jeunes en Afrique de l''Ouest.', 'publie', 1842, 412),
(2, 'Décoloniser les savoirs : quels manuels pour demain ?', 1, 1, 'Eba Doris', '38:05', 2285, '2025-09-23', 'assets/img/emission-culture.jpg', 'assets/audio/podcast-1.mp3', 'Comment repenser les programmes scolaires à la lumière des savoirs endogènes africains.', 'publie', 1210, 287),
(3, 'Gossip Star : le nouvel album de Koffi Gbêkê', 2, 2, 'Ange A. Koffi', '51:40', 3100, '2025-10-02', 'assets/img/emission-music.jpg', 'assets/audio/podcast-2.mp3', 'Rencontre exclusive avec l''artiste et écoute en avant-première de son nouvel opus.', 'publie', 3560, 980),
(4, 'L''industrie du disque en Côte d''Ivoire', 2, 2, 'Sanogo Alima', '44:12', 2652, '2025-09-26', 'assets/img/emission-music.jpg', 'assets/audio/podcast-2.mp3', 'Producteurs et managers décryptent les défis de la distribution musicale locale.', 'publie', 2210, 640),
(5, 'Paludisme : prévenir plutôt que guérir', 3, 3, 'Barthelemy Koné', '33:27', 2007, '2025-10-03', 'assets/img/emission-sante.jpg', 'assets/audio/podcast-3.mp3', 'Un médecin épidémiologiste répond aux questions les plus fréquentes sur la prévention du paludisme.', 'publie', 2980, 1120),
(6, 'Nutrition et rentrée scolaire', 3, 3, 'Barthelemy Koné', '29:51', 1791, '2025-09-19', 'assets/img/emission-sante.jpg', 'assets/audio/podcast-3.mp3', 'Comment composer des repas équilibrés pour les enfants à l''école.', 'publie', 1450, 470),
(7, 'Virée Scolaire : concours d''éloquence au lycée', 4, 4, 'Namizata', '36:44', 2204, '2025-10-01', 'assets/img/emission-scolaire.jpg', 'assets/audio/podcast-1.mp3', 'Retour sur le concours d''éloquence qui a réuni dix établissements de Bouaké.', 'publie', 980, 210),
(8, 'Les métiers de la radio expliqués aux élèves', 4, 4, 'Namizata', '31:09', 1869, '2025-09-24', 'assets/img/emission-scolaire.jpg', 'assets/audio/podcast-1.mp3', 'Technicien, journaliste, animateur : les coulisses du métier racontées aux jeunes.', 'publie', 760, 155),
(9, 'La matinale du 6 octobre', 5, 5, 'Prospersensus', '58:30', 3510, '2025-10-06', 'assets/img/emission-matin.jpg', 'assets/audio/podcast-1.mp3', 'Revue de presse, invités du jour et bonne humeur au programme de ce lundi.', 'publie', 4120, 720),
(10, 'Transports urbains à Bouaké : l''état des lieux', 5, 5, 'KS Caméléon', '47:22', 2842, '2025-10-02', 'assets/img/emission-matin.jpg', 'assets/audio/podcast-1.mp3', 'Débat avec les autorités et les usagers sur la mobilité en ville.', 'publie', 2360, 480),
(11, 'Parlons Sport : les Éléphants préparent la CAN', 6, 6, 'Ibrahim Traoré', '45:15', 2715, '2025-10-04', 'assets/img/emission-sport.jpg', 'assets/audio/podcast-2.mp3', 'Analyse de la préparation de la sélection nationale et des chances de qualification.', 'publie', 5240, 1310),
(12, 'Le sport féminin en plein essor', 6, 6, 'Ibrahim Traoré', '40:02', 2402, '2025-09-27', 'assets/img/emission-sport.jpg', 'assets/audio/podcast-2.mp3', 'Portrait de sportives ivoiriennes et des défis de la pratique au féminin.', 'publie', 1680, 390),
(13, 'À la une : édition spéciale rentrée culturelle', 1, 1, 'Eba Doris', '26:33', 1593, '2025-09-16', 'assets/img/emission-culture.jpg', 'assets/audio/podcast-1.mp3', 'Tour d''horizon des rendez-vous culturels de la saison à Bouaké et Abidjan.', 'brouillon', 0, 0);

-- Articles
INSERT INTO `ARTICLE` (`id`, `titre`, `resume`, `contenu`, `image`, `categorie_id`, `auteur`, `date_publication`, `statut`, `vues`) VALUES
(1, 'GBÊKÊ FM, premier média ivoirien certifié JTI à la norme CWA 17493', 'La radio de Bouaké franchit une étape historique en obtenant la certification internationale JTI.', '<p>GBÊKÊ FM devient le premier média de Côte d''Ivoire à être certifié selon le programme JTI et la norme CWA 17493, accrédité par le SOAC selon ISO/IEC 17065:2012. Une reconnaissance qui consacre des années d''engagement pour une information de qualité.</p><p>Cette certification atteste de la fiabilité des processus éditoriaux, de la transparence et du respect des standards internationaux en matière de journalisme.</p><blockquote>« C''est une fierté pour toute l''équipe et pour la région du Gbêkê. Nous continuerons à informer avec rigueur et proximité », a déclaré la direction.</blockquote>', 'assets/img/article-1.jpg', 5, 'Rédaction GBÊKÊ FM', '2025-10-05', 'publie', 3420),
(2, 'Gestion des plaintes et réclamations : la radio se dote d''un dispositif', 'GBÊKÊ FM met en place un mécanisme transparent de traitement des plaintes de son audience.', '<p>Soucieuse de la qualité de la relation avec son public, GBÊKÊ FM annonce la mise en place d''un dispositif de gestion des plaintes et réclamations, accessible à tous les auditeurs.</p><p>Le mécanisme prévoit l''enregistrement de chaque requête, un accusé de réception et un délai de traitement défini. Un rapport trimestriel sera publié pour garantir la transparence.</p>', 'assets/img/article-2.jpg', 5, 'Service Client', '2025-09-28', 'publie', 1870),
(3, 'Votre radio filmée est là : découvrez nos émissions en vidéo', 'Les émissions phares de GBÊKÊ FM sont désormais disponibles en version filmée.', '<p>GBÊKÊ FM passe à la vidéo ! Vos émissions préférées sont désormais filmées et diffusées sur nos plateformes numériques. Une expérience immersive qui rapproche encore davantage la radio de son public.</p><p>Retrouvez les coulisses des studios, les interviews en images et les moments forts de la matinale.</p>', 'assets/img/article-3.jpg', 2, 'Rédaction GBÊKÊ FM', '2025-09-20', 'publie', 2560),
(4, 'Écoutez-nous à travers le monde entier', 'Grâce au streaming en ligne, GBÊKÊ FM est accessible partout sur la planète.', '<p>De Bouaké à Montréal, de Paris à Abidjan, des milliers d''auditeurs se connectent chaque jour pour écouter GBÊKÊ FM en direct. Le streaming en ligne abolit les frontières et rassemble la diaspora autour de sa radio.</p><p>Un simple clic suffit désormais pour rejoindre la communauté GBÊKÊ FM, où que vous soyez dans le monde.</p>', 'assets/img/emission-matin.jpg', 5, 'Rédaction GBÊKÊ FM', '2025-09-12', 'publie', 1980),
(5, 'Retour en images sur la rentrée des classes à Bouaké', 'Reportage dans les établissements de la ville pour la rentrée scolaire.', '<p>Notre équipe s''est rendue dans plusieurs écoles de Bouaké pour recueillir les impressions des élèves, des parents et des enseignants à l''occasion de la rentrée.</p><p>Entre enthousiasme et défis matériels, la rentrée 2025 s''annonce riche en émotions.</p>', 'assets/img/emission-scolaire.jpg', 4, 'Namizata', '2025-09-15', 'brouillon', 0),
(6, 'Mag'' Santé : cinq habitudes pour rester en forme', 'Nos experts partagent leurs conseils pour une meilleure hygiène de vie.', '<p>Bien dormir, manger équilibré, bouger régulièrement, s''hydrater et gérer son stress : cinq habitudes simples qui changent la vie.</p><p>Dans cet article, l''équipe de Mag'' Santé détaille chaque conseil avec des exemples concrets adaptés au quotidien ivoirien.</p>', 'assets/img/emission-sante.jpg', 3, 'Barthelemy Koné', '2025-10-01', 'publie', 2210);

-- Messages de contact
INSERT INTO `MESSAGE` (`id`, `nom`, `email`, `sujet`, `message`, `statut`, `date_message`) VALUES
(1, 'Aïcha Koné', 'aicha.kone@email.ci', 'Demande d''interview', 'Bonjour, je souhaiterais proposer une interview d''un artiste local dans Gossip Star.', 'non_lu', '2025-10-06 09:12:00'),
(2, 'Moussa Diarra', 'm.diarra@email.ci', 'Publicité', 'Nous souhaitons diffuser un spot publicitaire pour notre commerce. Quels sont vos tarifs ?', 'lu', '2025-10-05 16:40:00'),
(3, 'Fatou Traoré', 'fatou.t@email.ci', 'Remerciements', 'Merci pour l''émission Mag'' Santé, elle m''aide beaucoup. Continuez ainsi !', 'traite', '2025-10-04 11:05:00'),
(4, 'Yao Kouassi', 'yao.k@email.ci', 'Partenariat scolaire', 'Notre établissement aimerait participer à Virée Scolaire.', 'non_lu', '2025-10-06 08:30:00'),
(5, 'Anonymous', 'auditeur@email.ci', 'Problème de flux', 'Le direct coupe parfois sur mon téléphone. Est-ce normal ?', 'archive', '2025-09-29 20:15:00');

-- Visites (échantillon de démonstration)
INSERT INTO `VISITE` (`id`, `page`, `ip_hash`, `user_id`, `user_agent`, `referer`, `date_visite`) VALUES
(1, 'index.html', 'ip_100', 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-01 08:00:00'),
(2, 'podcasts.html', 'ip_107', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-01 10:07:00'),
(3, 'emission.html', 'ip_114', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-01 12:14:00'),
(4, 'actualites.html', 'ip_121', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-01 14:21:00'),
(5, 'article.html', 'ip_128', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-01 16:28:00'),
(6, 'categories.html', 'ip_135', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-01 18:35:00'),
(7, 'podcasts.html', 'ip_113', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-02 08:00:00'),
(8, 'emission.html', 'ip_120', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-02 10:07:00'),
(9, 'actualites.html', 'ip_127', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-02 12:14:00'),
(10, 'article.html', 'ip_134', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-02 14:21:00'),
(11, 'categories.html', 'ip_141', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-02 16:28:00'),
(12, 'contact.html', 'ip_148', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-02 18:35:00'),
(13, 'emission.html', 'ip_126', 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-03 08:00:00'),
(14, 'actualites.html', 'ip_133', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-03 10:07:00'),
(15, 'article.html', 'ip_140', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-03 12:14:00'),
(16, 'categories.html', 'ip_147', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-03 14:21:00'),
(17, 'contact.html', 'ip_154', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-03 16:28:00'),
(18, 'recherche.html', 'ip_161', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-03 18:35:00'),
(19, 'actualites.html', 'ip_139', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-04 08:00:00'),
(20, 'article.html', 'ip_146', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-04 10:07:00'),
(21, 'categories.html', 'ip_153', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-04 12:14:00'),
(22, 'contact.html', 'ip_160', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-04 14:21:00'),
(23, 'recherche.html', 'ip_167', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-04 16:28:00'),
(24, 'podcast.html', 'ip_174', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-04 18:35:00'),
(25, 'article.html', 'ip_152', 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-05 08:00:00'),
(26, 'categories.html', 'ip_159', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-05 10:07:00'),
(27, 'contact.html', 'ip_166', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-05 12:14:00'),
(28, 'recherche.html', 'ip_173', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-05 14:21:00'),
(29, 'podcast.html', 'ip_180', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-05 16:28:00'),
(30, 'emissions.html', 'ip_187', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-05 18:35:00'),
(31, 'categories.html', 'ip_165', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-06 08:00:00'),
(32, 'contact.html', 'ip_172', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-06 10:07:00'),
(33, 'recherche.html', 'ip_179', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-06 12:14:00'),
(34, 'podcast.html', 'ip_186', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-06 14:21:00'),
(35, 'emissions.html', 'ip_193', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://www.google.com/', '2025-10-06 16:28:00'),
(36, 'index.html', 'ip_200', NULL, 'Mozilla/5.0 (Linux; Android 13)', 'https://www.google.com/', '2025-10-06 18:35:00');

-- Écoutes de podcasts (échantillon de démonstration)
INSERT INTO `ECOUTE` (`id`, `podcast_id`, `user_id`, `ip_hash`, `position`, `duree_ecoutee`, `source`, `date_ecoute`) VALUES
(1, 1, NULL, 'ip_17', 2238, 2538, 'web', '2025-10-01 17:00:00'),
(2, 1, NULL, 'ip_18', 2238, 2538, 'web', '2025-10-02 20:00:00'),
(3, 2, NULL, 'ip_34', 1985, 2285, 'web', '2025-10-01 17:00:00'),
(4, 2, 5, 'ip_35', 1985, 2285, 'web', '2025-10-02 20:00:00'),
(5, 3, 5, 'ip_51', 2800, 3100, 'web', '2025-10-01 17:00:00'),
(6, 3, NULL, 'ip_52', 2800, 3100, 'web', '2025-10-02 20:00:00'),
(7, 4, NULL, 'ip_68', 2352, 2652, 'web', '2025-10-01 17:00:00'),
(8, 4, NULL, 'ip_69', 2352, 2652, 'web', '2025-10-02 20:00:00'),
(9, 5, NULL, 'ip_85', 1707, 2007, 'web', '2025-10-01 17:00:00'),
(10, 5, 5, 'ip_86', 1707, 2007, 'web', '2025-10-02 20:00:00'),
(11, 6, 5, 'ip_102', 1491, 1791, 'web', '2025-10-01 17:00:00'),
(12, 6, NULL, 'ip_103', 1491, 1791, 'web', '2025-10-02 20:00:00'),
(13, 7, NULL, 'ip_119', 1904, 2204, 'web', '2025-10-01 17:00:00'),
(14, 7, NULL, 'ip_120', 1904, 2204, 'web', '2025-10-02 20:00:00'),
(15, 8, NULL, 'ip_136', 1569, 1869, 'web', '2025-10-01 17:00:00'),
(16, 8, 5, 'ip_137', 1569, 1869, 'web', '2025-10-02 20:00:00'),
(17, 9, 5, 'ip_153', 3210, 3510, 'web', '2025-10-01 17:00:00'),
(18, 9, NULL, 'ip_154', 3210, 3510, 'web', '2025-10-02 20:00:00'),
(19, 10, NULL, 'ip_170', 2542, 2842, 'web', '2025-10-01 17:00:00'),
(20, 10, NULL, 'ip_171', 2542, 2842, 'web', '2025-10-02 20:00:00');

-- Téléchargements (échantillon de démonstration)
INSERT INTO `TELECHARGEMENT` (`id`, `podcast_id`, `user_id`, `ip_hash`, `date_telechargement`) VALUES
(1, 1, NULL, 'ip_23', '2025-10-02 19:00:00'),
(2, 2, 5, 'ip_46', '2025-10-02 19:00:00'),
(3, 3, NULL, 'ip_69', '2025-10-02 19:00:00'),
(4, 4, 5, 'ip_92', '2025-10-02 19:00:00'),
(5, 5, NULL, 'ip_115', '2025-10-02 19:00:00'),
(6, 6, 5, 'ip_138', '2025-10-02 19:00:00'),
(7, 7, NULL, 'ip_161', '2025-10-02 19:00:00'),
(8, 8, 5, 'ip_184', '2025-10-02 19:00:00'),
(9, 9, NULL, 'ip_207', '2025-10-02 19:00:00'),
(10, 10, 5, 'ip_230', '2025-10-02 19:00:00');

-- Favoris (compte démo auditeur, user_id = 5)
INSERT INTO `FAVORI` (`id`, `user_id`, `podcast_id`, `date_ajout`) VALUES
(1, 5, 1, '2025-10-02 08:00:00'),
(2, 5, 3, '2025-10-03 08:00:00'),
(3, 5, 5, '2025-10-04 08:00:00'),
(4, 5, 9, '2025-10-05 08:00:00'),
(5, 5, 11, '2025-10-06 08:00:00');

-- Historique d'écoute (compte démo auditeur, user_id = 5)
INSERT INTO `HISTORIQUE_ECOUTE` (`id`, `user_id`, `podcast_id`, `position`, `date_derniere_ecoute`) VALUES
(1, 5, 9, 1200, '2025-10-03 04:00:00'),
(2, 5, 5, 900, '2025-10-04 04:00:00'),
(3, 5, 3, 3100, '2025-10-05 04:00:00'),
(4, 5, 11, 450, '2025-10-06 04:00:00');

-- Statistiques du direct (échantillon sur 24 h)
INSERT INTO `STATISTIQUE_LIVE` (`id`, `radio_id`, `auditeurs`, `date_mesure`) VALUES
(1, 1, 150, '2025-10-06 00:00:00'),
(2, 1, 217, '2025-10-06 01:00:00'),
(3, 1, 284, '2025-10-06 02:00:00'),
(4, 1, 261, '2025-10-06 03:00:00'),
(5, 1, 328, '2025-10-06 04:00:00'),
(6, 1, 305, '2025-10-06 05:00:00'),
(7, 1, 1142, '2025-10-06 06:00:00'),
(8, 1, 1299, '2025-10-06 07:00:00'),
(9, 1, 1366, '2025-10-06 08:00:00'),
(10, 1, 1523, '2025-10-06 09:00:00'),
(11, 1, 410, '2025-10-06 10:00:00'),
(12, 1, 447, '2025-10-06 11:00:00'),
(13, 1, 984, '2025-10-06 12:00:00'),
(14, 1, 991, '2025-10-06 13:00:00'),
(15, 1, 1088, '2025-10-06 14:00:00'),
(16, 1, 415, '2025-10-06 15:00:00'),
(17, 1, 452, '2025-10-06 16:00:00'),
(18, 1, 489, '2025-10-06 17:00:00'),
(19, 1, 1236, '2025-10-06 18:00:00'),
(20, 1, 1363, '2025-10-06 19:00:00'),
(21, 1, 1400, '2025-10-06 20:00:00'),
(22, 1, 1527, '2025-10-06 21:00:00'),
(23, 1, 404, '2025-10-06 22:00:00'),
(24, 1, 441, '2025-10-06 23:00:00');

-- Abonnés newsletter
INSERT INTO `ABONNEMENT_NEWSLETTER` (`id`, `email`, `statut`, `date_inscription`) VALUES
(1, 'aicha.kone@email.ci', 'actif', '2025-10-02 18:00:00'),
(2, 'm.diarra@email.ci', 'actif', '2025-10-03 18:00:00'),
(3, 'koffi.gbeke@email.ci', 'actif', '2025-10-04 18:00:00'),
(4, 'fatou.traore@email.ci', 'actif', '2025-10-05 18:00:00'),
(5, 'jean.kouassi@email.ci', 'desabonne', '2025-10-06 18:00:00'),
(6, 'mariam.coulibaly@email.ci', 'actif', '2025-10-07 18:00:00');

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================================
--  VUES UTILITAIRES (facultatif) — pour les statistiques du tableau de bord
-- ==========================================================================

CREATE OR REPLACE VIEW `V_STATS_GLOBALES` AS
SELECT
  (SELECT COUNT(*) FROM `PODCAST` WHERE `statut` = 'publie')            AS total_podcasts,
  (SELECT COUNT(*) FROM `ARTICLE` WHERE `statut` = 'publie')            AS total_articles,
  (SELECT COUNT(*) FROM `EMISSION` WHERE `statut` = 'publie')           AS total_emissions,
  (SELECT COUNT(*) FROM `UTILISATEUR`)                                  AS total_utilisateurs,
  (SELECT COALESCE(SUM(`ecoute`), 0) FROM `PODCAST`)                    AS total_ecoutes,
  (SELECT COALESCE(SUM(`telechargements`), 0) FROM `PODCAST`)           AS total_telechargements,
  (SELECT COUNT(*) FROM `MESSAGE` WHERE `statut` = 'non_lu')            AS messages_non_lus,
  (SELECT COUNT(*) FROM `ABONNEMENT_NEWSLETTER` WHERE `statut` = 'actif') AS abonnes_newsletter;

CREATE OR REPLACE VIEW `V_PODCASTS_POPULAIRES` AS
SELECT p.`id`, p.`titre`, e.`nom` AS emission, c.`nom` AS categorie,
       p.`ecoute`, p.`telechargements`, p.`date_publication`
FROM `PODCAST` p
JOIN `EMISSION` e  ON e.`id` = p.`emission_id`
JOIN `CATEGORIE` c ON c.`id` = p.`categorie_id`
WHERE p.`statut` = 'publie'
ORDER BY p.`ecoute` DESC;

-- ==========================================================================
--  FIN DU SCRIPT
-- ==========================================================================
