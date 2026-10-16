/* ============================================================
   GBÊKÊ FM — Données de démonstration (front-end)
   Modèle aligné sur le cahier des charges (17 tables).
   Dans la version Laravel, ces données proviennent de l'API REST.
   ============================================================ */
const GBEKE = (function () {
  const IMG = "assets/img/";

  /* --- RADIO --- */
  const radio = {
    nom: "GBÊKÊ FM",
    slogan: "Jusqu'au bout du monde !",
    frequence: "105.2 MHz",
    ville: "Bouaké, Côte d'Ivoire",
    description:
      "GBÊKÊ FM, premier média de Côte d'Ivoire certifié JTI à la norme CWA 17493. Votre radio de proximité : information, culture, musique et divertissement.",
    logo: "assets/brand/gbeke-logo.png",
    streamUrl: "https://stream.zeno.fm/m0982tsy908uv",
    livePage: "https://zeno.fm/radio/gbeke-fm/",
    statut: "en_direct",
    auditeurs: 1284
  };

  /* --- CATEGORIES --- */
  const categories = [
    { id: 1, nom: "Culture", slug: "culture", description: "Arts, société et grands débats contemporains.", statut: "active", icone: "book" },
    { id: 2, nom: "Musique", slug: "musique", description: "Artistes, sons et industrie musicale.", statut: "active", icone: "music" },
    { id: 3, nom: "Santé", slug: "sante", description: "Bien-être, prévention et conseils santé.", statut: "active", icone: "heart" },
    { id: 4, nom: "Éducation", slug: "education", description: "École, jeunesse et apprentissage.", statut: "active", icone: "cap" },
    { id: 5, nom: "Société", slug: "societe", description: "Vie quotidienne, matinales et actualité locale.", statut: "active", icone: "users" },
    { id: 6, nom: "Sport", slug: "sport", description: "Football, athlétisme et grands rendez-vous sportifs.", statut: "active", icone: "ball" }
  ];

  /* --- EMISSIONS --- */
  const emissions = [
    {
      id: 1, nom: "Les Ateliers de la Culture", slug: "ateliers-de-la-culture",
      categorie: "Culture", animateur: "Eba Doris", diffusion: "Mardi 12h00",
      image: IMG + "emission-culture.jpg",
      description: "Une émission de réflexion portée sur les grands sujets du monde contemporain, dédiée aux intellectuels et universitaires.",
      statut: "publié"
    },
    {
      id: 2, nom: "Gossip Star", slug: "gossip-star",
      categorie: "Musique", animateur: "Ange A. Koffi & Sanogo Alima", diffusion: "Jeudi & Samedi 10h00",
      image: IMG + "emission-music.jpg",
      description: "Émission musicale dédiée à la promotion des artistes et aux acteurs de l'industrie musicale d'ici et d'ailleurs.",
      statut: "publié"
    },
    {
      id: 3, nom: "Mag' Santé", slug: "mag-sante",
      categorie: "Santé", animateur: "Barthelemy Koné", diffusion: "Vendredi 15h00",
      image: IMG + "emission-sante.jpg",
      description: "Magazine de santé hebdomadaire qui sensibilise, informe et partage des astuces de santé avec la population pour son bien-être.",
      statut: "publié"
    },
    {
      id: 4, nom: "Virée Scolaire", slug: "viree-scolaire",
      categorie: "Éducation", animateur: "Namizata", diffusion: "Jeudi 13h00",
      image: IMG + "emission-scolaire.jpg",
      description: "Émission dédiée aux élèves afin de les familiariser au monde de la radio, avec des jeux scolaires et du divertissement.",
      statut: "publié"
    },
    {
      id: 5, nom: "Les Matins chez nous", slug: "matins-chez-nous",
      categorie: "Société", animateur: "Prospersensus & KS Caméléon", diffusion: "Lundi au Vendredi 07h00",
      image: IMG + "emission-matin.jpg",
      description: "La matinale de la radio : le matin du bonheur et de la bonne humeur, entre sujets sérieux et divertissants.",
      statut: "publié"
    },
    {
      id: 6, nom: "Parlons Sport", slug: "parlons-sport",
      categorie: "Sport", animateur: "Ibrahim Traoré", diffusion: "Samedi 18h00",
      image: IMG + "emission-sport.jpg",
      description: "Le rendez-vous sportif de GBÊKÊ FM : résultats, analyses et portraits des acteurs du sport ivoirien.",
      statut: "publié"
    }
  ];

  /* --- PODCASTS --- */
  const podcasts = [
    { id: 1, titre: "La jeunesse africaine face au défi de l'IA", emissionId: 1, emission: "Les Ateliers de la Culture", categorie: "Culture", createur: "Eba Doris", duree: "42:18", dureeSec: 2538, date: "2025-09-30", image: IMG + "emission-culture.jpg", audio: "assets/audio/podcast-1.mp3", description: "Nous recevons trois universitaires pour débattre de l'impact de l'intelligence artificielle sur l'emploi et la formation des jeunes en Afrique de l'Ouest.", statut: "publié", ecoute: 1842, telechargements: 412 },
    { id: 2, titre: "Décoloniser les savoirs : quels manuels pour demain ?", emissionId: 1, emission: "Les Ateliers de la Culture", categorie: "Culture", createur: "Eba Doris", duree: "38:05", dureeSec: 2285, date: "2025-09-23", image: IMG + "emission-culture.jpg", audio: "assets/audio/podcast-1.mp3", description: "Comment repenser les programmes scolaires à la lumière des savoirs endogènes africains.", statut: "publié", ecoute: 1210, telechargements: 287 },
    { id: 3, titre: "Gossip Star : le nouvel album de Koffi Gbêkê", emissionId: 2, emission: "Gossip Star", categorie: "Musique", createur: "Ange A. Koffi", duree: "51:40", dureeSec: 3100, date: "2025-10-02", image: IMG + "emission-music.jpg", audio: "assets/audio/podcast-2.mp3", description: "Rencontre exclusive avec l'artiste et écoute en avant-première de son nouvel opus.", statut: "publié", ecoute: 3560, telechargements: 980 },
    { id: 4, titre: "L'industrie du disque en Côte d'Ivoire", emissionId: 2, emission: "Gossip Star", categorie: "Musique", createur: "Sanogo Alima", duree: "44:12", dureeSec: 2652, date: "2025-09-26", image: IMG + "emission-music.jpg", audio: "assets/audio/podcast-2.mp3", description: "Producteurs et managers décryptent les défis de la distribution musicale locale.", statut: "publié", ecoute: 2210, telechargements: 640 },
    { id: 5, titre: "Paludisme : prévenir plutôt que guérir", emissionId: 3, emission: "Mag' Santé", categorie: "Santé", createur: "Barthelemy Koné", duree: "33:27", dureeSec: 2007, date: "2025-10-03", image: IMG + "emission-sante.jpg", audio: "assets/audio/podcast-3.mp3", description: "Un médecin épidémiologiste répond aux questions les plus fréquentes sur la prévention du paludisme.", statut: "publié", ecoute: 2980, telechargements: 1120 },
    { id: 6, titre: "Nutrition et rentrée scolaire", emissionId: 3, emission: "Mag' Santé", categorie: "Santé", createur: "Barthelemy Koné", duree: "29:51", dureeSec: 1791, date: "2025-09-19", image: IMG + "emission-sante.jpg", audio: "assets/audio/podcast-3.mp3", description: "Comment composer des repas équilibrés pour les enfants à l'école.", statut: "publié", ecoute: 1450, telechargements: 470 },
    { id: 7, titre: "Virée Scolaire : concours d'éloquence au lycée", emissionId: 4, emission: "Virée Scolaire", categorie: "Éducation", createur: "Namizata", duree: "36:44", dureeSec: 2204, date: "2025-10-01", image: IMG + "emission-scolaire.jpg", audio: "assets/audio/podcast-1.mp3", description: "Retour sur le concours d'éloquence qui a réuni dix établissements de Bouaké.", statut: "publié", ecoute: 980, telechargements: 210 },
    { id: 8, titre: "Les métiers de la radio expliqués aux élèves", emissionId: 4, emission: "Virée Scolaire", categorie: "Éducation", createur: "Namizata", duree: "31:09", dureeSec: 1869, date: "2025-09-24", image: IMG + "emission-scolaire.jpg", audio: "assets/audio/podcast-1.mp3", description: "Technicien, journaliste, animateur : les coulisses du métier racontées aux jeunes.", statut: "publié", ecoute: 760, telechargements: 155 },
    { id: 9, titre: "La matinale du 6 octobre", emissionId: 5, emission: "Les Matins chez nous", categorie: "Société", createur: "Prospersensus", duree: "58:30", dureeSec: 3510, date: "2025-10-06", image: IMG + "emission-matin.jpg", audio: "assets/audio/podcast-1.mp3", description: "Revue de presse, invités du jour et bonne humeur au programme de ce lundi.", statut: "publié", ecoute: 4120, telechargements: 720 },
    { id: 10, titre: "Transports urbains à Bouaké : l'état des lieux", emissionId: 5, emission: "Les Matins chez nous", categorie: "Société", createur: "KS Caméléon", duree: "47:22", dureeSec: 2842, date: "2025-10-02", image: IMG + "emission-matin.jpg", audio: "assets/audio/podcast-1.mp3", description: "Débat avec les autorités et les usagers sur la mobilité en ville.", statut: "publié", ecoute: 2360, telechargements: 480 },
    { id: 11, titre: "Parlons Sport : les Éléphants préparent la CAN", emissionId: 6, emission: "Parlons Sport", categorie: "Sport", createur: "Ibrahim Traoré", duree: "45:15", dureeSec: 2715, date: "2025-10-04", image: IMG + "emission-sport.jpg", audio: "assets/audio/podcast-2.mp3", description: "Analyse de la préparation de la sélection nationale et des chances de qualification.", statut: "publié", ecoute: 5240, telechargements: 1310 },
    { id: 12, titre: "Le sport féminin en plein essor", emissionId: 6, emission: "Parlons Sport", categorie: "Sport", createur: "Ibrahim Traoré", duree: "40:02", dureeSec: 2402, date: "2025-09-27", image: IMG + "emission-sport.jpg", audio: "assets/audio/podcast-2.mp3", description: "Portrait de sportives ivoiriennes et des défis de la pratique au féminin.", statut: "publié", ecoute: 1680, telechargements: 390 },
    { id: 13, titre: "À la une : édition spéciale rentrée culturelle", emissionId: 1, emission: "Les Ateliers de la Culture", categorie: "Culture", createur: "Eba Doris", duree: "26:33", dureeSec: 1593, date: "2025-09-16", image: IMG + "emission-culture.jpg", audio: "assets/audio/podcast-1.mp3", description: "Tour d'horizon des rendez-vous culturels de la saison à Bouaké et Abidjan.", statut: "brouillon", ecoute: 0, telechargements: 0 }
  ];

  /* --- ARTICLES --- */
  const articles = [
    { id: 1, titre: "GBÊKÊ FM, premier média ivoirien certifié JTI à la norme CWA 17493", resume: "La radio de Bouaké franchit une étape historique en obtenant la certification internationale JTI.", contenu: "<p>GBÊKÊ FM devient le premier média de Côte d'Ivoire à être certifié selon le programme JTI et la norme CWA 17493, accrédité par le SOAC selon ISO/IEC 17065:2012. Une reconnaissance qui consacre des années d'engagement pour une information de qualité.</p><p>Cette certification atteste de la fiabilité des processus éditoriaux, de la transparence et du respect des standards internationaux en matière de journalisme.</p><blockquote>« C'est une fierté pour toute l'équipe et pour la région du Gbêkê. Nous continuerons à informer avec rigueur et proximité », a déclaré la direction.</blockquote>", image: IMG + "article-1.jpg", categorie: "Société", auteur: "Rédaction GBÊKÊ FM", date: "2025-10-05", statut: "publié", vues: 3420 },
    { id: 2, titre: "Gestion des plaintes et réclamations : la radio se dote d'un dispositif", resume: "GBÊKÊ FM met en place un mécanisme transparent de traitement des plaintes de son audience.", contenu: "<p>Soucieuse de la qualité de la relation avec son public, GBÊKÊ FM annonce la mise en place d'un dispositif de gestion des plaintes et réclamations, accessible à tous les auditeurs.</p><p>Le mécanisme prévoit l'enregistrement de chaque requête, un accusé de réception et un délai de traitement défini. Un rapport trimestriel sera publié pour garantir la transparence.</p>", image: IMG + "article-2.jpg", categorie: "Société", auteur: "Service Client", date: "2025-09-28", statut: "publié", vues: 1870 },
    { id: 3, titre: "Votre radio filmée est là : découvrez nos émissions en vidéo", resume: "Les émissions phares de GBÊKÊ FM sont désormais disponibles en version filmée.", contenu: "<p>GBÊKÊ FM passe à la vidéo ! Vos émissions préférées sont désormais filmées et diffusées sur nos plateformes numériques. Une expérience immersive qui rapproche encore davantage la radio de son public.</p><p>Retrouvez les coulisses des studios, les interviews en images et les moments forts de la matinale.</p>", image: IMG + "article-3.jpg", categorie: "Musique", auteur: "Rédaction GBÊKÊ FM", date: "2025-09-20", statut: "publié", vues: 2560 },
    { id: 4, titre: "Écoutez-nous à travers le monde entier", resume: "Grâce au streaming en ligne, GBÊKÊ FM est accessible partout sur la planète.", contenu: "<p>De Bouaké à Montréal, de Paris à Abidjan, des milliers d'auditeurs se connectent chaque jour pour écouter GBÊKÊ FM en direct. Le streaming en ligne abolit les frontières et rassemble la diaspora autour de sa radio.</p><p>Un simple clic suffit désormais pour rejoindre la communauté GBÊKÊ FM, où que vous soyez dans le monde.</p>", image: IMG + "emission-matin.jpg", categorie: "Société", auteur: "Rédaction GBÊKÊ FM", date: "2025-09-12", statut: "publié", vues: 1980 },
    { id: 5, titre: "Retour en images sur la rentrée des classes à Bouaké", resume: "Reportage dans les établissements de la ville pour la rentrée scolaire.", contenu: "<p>Notre équipe s'est rendue dans plusieurs écoles de Bouaké pour recueillir les impressions des élèves, des parents et des enseignants à l'occasion de la rentrée.</p><p>Entre enthousiasme et défis matériels, la rentrée 2025 s'annonce riche en émotions.</p>", image: IMG + "emission-scolaire.jpg", categorie: "Éducation", auteur: "Namizata", date: "2025-09-15", statut: "brouillon", vues: 0 },
    { id: 6, titre: "Mag' Santé : cinq habitudes pour rester en forme", resume: "Nos experts partagent leurs conseils pour une meilleure hygiène de vie.", contenu: "<p>Bien dormir, manger équilibré, bouger régulièrement, s'hydrater et gérer son stress : cinq habitudes simples qui changent la vie.</p><p>Dans cet article, l'équipe de Mag' Santé détaille chaque conseil avec des exemples concrets adaptés au quotidien ivoirien.</p>", image: IMG + "emission-sante.jpg", categorie: "Santé", auteur: "Barthelemy Koné", date: "2025-10-01", statut: "publié", vues: 2210 }
  ];

  /* --- MESSAGES (admin) --- */
  const messages = [
    { id: 1, nom: "Aïcha Koné", email: "aicha.kone@email.ci", sujet: "Demande d'interview", message: "Bonjour, je souhaiterais proposer une interview d'un artiste local dans Gossip Star.", statut: "non_lu", date: "2025-10-06 09:12" },
    { id: 2, nom: "Moussa Diarra", email: "m.diarra@email.ci", sujet: "Publicité", message: "Nous souhaitons diffuser un spot publicitaire pour notre commerce. Quels sont vos tarifs ?", statut: "lu", date: "2025-10-05 16:40" },
    { id: 3, nom: "Fatou Traoré", email: "fatou.t@email.ci", sujet: "Remerciements", message: "Merci pour l'émission Mag' Santé, elle m'aide beaucoup. Continuez ainsi !", statut: "traite", date: "2025-10-04 11:05" },
    { id: 4, nom: "Yao Kouassi", email: "yao.k@email.ci", sujet: "Partenariat scolaire", message: "Notre établissement aimerait participer à Virée Scolaire.", statut: "non_lu", date: "2025-10-06 08:30" },
    { id: 5, nom: "Anonymous", email: "auditeur@email.ci", sujet: "Problème de flux", message: "Le direct coupe parfois sur mon téléphone. Est-ce normal ?", statut: "archive", date: "2025-09-29 20:15" }
  ];

  /* --- UTILISATEURS (admin) --- */
  const utilisateurs = [
    { id: 1, nom: "Koné", prenom: "Amadou", email: "amadou.kone@gbekefm.com", role: "Administrateur", statut: "actif", date: "2024-01-10" },
    { id: 2, nom: "Bamba", prenom: "Awa", email: "awa.bamba@gbekefm.com", role: "Administrateur", statut: "actif", date: "2024-03-22" },
    { id: 3, nom: "Traoré", prenom: "Ibrahim", email: "ibrahim.traore@gbekefm.com", role: "Administrateur", statut: "actif", date: "2024-05-04" },
    { id: 4, nom: "Sanogo", prenom: "Alima", email: "alima.sanogo@gbekefm.com", role: "Animateur", statut: "actif", date: "2024-06-18" },
    { id: 5, nom: "Dosso", prenom: "Yacouba", email: "y.dosso@email.ci", role: "Utilisateur", statut: "inactif", date: "2025-02-11" },
    { id: 6, nom: "Coulibaly", prenom: "Mariam", email: "m.coulibaly@email.ci", role: "Utilisateur", statut: "bloqué", date: "2025-07-30" }
  ];

  /* --- COMPTES (authentification) ---
     Mots de passe volontairement simples à retenir mais robustes :
     13+ caractères mêlant majuscules, minuscules, chiffres et symboles.
     ⚠️ En production Laravel : stocker un hachage (bcrypt/argon2), jamais en clair. */
  const comptes = [
    /* --- 3 vrais administrateurs --- */
    { id: 1, prenom: "Amadou", nom: "Koné", email: "amadou.kone@gbekefm.com", password: "GbekeBouake!105", role: "Administrateur", demo: false },
    { id: 2, prenom: "Awa", nom: "Bamba", email: "awa.bamba@gbekefm.com", password: "RadioGbeke#2025", role: "Administrateur", demo: false },
    { id: 3, prenom: "Ibrahim", nom: "Traoré", email: "ibrahim.traore@gbekefm.com", password: "StudioGbeke@247", role: "Administrateur", demo: false },
    /* --- Comptes de démonstration (à supprimer) --- */
    { id: 4, prenom: "Démo", nom: "Admin", email: "demo.admin@gbekefm.com", password: "DemoAdmin#2025", role: "Administrateur", demo: true },
    { id: 5, prenom: "Démo", nom: "Auditeur", email: "demo.auditeur@email.ci", password: "DemoAuditeur#2025", role: "Utilisateur", demo: true }
  ];

  const roles = [
    { id: 1, nom: "Administrateur", utilisateurs: 3, description: "Accès complet à toutes les fonctionnalités.", permissions: 9 },
    { id: 2, nom: "Éditeur", utilisateurs: 0, description: "Gestion des contenus éditoriaux.", permissions: 6 },
    { id: 3, nom: "Animateur", utilisateurs: 1, description: "Gestion de ses propres émissions et podcasts.", permissions: 3 },
    { id: 4, nom: "Utilisateur", utilisateurs: 2, description: "Compte public avec favoris et historique.", permissions: 0 }
  ];

  const permissions = [
    "Gérer les utilisateurs", "Gérer les rôles", "Gérer les émissions", "Gérer les podcasts",
    "Gérer les articles", "Gérer les catégories", "Gérer les messages", "Gérer la radio", "Voir les statistiques"
  ];

  /* --- STATS (dashboard) --- */
  const stats = {
    visiteurs: 18420, utilisateurs: 1340, ecoutes: 41280, telechargements: 9860,
    emissions: emissions.length, podcasts: podcasts.length, articles: articles.length,
    messages: messages.length, auditeursLive: radio.auditeurs
  };

  const visitsSeries = [820, 940, 1120, 980, 1340, 1520, 1410, 1680, 1820, 1740, 1960, 2120, 2040, 2260];
  const listensSeries = [1200, 1450, 1680, 1520, 1980, 2210, 2050, 2480, 2720, 2610, 2940, 3180, 3020, 3420];

  /* --- Helpers --- */
  const byEmission = (id) => podcasts.filter((p) => p.emissionId === Number(id));
  const emissionById = (id) => emissions.find((e) => e.id === Number(id));
  const podcastById = (id) => podcasts.find((p) => p.id === Number(id));
  const articleById = (id) => articles.find((a) => a.id === Number(id));
  const publishedPodcasts = () => podcasts.filter((p) => p.statut === "publié");
  const publishedArticles = () => articles.filter((a) => a.statut === "publié");
  const topPodcasts = (n = 5) => [...podcasts].filter(p => p.statut === "publié").sort((a, b) => b.ecoute - a.ecoute).slice(0, n);
  const recentPodcasts = (n = 8) => [...podcasts].filter(p => p.statut === "publié").sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, n);

  const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const fmtDateShort = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  const fmtNum = (n) => n.toLocaleString("fr-FR");

  /* Authentifie un compte à partir de l'e-mail et du mot de passe (démo front-end). */
  const auth = (email, password) => {
    if (!email || !password) return null;
    const e = String(email).trim().toLowerCase();
    const c = comptes.find((x) => x.email.toLowerCase() === e && x.password === password);
    if (!c) return null;
    return { id: c.id, prenom: c.prenom, nom: c.nom, email: c.email, role: c.role, demo: c.demo };
  };

  return {
    radio, categories, emissions, podcasts, articles, messages, utilisateurs, comptes, roles, permissions,
    stats, visitsSeries, listensSeries,
    byEmission, emissionById, podcastById, articleById, publishedPodcasts, publishedArticles,
    topPodcasts, recentPodcasts, fmtDate, fmtDateShort, fmtNum, auth
  };
})();

/* Expose sur window pour les modules (admin.js, scripts inline) */
if (typeof window !== "undefined") { window.GBEKE = GBEKE; }
