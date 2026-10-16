#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur du script SQL de la base de données GBÊKÊ FM.
Lit /tmp/gbeke_data.json (extrait de js/data.js) et produit gbekefm.sql,
importable directement dans phpMyAdmin (XAMPP / MySQL / MariaDB).

Modèle : 17 tables conformément au cahier des charges GBÊKÊ FM.
"""
import json
import html
import unicodedata
from datetime import datetime, timedelta

DATA = json.load(open("/tmp/gbeke_data.json", encoding="utf-8"))


def norm(s):
    """Normalise un statut : minuscules + suppression des accents (ASCII).
    Garantit la cohérence des ENUM quelle que soit la collation."""
    if s is None:
        return None
    s = unicodedata.normalize("NFKD", str(s))
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.strip().lower()

# --- Hash bcrypt (PHP password_hash) pour chaque compte ---------------------
HASHES = {
    "amadou.kone@gbekefm.com": "$2y$10$y0gA5tCdddtXpCwAz4zvEeCWCFWxh1ZtPBPqwS5CqK9P1PRw9YsBy",
    "awa.bamba@gbekefm.com": "$2y$10$XV6W9UPWMY.cPrKNLpM09.ZMFPReFeG2iW8aPFoDGzK74Etn0YpKa",
    "ibrahim.traore@gbekefm.com": "$2y$10$tzqfG877OV8c/YpwDIOhDuDtKO35iKw9zTLSU165zjOwJtmnHUA2a",
    "demo.admin@gbekefm.com": "$2y$10$JAF3eS9K0iYqcm3buOqY1ONCuubL4fWIzah2BXyeGgghRXyW.bwOe",
    "demo.auditeur@email.ci": "$2y$10$8eW.tdS5eeSTl1xIX4AXpO43FmJPtDssZ9JBBk7.KAzd..n1ruO8S",
    "alima.sanogo@gbekefm.com": "$2y$10$.An5kxPxPLhUxvhVhYzFUODqP2DYqLOB/i2aFCbBd8ypTR/LEXXv6",
    "y.dosso@email.ci": "$2y$10$JkOJkwteRcHOs5877dRWtuW/XcNWM1VfB07DTTsoCmZZO3okqexaS",
    "m.coulibaly@email.ci": "$2y$10$5hbuAXUiOl26cR3x7z3Z2Oo47rAWjQjTFLPWHEVaYlEmSrW55m7Za",
}

# Rôle -> role_id
ROLE_ID = {r["nom"]: r["id"] for r in DATA["roles"]}
# Catégorie (nom) -> id
CAT_ID = {c["nom"]: c["id"] for c in DATA["categories"]}
# Émission (nom) -> id
EMI_ID = {e["nom"]: e["id"] for e in DATA["emissions"]}


def q(v):
    """Échappe et quote une valeur SQL."""
    if v is None:
        return "NULL"
    if isinstance(v, (int, float)):
        return str(v)
    s = str(v).replace("\\", "\\\\").replace("'", "''")
    return "'" + s + "'"


def esc(s):
    return str(s).replace("\\", "\\\\").replace("'", "''")


lines = []
w = lines.append

w("-- ==========================================================================")
w("--  GBÊKÊ FM — Base de données MySQL / MariaDB")
w("--  Script généré automatiquement — importable dans phpMyAdmin (XAMPP)")
w("--  Modèle : 17 tables (cahier des charges GBÊKÊ FM v1.0)")
w("--  Encodage : UTF-8 (utf8mb4)")
w("-- ==========================================================================")
w("")
w("SET NAMES utf8mb4;")
w("SET time_zone = '+00:00';")
w("SET FOREIGN_KEY_CHECKS = 0;")
w("SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';")
w("")
w("-- --------------------------------------------------------------------------")
w("--  Création de la base de données")
w("-- --------------------------------------------------------------------------")
w("CREATE DATABASE IF NOT EXISTS `gbekefm`")
w("  DEFAULT CHARACTER SET utf8mb4")
w("  DEFAULT COLLATE utf8mb4_unicode_ci;")
w("USE `gbekefm`;")
w("")
w("-- Suppression des tables si elles existent (ré-import propre)")
for t in ["ROLE_PERMISSION", "FAVORI", "HISTORIQUE_ECOUTE", "TELECHARGEMENT",
          "ECOUTE", "VISITE", "STATISTIQUE_LIVE", "ABONNEMENT_NEWSLETTER",
          "PODCAST", "ARTICLE", "EMISSION", "CATEGORIE", "MESSAGE",
          "UTILISATEUR", "PERMISSION", "ROLE", "RADIO"]:
    w(f"DROP TABLE IF EXISTS `{t}`;")
w("")

# ---------------------------------------------------------------------------
# 1. ROLE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : ROLE")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `ROLE` (")
w("  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `nom`         VARCHAR(50)  NOT NULL,")
w("  `description` VARCHAR(255) DEFAULT NULL,")
w("  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_role_nom` (`nom`)")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 2. PERMISSION
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : PERMISSION")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `PERMISSION` (")
w("  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `code`        VARCHAR(60)  NOT NULL,")
w("  `nom`         VARCHAR(100) NOT NULL,")
w("  `description` VARCHAR(255) DEFAULT NULL,")
w("  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_permission_code` (`code`)")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 3. ROLE_PERMISSION
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : ROLE_PERMISSION (liaison ROLE <-> PERMISSION)")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `ROLE_PERMISSION` (")
w("  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `role_id`       INT UNSIGNED NOT NULL,")
w("  `permission_id` INT UNSIGNED NOT NULL,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),")
w("  KEY `idx_rp_permission` (`permission_id`),")
w("  CONSTRAINT `fk_rp_role`       FOREIGN KEY (`role_id`)       REFERENCES `ROLE` (`id`)       ON DELETE CASCADE ON UPDATE CASCADE,")
w("  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `PERMISSION` (`id`) ON DELETE CASCADE ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 4. UTILISATEUR
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : UTILISATEUR")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `UTILISATEUR` (")
w("  `id`                 INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `nom`                VARCHAR(80)  NOT NULL,")
w("  `prenom`             VARCHAR(80)  NOT NULL,")
w("  `email`              VARCHAR(150) NOT NULL,")
w("  `password`           VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt uniquement',")
w("  `role_id`            INT UNSIGNED NOT NULL,")
w("  `telephone`          VARCHAR(30)  DEFAULT NULL,")
w("  `statut`             ENUM('actif','inactif','bloque') NOT NULL DEFAULT 'actif',")
w("  `is_demo`            TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'Compte de démonstration (supprimable)',")
w("  `derniere_connexion` DATETIME     DEFAULT NULL,")
w("  `created_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_utilisateur_email` (`email`),")
w("  KEY `idx_utilisateur_role` (`role_id`),")
w("  CONSTRAINT `fk_utilisateur_role` FOREIGN KEY (`role_id`) REFERENCES `ROLE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 5. RADIO
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : RADIO (configuration du flux en direct)")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `RADIO` (")
w("  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `nom`         VARCHAR(100) NOT NULL,")
w("  `slogan`      VARCHAR(150) DEFAULT NULL,")
w("  `frequence`   VARCHAR(30)  DEFAULT NULL,")
w("  `ville`       VARCHAR(100) DEFAULT NULL,")
w("  `description` TEXT         DEFAULT NULL,")
w("  `logo`        VARCHAR(255) DEFAULT NULL,")
w("  `stream_url`  VARCHAR(255) NOT NULL COMMENT 'URL du flux audio en direct',")
w("  `live_page`   VARCHAR(255) DEFAULT NULL COMMENT 'Page publique du direct',")
w("  `statut`      ENUM('en_direct','hors_ligne') NOT NULL DEFAULT 'hors_ligne',")
w("  `auditeurs`   INT UNSIGNED NOT NULL DEFAULT 0,")
w("  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`)")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 6. CATEGORIE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : CATEGORIE")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `CATEGORIE` (")
w("  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `nom`         VARCHAR(80)  NOT NULL,")
w("  `slug`        VARCHAR(80)  NOT NULL,")
w("  `description` VARCHAR(255) DEFAULT NULL,")
w("  `icone`       VARCHAR(50)  DEFAULT NULL,")
w("  `statut`      ENUM('active','inactive') NOT NULL DEFAULT 'active',")
w("  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_categorie_slug` (`slug`)")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 7. EMISSION
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : EMISSION")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `EMISSION` (")
w("  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `nom`          VARCHAR(150) NOT NULL,")
w("  `slug`         VARCHAR(150) NOT NULL,")
w("  `categorie_id` INT UNSIGNED NOT NULL,")
w("  `animateur`    VARCHAR(150) DEFAULT NULL,")
w("  `diffusion`    VARCHAR(100) DEFAULT NULL COMMENT 'Ex : Mardi 12h00',")
w("  `image`        VARCHAR(255) DEFAULT NULL,")
w("  `description`  TEXT         DEFAULT NULL,")
w("  `statut`       ENUM('publie','brouillon','archive') NOT NULL DEFAULT 'brouillon',")
w("  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_emission_slug` (`slug`),")
w("  KEY `idx_emission_categorie` (`categorie_id`),")
w("  CONSTRAINT `fk_emission_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `CATEGORIE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 8. PODCAST
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : PODCAST")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `PODCAST` (")
w("  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `titre`            VARCHAR(200) NOT NULL,")
w("  `emission_id`      INT UNSIGNED NOT NULL,")
w("  `categorie_id`     INT UNSIGNED NOT NULL,")
w("  `createur`         VARCHAR(150) DEFAULT NULL,")
w("  `duree`            VARCHAR(10)  DEFAULT NULL COMMENT 'Format mm:ss',")
w("  `duree_sec`        INT UNSIGNED DEFAULT NULL COMMENT 'Durée en secondes',")
w("  `date_publication` DATE         DEFAULT NULL,")
w("  `image`            VARCHAR(255) DEFAULT NULL,")
w("  `audio`            VARCHAR(255) DEFAULT NULL COMMENT 'Chemin ou URL du fichier audio',")
w("  `description`      TEXT         DEFAULT NULL,")
w("  `statut`           ENUM('publie','brouillon','archive') NOT NULL DEFAULT 'brouillon',")
w("  `ecoute`           INT UNSIGNED NOT NULL DEFAULT 0,")
w("  `telechargements`  INT UNSIGNED NOT NULL DEFAULT 0,")
w("  `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  KEY `idx_podcast_emission` (`emission_id`),")
w("  KEY `idx_podcast_categorie` (`categorie_id`),")
w("  KEY `idx_podcast_date` (`date_publication`),")
w("  CONSTRAINT `fk_podcast_emission`  FOREIGN KEY (`emission_id`)  REFERENCES `EMISSION` (`id`)  ON DELETE RESTRICT ON UPDATE CASCADE,")
w("  CONSTRAINT `fk_podcast_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `CATEGORIE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 9. ARTICLE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : ARTICLE")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `ARTICLE` (")
w("  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `titre`            VARCHAR(200) NOT NULL,")
w("  `resume`           VARCHAR(500) DEFAULT NULL,")
w("  `contenu`          LONGTEXT     DEFAULT NULL,")
w("  `image`            VARCHAR(255) DEFAULT NULL,")
w("  `categorie_id`     INT UNSIGNED NOT NULL,")
w("  `auteur`           VARCHAR(150) DEFAULT NULL,")
w("  `date_publication` DATE         DEFAULT NULL,")
w("  `statut`           ENUM('publie','brouillon','archive') NOT NULL DEFAULT 'brouillon',")
w("  `vues`             INT UNSIGNED NOT NULL DEFAULT 0,")
w("  `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  KEY `idx_article_categorie` (`categorie_id`),")
w("  KEY `idx_article_date` (`date_publication`),")
w("  CONSTRAINT `fk_article_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `CATEGORIE` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 10. VISITE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : VISITE (statistiques de fréquentation)")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `VISITE` (")
w("  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `page`        VARCHAR(255) NOT NULL,")
w("  `ip_hash`     VARCHAR(64)  DEFAULT NULL COMMENT 'IP anonymisée (hash)',")
w("  `user_id`     INT UNSIGNED DEFAULT NULL,")
w("  `user_agent`  VARCHAR(255) DEFAULT NULL,")
w("  `referer`     VARCHAR(255) DEFAULT NULL,")
w("  `date_visite` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  KEY `idx_visite_user` (`user_id`),")
w("  KEY `idx_visite_date` (`date_visite`),")
w("  CONSTRAINT `fk_visite_user` FOREIGN KEY (`user_id`) REFERENCES `UTILISATEUR` (`id`) ON DELETE SET NULL ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 11. ECOUTE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : ECOUTE (écoutes de podcasts)")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `ECOUTE` (")
w("  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `podcast_id`    INT UNSIGNED NOT NULL,")
w("  `user_id`       INT UNSIGNED DEFAULT NULL COMMENT 'NULL = visiteur anonyme',")
w("  `ip_hash`       VARCHAR(64)  DEFAULT NULL,")
w("  `position`      INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Position de lecture (s)',")
w("  `duree_ecoutee` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Durée écoutée (s)',")
w("  `source`        ENUM('web','mobile','embed') NOT NULL DEFAULT 'web',")
w("  `date_ecoute`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  KEY `idx_ecoute_podcast` (`podcast_id`),")
w("  KEY `idx_ecoute_user` (`user_id`),")
w("  KEY `idx_ecoute_date` (`date_ecoute`),")
w("  CONSTRAINT `fk_ecoute_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,")
w("  CONSTRAINT `fk_ecoute_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE SET NULL ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 12. TELECHARGEMENT
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : TELECHARGEMENT")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `TELECHARGEMENT` (")
w("  `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `podcast_id`            INT UNSIGNED NOT NULL,")
w("  `user_id`               INT UNSIGNED DEFAULT NULL COMMENT 'NULL = visiteur anonyme',")
w("  `ip_hash`               VARCHAR(64)  DEFAULT NULL,")
w("  `date_telechargement`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  KEY `idx_tel_podcast` (`podcast_id`),")
w("  KEY `idx_tel_user` (`user_id`),")
w("  KEY `idx_tel_date` (`date_telechargement`),")
w("  CONSTRAINT `fk_tel_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,")
w("  CONSTRAINT `fk_tel_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE SET NULL ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 13. FAVORI
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : FAVORI")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `FAVORI` (")
w("  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `user_id`    INT UNSIGNED NOT NULL,")
w("  `podcast_id` INT UNSIGNED NOT NULL,")
w("  `date_ajout` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_favori_user_podcast` (`user_id`, `podcast_id`),")
w("  KEY `idx_favori_podcast` (`podcast_id`),")
w("  CONSTRAINT `fk_favori_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,")
w("  CONSTRAINT `fk_favori_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`)     ON DELETE CASCADE ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 14. HISTORIQUE_ECOUTE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : HISTORIQUE_ECOUTE")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `HISTORIQUE_ECOUTE` (")
w("  `id`                   INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `user_id`              INT UNSIGNED NOT NULL,")
w("  `podcast_id`           INT UNSIGNED NOT NULL,")
w("  `position`             INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Position de reprise (s)',")
w("  `date_derniere_ecoute` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_hist_user_podcast` (`user_id`, `podcast_id`),")
w("  KEY `idx_hist_podcast` (`podcast_id`),")
w("  CONSTRAINT `fk_hist_user`    FOREIGN KEY (`user_id`)    REFERENCES `UTILISATEUR` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,")
w("  CONSTRAINT `fk_hist_podcast` FOREIGN KEY (`podcast_id`) REFERENCES `PODCAST` (`id`)     ON DELETE CASCADE ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 15. MESSAGE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : MESSAGE")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `MESSAGE` (")
w("  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `nom`          VARCHAR(120) NOT NULL,")
w("  `email`        VARCHAR(150) NOT NULL,")
w("  `sujet`        VARCHAR(150) DEFAULT NULL,")
w("  `message`      TEXT         NOT NULL,")
w("  `statut`       ENUM('non_lu','lu','traite','archive') NOT NULL DEFAULT 'non_lu',")
w("  `date_message` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  KEY `idx_message_statut` (`statut`),")
w("  KEY `idx_message_date` (`date_message`)")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 16. STATISTIQUE_LIVE
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : STATISTIQUE_LIVE (audience du direct)")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `STATISTIQUE_LIVE` (")
w("  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `radio_id`    INT UNSIGNED NOT NULL,")
w("  `auditeurs`   INT UNSIGNED NOT NULL DEFAULT 0,")
w("  `date_mesure` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  KEY `idx_live_radio` (`radio_id`),")
w("  KEY `idx_live_date` (`date_mesure`),")
w("  CONSTRAINT `fk_live_radio` FOREIGN KEY (`radio_id`) REFERENCES `RADIO` (`id`) ON DELETE CASCADE ON UPDATE CASCADE")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ---------------------------------------------------------------------------
# 17. ABONNEMENT_NEWSLETTER
# ---------------------------------------------------------------------------
w("-- --------------------------------------------------------------------------")
w("--  Table : ABONNEMENT_NEWSLETTER")
w("-- --------------------------------------------------------------------------")
w("CREATE TABLE `ABONNEMENT_NEWSLETTER` (")
w("  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,")
w("  `email`            VARCHAR(150) NOT NULL,")
w("  `statut`           ENUM('actif','desabonne') NOT NULL DEFAULT 'actif',")
w("  `date_inscription` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,")
w("  PRIMARY KEY (`id`),")
w("  UNIQUE KEY `uk_newsletter_email` (`email`)")
w(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
w("")

# ===========================================================================
#  INSERTIONS DE DONNÉES
# ===========================================================================
w("-- ==========================================================================")
w("--  DONNÉES INITIALES / DE DÉMONSTRATION")
w("-- ==========================================================================")
w("")

# --- ROLE ---
w("-- Rôles")
w("INSERT INTO `ROLE` (`id`, `nom`, `description`) VALUES")
role_rows = []
for r in DATA["roles"]:
    role_rows.append(f"({r['id']}, {q(r['nom'])}, {q(r['description'])})")
w(",\n".join(role_rows) + ";")
w("")

# --- PERMISSION ---
w("-- Permissions")
PERM_CODES = [
    ("gerer_utilisateurs", "Gérer les utilisateurs"),
    ("gerer_roles", "Gérer les rôles"),
    ("gerer_emissions", "Gérer les émissions"),
    ("gerer_podcasts", "Gérer les podcasts"),
    ("gerer_articles", "Gérer les articles"),
    ("gerer_categories", "Gérer les catégories"),
    ("gerer_messages", "Gérer les messages"),
    ("gerer_radio", "Gérer la radio"),
    ("voir_statistiques", "Voir les statistiques"),
]
w("INSERT INTO `PERMISSION` (`id`, `code`, `nom`, `description`) VALUES")
perm_rows = []
for i, (code, nom) in enumerate(PERM_CODES, start=1):
    perm_rows.append(f"({i}, {q(code)}, {q(nom)}, {q('Permission : ' + nom)})")
w(",\n".join(perm_rows) + ";")
w("")

# --- ROLE_PERMISSION ---
# Administrateur (1) -> toutes (1-9) ; Éditeur (2) -> contenus (3,4,5,6,7,9) ; Animateur (3) -> (3,4,9) ; Utilisateur (4) -> aucune
rp = []
rp_id = 1
role_perms = {
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    2: [3, 4, 5, 6, 7, 9],
    3: [3, 4, 9],
    4: [],
}
for rid, perms in role_perms.items():
    for pid in perms:
        rp.append(f"({rp_id}, {rid}, {pid})")
        rp_id += 1
w("-- Permissions par rôle")
w("INSERT INTO `ROLE_PERMISSION` (`id`, `role_id`, `permission_id`) VALUES")
w(",\n".join(rp) + ";")
w("")

# --- UTILISATEUR ---
# On combine la liste de gestion des utilisateurs avec les comptes de connexion
# (y compris les comptes de démonstration) afin que tous les identifiants
# présents dans l'application existent aussi en base.
w("-- Utilisateurs (mots de passe hachés en bcrypt)")
w("INSERT INTO `UTILISATEUR` (`id`, `nom`, `prenom`, `email`, `password`, `role_id`, `statut`, `is_demo`, `created_at`) VALUES")
u_rows = []
seen_emails = set()
for u in DATA["utilisateurs"]:
    email = u["email"]
    seen_emails.add(email)
    pw = HASHES.get(email, HASHES["demo.auditeur@email.ci"])
    rid = ROLE_ID.get(u["role"], 4)
    statut = norm(u["statut"])
    is_demo = 1 if email.startswith("demo.") else 0
    created = u["date"] + " 08:00:00"
    u_rows.append(
        f"({u['id']}, {q(u['nom'])}, {q(u['prenom'])}, {q(email)}, {q(pw)}, {rid}, {q(statut)}, {is_demo}, {q(created)})"
    )
# Ajout des comptes de connexion non listés (comptes de démonstration)
next_id = max(u["id"] for u in DATA["utilisateurs"]) + 1
for c in DATA["comptes"]:
    if c["email"] in seen_emails:
        continue
    seen_emails.add(c["email"])
    pw = HASHES.get(c["email"], HASHES["demo.auditeur@email.ci"])
    rid = ROLE_ID.get(c["role"], 4)
    created = "2025-10-01 08:00:00"
    u_rows.append(
        f"({next_id}, {q(c['nom'])}, {q(c['prenom'])}, {q(c['email'])}, {q(pw)}, {rid}, 'actif', 1, {q(created)})"
    )
    next_id += 1
w(",\n".join(u_rows) + ";")
w("")

# --- RADIO ---
r = DATA["radio"]
w("-- Configuration de la radio")
w("INSERT INTO `RADIO` (`id`, `nom`, `slogan`, `frequence`, `ville`, `description`, `logo`, `stream_url`, `live_page`, `statut`, `auditeurs`) VALUES")
w(f"(1, {q(r['nom'])}, {q(r['slogan'])}, {q(r['frequence'])}, {q(r['ville'])}, {q(r['description'])}, {q(r['logo'])}, {q(r['streamUrl'])}, {q(r.get('livePage',''))}, {q(r['statut'])}, {r['auditeurs']});")
w("")

# --- CATEGORIE ---
w("-- Catégories")
w("INSERT INTO `CATEGORIE` (`id`, `nom`, `slug`, `description`, `icone`, `statut`) VALUES")
c_rows = []
for c in DATA["categories"]:
    c_rows.append(f"({c['id']}, {q(c['nom'])}, {q(c['slug'])}, {q(c['description'])}, {q(c['icone'])}, {q(norm(c['statut']))})")
w(",\n".join(c_rows) + ";")
w("")

# --- EMISSION ---
w("-- Émissions")
w("INSERT INTO `EMISSION` (`id`, `nom`, `slug`, `categorie_id`, `animateur`, `diffusion`, `image`, `description`, `statut`) VALUES")
e_rows = []
for e in DATA["emissions"]:
    cid = CAT_ID.get(e["categorie"], 1)
    e_rows.append(
        f"({e['id']}, {q(e['nom'])}, {q(e['slug'])}, {cid}, {q(e['animateur'])}, {q(e['diffusion'])}, {q(e['image'])}, {q(e['description'])}, {q(norm(e['statut']))})"
    )
w(",\n".join(e_rows) + ";")
w("")

# --- PODCAST ---
w("-- Podcasts")
w("INSERT INTO `PODCAST` (`id`, `titre`, `emission_id`, `categorie_id`, `createur`, `duree`, `duree_sec`, `date_publication`, `image`, `audio`, `description`, `statut`, `ecoute`, `telechargements`) VALUES")
p_rows = []
for p in DATA["podcasts"]:
    cid = CAT_ID.get(p["categorie"], 1)
    p_rows.append(
        f"({p['id']}, {q(p['titre'])}, {p['emissionId']}, {cid}, {q(p['createur'])}, {q(p['duree'])}, {p['dureeSec']}, {q(p['date'])}, {q(p['image'])}, {q(p['audio'])}, {q(p['description'])}, {q(norm(p['statut']))}, {p['ecoute']}, {p['telechargements']})"
    )
w(",\n".join(p_rows) + ";")
w("")

# --- ARTICLE ---
w("-- Articles")
w("INSERT INTO `ARTICLE` (`id`, `titre`, `resume`, `contenu`, `image`, `categorie_id`, `auteur`, `date_publication`, `statut`, `vues`) VALUES")
a_rows = []
for a in DATA["articles"]:
    cid = CAT_ID.get(a["categorie"], 1)
    a_rows.append(
        f"({a['id']}, {q(a['titre'])}, {q(a['resume'])}, {q(a['contenu'])}, {q(a['image'])}, {cid}, {q(a['auteur'])}, {q(a['date'])}, {q(norm(a['statut']))}, {a['vues']})"
    )
w(",\n".join(a_rows) + ";")
w("")

# --- MESSAGE ---
w("-- Messages de contact")
w("INSERT INTO `MESSAGE` (`id`, `nom`, `email`, `sujet`, `message`, `statut`, `date_message`) VALUES")
m_rows = []
for m in DATA["messages"]:
    dt = m["date"] + ":00" if len(m["date"]) == 16 else m["date"]
    m_rows.append(
        f"({m['id']}, {q(m['nom'])}, {q(m['email'])}, {q(m['sujet'])}, {q(m['message'])}, {q(norm(m['statut']))}, {q(dt)})"
    )
w(",\n".join(m_rows) + ";")
w("")

# --- VISITE (données de démonstration) ---
w("-- Visites (échantillon de démonstration)")
pages = ["index.html", "podcasts.html", "emission.html", "actualites.html",
         "article.html", "categories.html", "contact.html", "recherche.html",
         "podcast.html", "emissions.html"]
base = datetime(2025, 10, 1, 8, 0, 0)
v_rows = []
vid = 1
for day in range(6):
    for k in range(6):
        d = base + timedelta(days=day, hours=k * 2, minutes=(k * 7) % 60)
        page = pages[(day + k) % len(pages)]
        ip = "ip_" + str((day * 13 + k * 7 + 100) % 997)
        uid = "NULL"
        if k == 0 and day % 2 == 0:
            uid = "5"  # démo auditeur
        ua = "'Mozilla/5.0 (Linux; Android 13)'" if k % 2 else "'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'"
        v_rows.append(f"({vid}, {q(page)}, {q(ip)}, {uid}, {ua}, {q('https://www.google.com/')}, {q(d.strftime('%Y-%m-%d %H:%M:%S'))})")
        vid += 1
w("INSERT INTO `VISITE` (`id`, `page`, `ip_hash`, `user_id`, `user_agent`, `referer`, `date_visite`) VALUES")
w(",\n".join(v_rows) + ";")
w("")

# --- ECOUTE (échantillon) ---
w("-- Écoutes de podcasts (échantillon de démonstration)")
ec_rows = []
ecid = 1
for p in DATA["podcasts"][:10]:
    for k in range(2):
        d = base + timedelta(days=k, hours=9 + k * 3)
        uid = "5" if (p["id"] + k) % 3 == 0 else "NULL"
        pos = max(0, p["dureeSec"] - 300)
        ec_rows.append(
            f"({ecid}, {p['id']}, {uid}, {q('ip_' + str((p['id'] * 17 + k) % 997))}, {pos}, {p['dureeSec']}, {q('web')}, {q(d.strftime('%Y-%m-%d %H:%M:%S'))})"
        )
        ecid += 1
w("INSERT INTO `ECOUTE` (`id`, `podcast_id`, `user_id`, `ip_hash`, `position`, `duree_ecoutee`, `source`, `date_ecoute`) VALUES")
w(",\n".join(ec_rows) + ";")
w("")

# --- TELECHARGEMENT (échantillon) ---
w("-- Téléchargements (échantillon de démonstration)")
dl_rows = []
dlid = 1
for p in DATA["podcasts"][:10]:
    for k in range(1):
        d = base + timedelta(days=k + 1, hours=11)
        uid = "5" if p["id"] % 2 == 0 else "NULL"
        dl_rows.append(
            f"({dlid}, {p['id']}, {uid}, {q('ip_' + str((p['id'] * 23 + k) % 997))}, {q(d.strftime('%Y-%m-%d %H:%M:%S'))})"
        )
        dlid += 1
w("INSERT INTO `TELECHARGEMENT` (`id`, `podcast_id`, `user_id`, `ip_hash`, `date_telechargement`) VALUES")
w(",\n".join(dl_rows) + ";")
w("")

# --- FAVORI (démo auditeur = user 5) ---
w("-- Favoris (compte démo auditeur, user_id = 5)")
fav_rows = []
for i, pid in enumerate([1, 3, 5, 9, 11], start=1):
    d = base + timedelta(days=i)
    fav_rows.append(f"({i}, 5, {pid}, {q(d.strftime('%Y-%m-%d %H:%M:%S'))})")
w("INSERT INTO `FAVORI` (`id`, `user_id`, `podcast_id`, `date_ajout`) VALUES")
w(",\n".join(fav_rows) + ";")
w("")

# --- HISTORIQUE_ECOUTE (démo auditeur = user 5) ---
w("-- Historique d'écoute (compte démo auditeur, user_id = 5)")
h_rows = []
for i, (pid, pos) in enumerate([(9, 1200), (5, 900), (3, 3100), (11, 450)], start=1):
    d = base + timedelta(days=i, hours=20)
    h_rows.append(f"({i}, 5, {pid}, {pos}, {q(d.strftime('%Y-%m-%d %H:%M:%S'))})")
w("INSERT INTO `HISTORIQUE_ECOUTE` (`id`, `user_id`, `podcast_id`, `position`, `date_derniere_ecoute`) VALUES")
w(",\n".join(h_rows) + ";")
w("")

# --- STATISTIQUE_LIVE ---
w("-- Statistiques du direct (échantillon sur 24 h)")
sl_rows = []
slid = 1
for h in range(24):
    d = datetime(2025, 10, 6, 0, 0, 0) + timedelta(hours=h)
    # Courbe d'audience réaliste (pics matin & soir)
    base_aud = 400
    if 6 <= h <= 9:
        base_aud = 1100 + (h - 6) * 120
    elif 12 <= h <= 14:
        base_aud = 900 + (h - 12) * 60
    elif 18 <= h <= 21:
        base_aud = 1200 + (h - 18) * 90
    elif 0 <= h <= 5:
        base_aud = 150 + h * 30
    aud = base_aud + ((h * 37) % 90)
    sl_rows.append(f"({slid}, 1, {aud}, {q(d.strftime('%Y-%m-%d %H:%M:%S'))})")
    slid += 1
w("INSERT INTO `STATISTIQUE_LIVE` (`id`, `radio_id`, `auditeurs`, `date_mesure`) VALUES")
w(",\n".join(sl_rows) + ";")
w("")

# --- ABONNEMENT_NEWSLETTER ---
w("-- Abonnés newsletter")
nl = [
    ("aicha.kone@email.ci", "actif"),
    ("m.diarra@email.ci", "actif"),
    ("koffi.gbeke@email.ci", "actif"),
    ("fatou.traore@email.ci", "actif"),
    ("jean.kouassi@email.ci", "desabonne"),
    ("mariam.coulibaly@email.ci", "actif"),
]
nl_rows = []
for i, (email, statut) in enumerate(nl, start=1):
    d = base + timedelta(days=i, hours=10)
    nl_rows.append(f"({i}, {q(email)}, {q(statut)}, {q(d.strftime('%Y-%m-%d %H:%M:%S'))})")
w("INSERT INTO `ABONNEMENT_NEWSLETTER` (`id`, `email`, `statut`, `date_inscription`) VALUES")
w(",\n".join(nl_rows) + ";")
w("")

w("SET FOREIGN_KEY_CHECKS = 1;")
w("")
w("-- ==========================================================================")
w("--  VUES UTILITAIRES (facultatif) — pour les statistiques du tableau de bord")
w("-- ==========================================================================")
w("")
w("CREATE OR REPLACE VIEW `V_STATS_GLOBALES` AS")
w("SELECT")
w("  (SELECT COUNT(*) FROM `PODCAST` WHERE `statut` = 'publie')            AS total_podcasts,")
w("  (SELECT COUNT(*) FROM `ARTICLE` WHERE `statut` = 'publie')            AS total_articles,")
w("  (SELECT COUNT(*) FROM `EMISSION` WHERE `statut` = 'publie')           AS total_emissions,")
w("  (SELECT COUNT(*) FROM `UTILISATEUR`)                                  AS total_utilisateurs,")
w("  (SELECT COALESCE(SUM(`ecoute`), 0) FROM `PODCAST`)                    AS total_ecoutes,")
w("  (SELECT COALESCE(SUM(`telechargements`), 0) FROM `PODCAST`)           AS total_telechargements,")
w("  (SELECT COUNT(*) FROM `MESSAGE` WHERE `statut` = 'non_lu')            AS messages_non_lus,")
w("  (SELECT COUNT(*) FROM `ABONNEMENT_NEWSLETTER` WHERE `statut` = 'actif') AS abonnes_newsletter;")
w("")
w("CREATE OR REPLACE VIEW `V_PODCASTS_POPULAIRES` AS")
w("SELECT p.`id`, p.`titre`, e.`nom` AS emission, c.`nom` AS categorie,")
w("       p.`ecoute`, p.`telechargements`, p.`date_publication`")
w("FROM `PODCAST` p")
w("JOIN `EMISSION` e  ON e.`id` = p.`emission_id`")
w("JOIN `CATEGORIE` c ON c.`id` = p.`categorie_id`")
w("WHERE p.`statut` = 'publie'")
w("ORDER BY p.`ecoute` DESC;")
w("")
w("-- ==========================================================================")
w("--  FIN DU SCRIPT")
w("-- ==========================================================================")

sql = "\n".join(lines) + "\n"
open("/workspace/gbekefm/database/gbekefm.sql", "w", encoding="utf-8").write(sql)
print("gbekefm.sql généré :", len(sql), "octets,", sql.count("\n"), "lignes")
