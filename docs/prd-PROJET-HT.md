---
status: complete
project_name: 'PROJET-HT'
user_name: 'Toky'
date: '2025-12-05'
based_on: 'docs/analysis/product-brief-PROJET-HT-2025-12-05.md'
---

# Product Requirements Document - PROJET-HT

**Author:** Toky
**Date:** 2025-12-05
**Version:** 1.0

---

## 1. Introduction

### 1.1 Objectif du Document
Ce PRD définit les spécifications détaillées pour **PROJET-HT**, une interface web de suivi de préparation de mariage avec gestion dynamique du budget.

### 1.2 Contexte
Toky et son partenaire préparent leur mariage prévu le **14 mars**. Ils ont besoin d'un outil centralisé pour :
- Gérer les tâches de préparation
- Suivre le budget en temps réel
- Visualiser l'avancement global

### 1.3 Stack Technique
| Composant | Technologie |
|-----------|-------------|
| Backend | Flask (Python) |
| Frontend | Tailwind CSS |
| Base de données | SQLite |
| Graphiques | Chart.js |
| Déploiement | Vercel |

---

## 2. Utilisateurs

### 2.1 Utilisateurs Cibles
- **Toky** - Marié, organisé, à l'aise avec la technologie
- **Partenaire** - Mariée, organisée, collaborative

### 2.2 Mode d'Accès
- Pas d'authentification requise
- Accès direct via URL
- Utilisation sur PC / navigateur web

---

## 3. Fonctionnalités

### 3.1 Dashboard (Page Principale)

#### 3.1.1 En-tête
| Élément | Spécification |
|---------|---------------|
| **Titre** | "Notre Mariage" ou personnalisable |
| **Compte à rebours** | Affiche "J-XX" (jours restants jusqu'au mariage) |
| **Date mariage** | Modifiable, par défaut 14 mars 2026 |

#### 3.1.2 Cartes Budget (3 cartes)
| Carte | Calcul | Couleur |
|-------|--------|---------|
| **Budget Fixé** | Valeur saisie manuellement | Bleu |
| **Dépensé** | Somme des prix_reel des tâches terminées | Orange/Rouge selon % |
| **Restant** | Budget Fixé - Dépensé | Vert si > 20%, Orange si 10-20%, Rouge si < 10% |

#### 3.1.3 Carte Top Dépense
- Affiche la tâche avec le **prix réel le plus élevé**
- Nom de la tâche + montant
- Catégorie associée

#### 3.1.4 Graphique Camembert
- Répartition des dépenses par catégorie
- Légende avec pourcentages
- Couleurs distinctes par catégorie
- Mise à jour dynamique

#### 3.1.5 Barres de Progression par Catégorie
| Catégorie | Icône | Couleur suggérée |
|-----------|-------|------------------|
| Réception | 🍽️ | Orange |
| Cérémonie | 💒 | Violet |
| Tenues & Beauté | 👗 | Rose |
| Prestataires | 📸 | Bleu |
| Décoration | 🎨 | Vert |
| Administratif | 📄 | Gris |
| Logistique | 🚗 | Jaune |

Calcul : `(Tâches terminées dans catégorie / Total tâches dans catégorie) * 100`

---

### 3.2 Gestion des Tâches

#### 3.2.1 Structure d'une Tâche (Modèle de données)
```
Task {
    id: Integer (auto-increment)
    nom: String (required, max 100 chars)
    categorie: Enum (voir liste ci-dessus)
    prix_estimatif: Decimal (default 0)
    prix_reel: Decimal (default 0)
    statut: Boolean (false = En cours, true = Terminé)
    assigne_a: Enum ('Toky', 'Partenaire')
    commentaires: Text (optional)
    created_at: DateTime
    updated_at: DateTime
}
```

#### 3.2.2 Affichage des Tâches (Cartes)
Chaque tâche s'affiche comme une **carte interactive** contenant :
- Nom de la tâche (titre)
- Badge catégorie (avec icône et couleur)
- Prix estimatif / Prix réel
- Indicateur de statut (toggle visuel)
- Nom de la personne assignée
- Bouton d'édition / suppression
- Zone commentaires (expandable)

#### 3.2.3 Actions sur les Tâches
| Action | Interaction | Effet |
|--------|-------------|-------|
| **Changer statut** | Clic sur toggle | Bascule En cours ↔ Terminé, met à jour dashboard |
| **Modifier prix estimatif** | Clic sur valeur → input inline | Sauvegarde auto |
| **Modifier prix réel** | Clic sur valeur → input inline | Sauvegarde auto, recalcul budget |
| **Modifier assignation** | Clic sur nom → dropdown | Sauvegarde auto |
| **Éditer commentaires** | Clic sur zone → textarea | Sauvegarde auto |
| **Supprimer tâche** | Bouton supprimer → confirmation | Supprime et recalcule |

#### 3.2.4 Ajout de Tâche
- Bouton "+" ou "Nouvelle tâche" visible
- Formulaire modal ou inline :
  - Nom (required)
  - Catégorie (dropdown)
  - Prix estimatif
  - Assigné à (dropdown : Toky / Partenaire)
- Bouton "Ajouter"

---

### 3.3 Configuration

#### 3.3.1 Paramètres Modifiables
| Paramètre | Type | Valeur par défaut |
|-----------|------|-------------------|
| Date du mariage | Date | 2026-03-14 |
| Budget total | Decimal | 0 |
| Nom partenaire 1 | String | "Toky" |
| Nom partenaire 2 | String | "Partenaire" |

#### 3.3.2 Accès Configuration
- Icône engrenage ⚙️ dans le header
- Modal ou page dédiée
- Sauvegarde immédiate

---

## 4. Spécifications Techniques

### 4.1 Architecture

```
projet-ht/
├── app.py                 # Application Flask principale
├── models.py              # Modèles SQLAlchemy
├── templates/
│   ├── base.html          # Template de base
│   ├── index.html         # Dashboard principal
│   └── components/
│       ├── task_card.html # Composant carte tâche
│       ├── budget_card.html
│       └── progress_bar.html
├── static/
│   ├── css/
│   │   └── output.css     # Tailwind compilé
│   └── js/
│       └── app.js         # Interactions JS
├── database.db            # SQLite
├── requirements.txt
├── tailwind.config.js
└── vercel.json            # Config déploiement
```

### 4.2 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Dashboard principal |
| GET | `/api/tasks` | Liste toutes les tâches |
| POST | `/api/tasks` | Crée une nouvelle tâche |
| PUT | `/api/tasks/<id>` | Met à jour une tâche |
| DELETE | `/api/tasks/<id>` | Supprime une tâche |
| GET | `/api/config` | Récupère la configuration |
| PUT | `/api/config` | Met à jour la configuration |
| GET | `/api/stats` | Statistiques pour dashboard |

### 4.3 Réponses API

#### GET /api/stats
```json
{
    "budget_fixe": 15000,
    "budget_depense": 8500,
    "budget_restant": 6500,
    "pourcentage_depense": 56.7,
    "jours_restants": 99,
    "taches_total": 20,
    "taches_terminees": 12,
    "pourcentage_avancement": 60,
    "top_depense": {
        "nom": "Traiteur",
        "prix_reel": 3500,
        "categorie": "Réception"
    },
    "par_categorie": {
        "Réception": {"total": 5, "terminees": 3, "depense": 4500},
        "Cérémonie": {"total": 3, "terminees": 3, "depense": 1200},
        ...
    }
}
```

### 4.4 Base de Données

#### Table: tasks
| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| nom | VARCHAR(100) | NOT NULL |
| categorie | VARCHAR(50) | NOT NULL |
| prix_estimatif | DECIMAL(10,2) | DEFAULT 0 |
| prix_reel | DECIMAL(10,2) | DEFAULT 0 |
| statut | BOOLEAN | DEFAULT FALSE |
| assigne_a | VARCHAR(50) | NOT NULL |
| commentaires | TEXT | |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

#### Table: config
| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| date_mariage | DATE | NOT NULL |
| budget_total | DECIMAL(10,2) | DEFAULT 0 |
| nom_partenaire_1 | VARCHAR(50) | DEFAULT 'Toky' |
| nom_partenaire_2 | VARCHAR(50) | DEFAULT 'Partenaire' |

---

## 5. Interface Utilisateur

### 5.1 Design System

#### Couleurs
| Usage | Couleur | Tailwind Class |
|-------|---------|----------------|
| Primary | Rose/Pink | `bg-pink-500` |
| Secondary | Violet | `bg-purple-500` |
| Success | Vert | `bg-green-500` |
| Warning | Orange | `bg-orange-500` |
| Danger | Rouge | `bg-red-500` |
| Background | Gris clair | `bg-gray-50` |
| Cards | Blanc | `bg-white` |

#### Typographie
- Titres : Font bold, tailles `text-2xl` à `text-4xl`
- Corps : `text-base`, couleur `text-gray-700`
- Labels : `text-sm`, couleur `text-gray-500`

### 5.2 Layout Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  💍 Notre Mariage          J-99          ⚙️ Config         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Budget Fixé │ │   Dépensé   │ │   Restant   │           │
│  │  15 000 €   │ │   8 500 €   │ │   6 500 €   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  ┌─────────────────────┐ ┌─────────────────────────────┐   │
│  │   🥧 Répartition    │ │   📊 Progression            │   │
│  │   [Camembert]       │ │   Réception    ████████░░ 80%│  │
│  │                     │ │   Cérémonie    ██████████ 100%│  │
│  │                     │ │   Tenues       █████░░░░░ 50% │  │
│  └─────────────────────┘ └─────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💰 Top Dépense: Traiteur - 3 500 € (Réception)     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  📋 Tâches                              [+ Nouvelle tâche] │
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐│
│  │ ✅ Traiteur     │ │ ⏳ DJ           │ │ ⏳ Fleuriste   ││
│  │ 🍽️ Réception   │ │ 📸 Prestataires │ │ 🎨 Décoration  ││
│  │ Est: 3000€      │ │ Est: 800€       │ │ Est: 500€      ││
│  │ Réel: 3500€     │ │ Réel: -         │ │ Réel: -        ││
│  │ 👤 Toky        │ │ 👤 Partenaire   │ │ 👤 Toky        ││
│  └─────────────────┘ └─────────────────┘ └────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Comportements Dynamiques

### 6.1 Mise à Jour Temps Réel
Lorsqu'une tâche est modifiée :
1. Sauvegarde via API (PUT /api/tasks/<id>)
2. Rechargement des stats (GET /api/stats)
3. Mise à jour du DOM sans refresh page :
   - Cartes budget
   - Graphique camembert
   - Barres de progression
   - Carte top dépense

### 6.2 Feedback Visuel
| Action | Feedback |
|--------|----------|
| Sauvegarde réussie | Animation subtle (fade vert) |
| Tâche terminée | Confetti ou check animation |
| Erreur | Toast rouge avec message |

---

## 7. Critères d'Acceptation

### 7.1 Fonctionnels
- [ ] Pouvoir créer une tâche en < 10 secondes
- [ ] Changer le statut d'une tâche en 1 clic
- [ ] Dashboard se met à jour instantanément après modification
- [ ] Graphique camembert affiche correctement les données
- [ ] Barres de progression reflètent l'avancement réel
- [ ] Compte à rebours J-XX est exact
- [ ] Top dépense affiche la bonne tâche

### 7.2 Techniques
- [ ] Application déployée sur Vercel
- [ ] Temps de chargement < 2 secondes
- [ ] Interface responsive (minimum desktop)
- [ ] Données persistées en base SQLite

---

## 8. Hors Périmètre (V2)

- Authentification / Login
- Dark mode
- Export PDF / Excel
- Notifications / Rappels
- Gestion des invités
- Filtres avancés
- Application mobile native

---

## 9. Planning Suggéré

| Phase | Contenu |
|-------|---------|
| **1** | Setup projet (Flask, Tailwind, SQLite) |
| **2** | Modèles de données + API |
| **3** | Dashboard UI (cartes, graphiques) |
| **4** | Gestion des tâches (CRUD) |
| **5** | Configuration |
| **6** | Tests et polish |
| **7** | Déploiement Vercel |

---

**Document PRD Complet - PROJET-HT**
