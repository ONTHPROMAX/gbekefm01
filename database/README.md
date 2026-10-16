# GBÊKÊ FM — Base de données MySQL (XAMPP)

Ce dossier contient le script SQL complet de la plateforme **GBÊKÊ FM**, prêt à être
importé dans **phpMyAdmin** (XAMPP) pour tester le site en local.

## Fichiers

| Fichier | Description |
|---|---|
| `gbekefm.sql` | Script complet : création de la base + 17 tables + données de démonstration |
| `generate_sql.py` | Générateur du script (relit les données de `js/data.js`) |

## Contenu de la base

- **Base** : `gbekefm` (utf8mb4 / utf8mb4_unicode_ci)
- **17 tables** conformes au cahier des charges :
  `ROLE`, `PERMISSION`, `ROLE_PERMISSION`, `UTILISATEUR`, `RADIO`, `CATEGORIE`,
  `EMISSION`, `PODCAST`, `ARTICLE`, `VISITE`, `ECOUTE`, `TELECHARGEMENT`,
  `FAVORI`, `HISTORIQUE_ECOUTE`, `MESSAGE`, `STATISTIQUE_LIVE`,
  `ABONNEMENT_NEWSLETTER`
- **2 vues** utilitaires : `V_STATS_GLOBALES`, `V_PODCASTS_POPULAIRES`
- **Données de démonstration** : 6 catégories, 6 émissions, 13 podcasts, 6 articles,
  5 messages, 8 utilisateurs (dont 2 comptes démo), 4 rôles, 9 permissions,
  36 visites, 20 écoutes, 10 téléchargements, favoris, historique, 24 relevés
  d'audience du direct, 6 abonnés newsletter.

> ⚠️ La table `PROGRAMMATION` est volontairement **absente** : la gestion de la
> programmation des émissions est explicitement exclue du projet.

## Import dans XAMPP (phpMyAdmin)

### Méthode 1 — via l'interface phpMyAdmin
1. Démarrez **Apache** et **MySQL** dans le panneau de contrôle XAMPP.
2. Ouvrez <http://localhost/phpmyadmin>.
3. Cliquez sur l'onglet **Importer** (en haut).
4. Cliquez sur **Choisir un fichier** et sélectionnez `gbekefm.sql`.
5. Laissez les options par défaut puis cliquez sur **Exécuter**.
6. La base `gbekefm` est créée automatiquement avec toutes ses tables et données.

### Méthode 2 — en ligne de commande
```bash
# Depuis le dossier contenant gbekefm.sql
mysql -u root -p < gbekefm.sql
```
(Sous XAMPP, l'utilisateur `root` n'a généralement **pas** de mot de passe : appuyez
sur Entrée quand le mot de passe est demandé.)

## Comptes de connexion (mots de passe hachés en bcrypt)

Les mots de passe sont stockés **uniquement sous forme de hash bcrypt**
(`$2y$10$…`, compatible `password_verify()` de PHP). Les mots de passe en clair
ci-dessous sont fournis uniquement pour vos tests.

| Rôle | E-mail | Mot de passe | Type |
|---|---|---|---|
| Administrateur | `amadou.kone@gbekefm.com` | `GbekeBouake!105` | réel |
| Administrateur | `awa.bamba@gbekefm.com` | `RadioGbeke#2025` | réel |
| Administrateur | `ibrahim.traore@gbekefm.com` | `StudioGbeke@247` | réel |
| Administrateur | `demo.admin@gbekefm.com` | `DemoAdmin#2025` | **démo** |
| Utilisateur | `demo.auditeur@email.ci` | `DemoAuditeur#2025` | **démo** |

> Les deux comptes marqués **démo** (`is_demo = 1`) sont destinés à être supprimés
> après les tests : `DELETE FROM UTILISATEUR WHERE is_demo = 1;`

## Exemple de connexion PHP (PDO)

```php
<?php
$pdo = new PDO(
    'mysql:host=localhost;dbname=gbekefm;charset=utf8mb4',
    'root',
    '',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Authentification d'un utilisateur
$stmt = $pdo->prepare('
    SELECT u.*, r.nom AS role
    FROM UTILISATEUR u
    JOIN ROLE r ON r.id = u.role_id
    WHERE u.email = ? AND u.statut = "actif"
');
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($motDePasse, $user['password'])) {
    // Connexion réussie
}
```

## Notes techniques

- Toutes les tables utilisent le moteur **InnoDB** (clés étrangères + transactions).
- Les **fichiers audio et images ne sont pas stockés** en base : seuls leurs
  chemins/URL le sont (conformément au cahier des charges).
- Les clés étrangères sont déclarées avec `ON DELETE CASCADE` / `SET NULL` /
  `RESTRICT` selon la logique métier.
- Le script est idempotent : il supprime puis recrée les tables (`DROP TABLE IF EXISTS`).
