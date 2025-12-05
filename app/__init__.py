import os
from flask import Flask
from .models import db

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'mariage-secret-key-2026')

    # PostgreSQL en production, SQLite en local
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        # Vercel/Neon utilise postgres:// mais SQLAlchemy requiert postgresql://
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mariage.db'

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        from . import routes
        db.create_all()

        # Créer la config par défaut si elle n'existe pas
        from .models import Config
        if not Config.query.first():
            default_config = Config()
            db.session.add(default_config)
            db.session.commit()

    return app
