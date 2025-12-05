# My Wedding - Suivi Préparation Mariage

Application web pour suivre la préparation de votre mariage : budget, tâches, progression.

## Fonctionnalités

- Dashboard avec vue d'ensemble du budget et progression
- Gestion des tâches par catégorie
- Suivi des dépenses (estimatif vs réel)
- Attribution des tâches aux partenaires
- Compte à rebours J-XX
- Réinitialisation des données

## Stack technique

- **Backend**: Flask + SQLAlchemy
- **Frontend**: Tailwind CSS + Chart.js
- **BDD Local**: SQLite
- **BDD Production**: PostgreSQL (Supabase)

## Installation locale

```bash
# Cloner le repo
git clone https://github.com/mathieu22/my-wedding.git
cd my-wedding

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# Installer dépendances
pip install -r requirements.txt

# Lancer l'application
python run.py
```

Ouvrir http://127.0.0.1:5000

## Déploiement sur Vercel

1. Connecter le repo GitHub à Vercel
2. Créer une base PostgreSQL sur [Supabase](https://supabase.com)
3. Ajouter la variable d'environnement `DATABASE_URL` dans Vercel
4. Déployer

## Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| DATABASE_URL | URL PostgreSQL (production) | Prod |
| SECRET_KEY | Clé secrète Flask | Optionnel |
