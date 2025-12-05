from flask import render_template, jsonify, request, current_app as app
from .models import db, Task, Config, CATEGORIES
from datetime import date, datetime

@app.route('/')
def index():
    config = Config.query.first()
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return render_template('index.html',
                         config=config,
                         tasks=tasks,
                         categories=CATEGORIES)

# ============ API TASKS ============

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()

    task = Task(
        nom=data.get('nom', ''),
        categorie=data.get('categorie', 'reception'),
        prix_estimatif=float(data.get('prix_estimatif', 0)),
        prix_reel=float(data.get('prix_reel', 0)),
        statut=data.get('statut', False),
        assigne_a=data.get('assigne_a', 'Toky'),
        commentaires=data.get('commentaires', '')
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    if 'nom' in data:
        task.nom = data['nom']
    if 'categorie' in data:
        task.categorie = data['categorie']
    if 'prix_estimatif' in data:
        task.prix_estimatif = float(data['prix_estimatif'])
    if 'prix_reel' in data:
        task.prix_reel = float(data['prix_reel'])
    if 'statut' in data:
        task.statut = data['statut']
    if 'assigne_a' in data:
        task.assigne_a = data['assigne_a']
    if 'commentaires' in data:
        task.commentaires = data['commentaires']

    task.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify(task.to_dict())

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Tâche supprimée'}), 200

# ============ API CONFIG ============

@app.route('/api/config', methods=['GET'])
def get_config():
    config = Config.query.first()
    return jsonify(config.to_dict())

@app.route('/api/config', methods=['PUT'])
def update_config():
    config = Config.query.first()
    data = request.get_json()

    if 'date_mariage' in data:
        config.date_mariage = datetime.strptime(data['date_mariage'], '%Y-%m-%d').date()
    if 'budget_total' in data:
        config.budget_total = float(data['budget_total'])
    if 'nom_partenaire_1' in data:
        config.nom_partenaire_1 = data['nom_partenaire_1']
    if 'nom_partenaire_2' in data:
        config.nom_partenaire_2 = data['nom_partenaire_2']

    db.session.commit()
    return jsonify(config.to_dict())

# ============ API STATS ============

@app.route('/api/stats', methods=['GET'])
def get_stats():
    config = Config.query.first()
    tasks = Task.query.all()

    # Calculs budget
    budget_fixe = config.budget_total

    # Estimatif: total de toutes les tâches (prévisionnel)
    total_estimatif = sum(t.prix_estimatif for t in tasks)
    budget_restant_estimatif = budget_fixe - total_estimatif
    pourcentage_estimatif = (total_estimatif / budget_fixe * 100) if budget_fixe > 0 else 0

    # Réel: seulement les tâches terminées avec prix réel
    budget_depense_reel = sum(t.prix_reel for t in tasks if t.statut and t.prix_reel > 0)
    budget_restant_reel = budget_fixe - budget_depense_reel
    pourcentage_reel = (budget_depense_reel / budget_fixe * 100) if budget_fixe > 0 else 0

    # Calculs jours restants
    today = date.today()
    jours_restants = (config.date_mariage - today).days

    # Calculs avancement
    taches_total = len(tasks)
    taches_terminees = sum(1 for t in tasks if t.statut)
    pourcentage_avancement = (taches_terminees / taches_total * 100) if taches_total > 0 else 0

    # Top dépense
    top_depense = None
    taches_avec_prix = [t for t in tasks if t.prix_reel > 0]
    if taches_avec_prix:
        top_task = max(taches_avec_prix, key=lambda t: t.prix_reel)
        top_depense = {
            'nom': top_task.nom,
            'prix_reel': top_task.prix_reel,
            'categorie': top_task.categorie
        }

    # Stats par catégorie
    par_categorie = {}
    for cat in CATEGORIES:
        cat_tasks = [t for t in tasks if t.categorie == cat['id']]
        cat_estimatif = sum(t.prix_estimatif for t in cat_tasks)
        cat_reel = sum(t.prix_reel for t in cat_tasks if t.statut and t.prix_reel > 0)
        par_categorie[cat['id']] = {
            'nom': cat['nom'],
            'icone': cat['icone'],
            'couleur': cat['couleur'],
            'total': len(cat_tasks),
            'terminees': sum(1 for t in cat_tasks if t.statut),
            'depense_reel': cat_reel,
            'estimatif': cat_estimatif,
            'pourcentage': (sum(1 for t in cat_tasks if t.statut) / len(cat_tasks) * 100) if cat_tasks else 0
        }

    # Écart entre estimatif et réel (pour les tâches terminées avec prix réel)
    taches_terminees_avec_reel = [t for t in tasks if t.statut and t.prix_reel > 0]
    estimatif_taches_terminees = sum(t.prix_estimatif for t in taches_terminees_avec_reel)
    reel_taches_terminees = sum(t.prix_reel for t in taches_terminees_avec_reel)
    ecart = reel_taches_terminees - estimatif_taches_terminees
    ecart_pourcentage = ((ecart) / estimatif_taches_terminees * 100) if estimatif_taches_terminees > 0 else 0

    return jsonify({
        'budget_fixe': budget_fixe,
        # Estimatif (prévisionnel)
        'total_estimatif': total_estimatif,
        'budget_restant_estimatif': budget_restant_estimatif,
        'pourcentage_estimatif': round(pourcentage_estimatif, 1),
        # Réel (dépensé)
        'budget_depense_reel': budget_depense_reel,
        'budget_restant_reel': budget_restant_reel,
        'pourcentage_reel': round(pourcentage_reel, 1),
        # Écart
        'ecart': ecart,
        'ecart_pourcentage': round(ecart_pourcentage, 1),
        'estimatif_taches_terminees': estimatif_taches_terminees,
        'reel_taches_terminees': reel_taches_terminees,
        # Autres
        'jours_restants': jours_restants,
        'taches_total': taches_total,
        'taches_terminees': taches_terminees,
        'pourcentage_avancement': round(pourcentage_avancement, 1),
        'top_depense': top_depense,
        'par_categorie': par_categorie,
        'config': config.to_dict()
    })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify(CATEGORIES)

@app.route('/api/reset', methods=['POST'])
def reset_data():
    """Réinitialise toutes les tâches (supprime tout)"""
    Task.query.delete()
    db.session.commit()
    return jsonify({'message': 'Toutes les tâches ont été supprimées'}), 200
