from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_moment import Moment
from flask_migrate import Migrate


app = Flask(__name__, instance_relative_config=False)
app.config.from_object('config')

# Инициализирует расширения
db = SQLAlchemy()
migrate = Migrate(app, db)
login_manager = LoginManager(app)
moment = Moment(app)

# Jinja2 global variables
app.jinja_env.globals['WEBSITE_URL'] = 'CLICKSPEED.RU'

db.init_app(app)

with app.app_context():
    from . import routes  # Import routes
    db.create_all()  # Create sql tables for our data models


