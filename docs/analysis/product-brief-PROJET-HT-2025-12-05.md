---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
workflowType: 'product-brief'
lastStep: 6
status: complete
project_name: 'PROJET-HT'
user_name: 'Toky'
date: '2025-12-05'
---

# Product Brief: PROJET-HT

**Date:** 2025-12-05
**Author:** Toky

---

## Executive Summary

**PROJET-HT** est une interface web minimaliste de suivi de préparation de mariage, conçue pour les couples qui veulent une visibilité claire et instantanée sur leur avancement et leur budget.

Contrairement aux applications existantes surchargées de fonctionnalités (gestion d'invités, marketplace de prestataires, registres cadeaux), PROJET-HT se concentre sur l'essentiel : **la gestion des tâches avec impact budgétaire en temps réel**.

Chaque tâche terminée met à jour instantanément le dashboard avec les indicateurs financiers et de progression - sans complexité, sans distraction.

---

## Core Vision

### Problem Statement

Organiser un mariage implique de gérer de nombreuses tâches avec un budget conséquent. Les couples ont besoin de :
- Suivre l'avancement des préparatifs
- Contrôler les dépenses (estimatif vs réel)
- Avoir une vision claire de où en est le projet

### Problem Impact

Sans outil adapté, les couples risquent de :
- Perdre le fil des tâches à accomplir
- Dépasser leur budget sans s'en rendre compte
- Ne pas avoir de visibilité sur la progression globale
- Être stressés par le manque de contrôle

### Why Existing Solutions Fall Short

| Solution existante | Problème |
|-------------------|----------|
| The Knot, Zola, WeddingWire | Trop de fonctionnalités inutiles, interface complexe, publicités |
| Mariages.net, Bridebook | Orienté marketplace prestataires, pas de dashboard dynamique |
| Excel / Google Sheets | Pas de mise à jour visuelle instantanée, fastidieux |
| MyWed | Mobile uniquement, notifications non désirées |

**Le vrai problème :** Aucune solution ne propose un **dashboard qui réagit instantanément** à chaque avancement de tâche avec un impact visuel sur le budget.

### Proposed Solution

Une interface web Flask + Tailwind CSS avec :

**1. Gestion des Tâches par Catégories (Thèmes)**
- Chaque tâche : nom, prix estimatif, prix réel, statut, assignation, commentaires
- Catégories : Réception, Cérémonie, Tenues, Prestataires, Décoration, Administratif, Logistique
- Modification en un clic (inline editing)

**2. Dashboard Dynamique et Parlant**
- **Compte à rebours J-XX** : motivation visuelle jusqu'au grand jour
- **Budget global** : fixé vs dépensé vs restant (mise à jour instantanée)
- **Budget par catégorie** : graphique camembert de répartition
- **Objectifs spécifiques** : barres de progression par thème
- **Avancement global** : pourcentage avec jauge visuelle

**3. Impact Temps Réel**
- Cocher une tâche = mise à jour immédiate du dashboard
- Modifier un prix réel = recalcul instantané du budget
- Visuel qui parle : vert → orange → rouge selon consommation

### Key Differentiators

| Notre avantage | Ce que ça apporte |
|----------------|-------------------|
| **Dashboard dynamique temps réel** | Voir l'impact de chaque action instantanément |
| **Compte à rebours J-XX** | Motivation et pression positive |
| **Interface minimaliste** | Pas de distraction, focus sur l'essentiel |
| **Modification en un clic** | Rapidité, pas de formulaires complexes |
| **Budget lié aux tâches** | Chaque tâche = impact financier visible |
| **Objectifs par catégorie** | Vision claire de la progression par thème |
| **Pas d'authentification** | Accès immédiat, simplicité maximale |
| **UI moderne Tailwind** | Belle interface attractive et responsive |

---

## Target Users

### Primary Users

**Persona 1 : Toky - Le Marié Organisé**

| Attribut | Description |
|----------|-------------|
| **Profil** | Personne organisée, à l'aise avec la technologie |
| **Contexte** | Prépare son mariage prévu le 14 mars |
| **Motivation** | Centraliser toutes les tâches et avoir une vision claire de l'avancement et du budget |
| **Frustration actuelle** | Informations dispersées, pas de vue d'ensemble dynamique |
| **Besoin principal** | Voir instantanément l'impact de chaque tâche terminée sur le budget et l'avancement |
| **Appareil** | PC / Navigateur web |

**Persona 2 : Partenaire de Toky - La Mariée Organisée**

| Attribut | Description |
|----------|-------------|
| **Profil** | Personne organisée, collaborative |
| **Contexte** | Co-organise le mariage avec Toky |
| **Motivation** | Partager la charge de travail et suivre les tâches assignées |
| **Frustration actuelle** | Difficile de savoir qui fait quoi et où on en est globalement |
| **Besoin principal** | Pouvoir s'assigner des tâches et voir la progression commune |
| **Appareil** | PC / Navigateur web |

### Mode de Collaboration

- **Accès partagé** : Les deux utilisateurs accèdent à la même interface sans authentification
- **Auto-assignation** : Chacun peut s'assigner ou assigner des tâches à l'autre
- **Vision commune** : Dashboard partagé avec la même vue pour les deux
- **Responsabilité claire** : Chaque tâche indique qui en est responsable

### Secondary Users

N/A - Application dédiée uniquement au couple. Pas d'autres utilisateurs prévus.

### User Journey

**1. Découverte & Premier accès**
- Le couple accède à l'URL de l'application
- Pas de login, accès direct au dashboard
- Interface immédiatement compréhensible

**2. Configuration initiale**
- Définir la date du mariage (14 mars) → active le compte à rebours J-XX
- Définir le budget total fixé
- Les deux partenaires sont pré-configurés pour l'assignation

**3. Utilisation quotidienne**
- Ajouter des tâches par catégorie (Réception, Cérémonie, etc.)
- S'assigner ou assigner des tâches au partenaire
- Renseigner prix estimatif
- Quand une tâche est terminée : cocher + renseigner prix réel
- **Moment "Aha!"** : Voir le dashboard se mettre à jour instantanément

**4. Suivi régulier**
- Consulter le dashboard ensemble ou séparément
- Voir la progression par catégorie
- Surveiller le budget restant
- Motivation avec le compte à rebours J-XX

**5. Valeur long-terme**
- Source unique de vérité pour les deux
- Historique complet des dépenses
- Tranquillité d'esprit : tout est sous contrôle

---

## Success Metrics

### Métriques de Succès Utilisateur

Ce projet étant un outil personnel pour la préparation du mariage de Toky et son partenaire, les métriques de succès sont purement fonctionnelles.

**Critères de succès fonctionnels :**

| Fonctionnalité | Critère de succès |
|----------------|-------------------|
| **Création de tâches** | Pouvoir ajouter une tâche en moins de 10 secondes |
| **Changement de statut** | Modifier le statut en un seul clic |
| **Gestion des prix** | Saisir/modifier prix estimatif et réel facilement |
| **Assignation** | Attribuer une tâche à Toky ou Partenaire en un clic |
| **Dashboard dynamique** | Mise à jour instantanée après chaque modification |
| **Compte à rebours** | Affichage clair de J-XX jusqu'au 14 mars |
| **Progression par catégorie** | Barres visuelles montrant l'avancement par thème |
| **Budget temps réel** | Voir immédiatement l'impact financier de chaque tâche terminée |

**Indicateurs de succès du projet mariage :**

| Indicateur | Objectif |
|------------|----------|
| **Avancement global** | 100% des tâches terminées avant J-7 |
| **Budget respecté** | Dépenses réelles ≤ Budget fixé (ou écart maîtrisé) |
| **Répartition équilibrée** | Tâches bien réparties entre les deux partenaires |
| **Visibilité complète** | Aucune tâche oubliée, tout est centralisé |

### Business Objectives

N/A - Projet personnel sans objectif commercial.

### Key Performance Indicators

N/A - Pas de KPIs business. Les seuls indicateurs sont les métriques fonctionnelles et de succès du projet mariage ci-dessus.

---

## MVP Scope

### Core Features

**1. Dashboard Dynamique**

| Composant | Description |
|-----------|-------------|
| **Compte à rebours J-XX** | Affiche le nombre de jours jusqu'au mariage (date modifiable) |
| **Carte Budget Fixé** | Montant total alloué au mariage (modifiable) |
| **Carte Budget Dépensé** | Somme des prix réels des tâches terminées (calcul auto) |
| **Carte Budget Restant** | Budget fixé - Dépensé (calcul auto) |
| **Graphique Camembert** | Répartition des dépenses par catégorie |
| **Barres de Progression** | Avancement par catégorie (% tâches terminées) |
| **Carte Top Dépense** | Affiche la tâche avec le prix réel le plus élevé |

**2. Gestion des Tâches (Cartes interactives)**

| Champ | Type | Description |
|-------|------|-------------|
| Nom | Texte | Nom de la tâche (ex: "Traiteur", "DJ") |
| Catégorie | Sélecteur | Réception, Cérémonie, Tenues, Prestataires, Décoration, Administratif, Logistique |
| Prix estimatif | Nombre | Budget prévu pour cette tâche |
| Prix réel | Nombre | Coût final (renseigné quand terminé) |
| Statut | Bouton toggle | En cours / Terminé |
| Assigné à | Sélecteur | Toky / Partenaire |
| Commentaires | Texte | Notes libres |

**Actions sur les cartes :**
- Bouton changement de statut en 1 clic
- Modification inline des prix (estimatif/réel)
- Édition des commentaires
- Suppression de tâche

**3. Configuration**

| Paramètre | Modifiable | Par défaut |
|-----------|------------|------------|
| Date du mariage | ✅ Oui | 14 mars |
| Budget total fixé | ✅ Oui | À définir |
| Nom partenaire 1 | ✅ Oui | Toky |
| Nom partenaire 2 | ✅ Oui | Partenaire |

**4. Stack Technique**

| Composant | Technologie |
|-----------|-------------|
| Backend | Flask (Python) |
| Frontend | Tailwind CSS |
| Base de données | SQLite |
| Déploiement | Vercel |
| Graphiques | Chart.js ou équivalent |

### Out of Scope for MVP

| Fonctionnalité | Raison du report |
|----------------|------------------|
| Authentification / Login | Pas nécessaire pour usage personnel |
| Dark mode | Nice-to-have, pas essentiel |
| Export PDF / Excel | Peut attendre V2 |
| Notifications / Rappels | Non souhaité par l'utilisateur |
| Gestion des invités | Hors périmètre du projet |
| Filtres avancés | Simplicité prioritaire |
| Application mobile | PC/navigateur uniquement |

### MVP Success Criteria

| Critère | Validation |
|---------|------------|
| Création de tâche | < 10 secondes |
| Changement de statut | 1 clic |
| Mise à jour dashboard | Instantanée après modification |
| Interface | Jolie, moderne, intuitive |
| Déploiement | Accessible sur Vercel |

### Future Vision

**V2 - Améliorations potentielles :**
- Dark mode
- Export PDF du récapitulatif
- Filtres et tri des tâches
- Historique des modifications
- Mode mobile optimisé

**Note :** Ce projet étant personnel, la V2 sera développée selon les besoins ressentis pendant l'utilisation.

---
