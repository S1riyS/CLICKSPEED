from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_moment import Moment
from flask_migrate import Migrate

app = Flask(__name__, instance_relative_config=False)
app.config.from_object('config')

# Инициализирует расширения
db = SQLAlchemy()
migrate = Migrate(app, db, render_as_batch=True)
login_manager = LoginManager(app)
moment = Moment(app)

# Jinja2 global variables
variables = {
    'WEBSITE_URL': 'CLICKSPEED.RU',
    'LANGUAGE': 'en',
    'DEVELOPER': 'S1riyS'
}
for key, value in variables.items():
    app.jinja_env.globals[key] = value

db.init_app(app)

with app.app_context():
    from . import routes  # Import routes

    db.create_all()  # Create sql tables for our data models
