from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()

class Config(db.Model):
    __tablename__ = 'config'

    id = db.Column(db.Integer, primary_key=True)
    date_mariage = db.Column(db.Date, nullable=False, default=date(2026, 3, 14))
    budget_total = db.Column(db.Float, default=0)
    nom_partenaire_1 = db.Column(db.String(50), default='Toky')
    nom_partenaire_2 = db.Column(db.String(50), default='Partenaire')

    def to_dict(self):
        return {
            'id': self.id,
            'date_mariage': self.date_mariage.isoformat(),
            'budget_total': self.budget_total,
            'nom_partenaire_1': self.nom_partenaire_1,
            'nom_partenaire_2': self.nom_partenaire_2
        }

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    categorie = db.Column(db.String(50), nullable=False)
    prix_estimatif = db.Column(db.Float, default=0)
    prix_reel = db.Column(db.Float, default=0)
    statut = db.Column(db.Boolean, default=False)  # False = En cours, True = Terminé
    assigne_a = db.Column(db.String(50), nullable=False)
    commentaires = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'categorie': self.categorie,
            'prix_estimatif': self.prix_estimatif,
            'prix_reel': self.prix_reel,
            'statut': self.statut,
            'assigne_a': self.assigne_a,
            'commentaires': self.commentaires,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Liste des catégories disponibles
CATEGORIES = [
    {'id': 'reception', 'nom': 'Réception', 'icone': '🍽️', 'couleur': 'orange'},
    {'id': 'ceremonie', 'nom': 'Cérémonie', 'icone': '💒', 'couleur': 'purple'},
    {'id': 'tenues', 'nom': 'Tenues & Beauté', 'icone': '👗', 'couleur': 'pink'},
    {'id': 'prestataires', 'nom': 'Prestataires', 'icone': '📸', 'couleur': 'blue'},
    {'id': 'decoration', 'nom': 'Décoration', 'icone': '🎨', 'couleur': 'green'},
    {'id': 'administratif', 'nom': 'Administratif', 'icone': '📄', 'couleur': 'gray'},
    {'id': 'logistique', 'nom': 'Logistique', 'icone': '🚗', 'couleur': 'yellow'},
]
