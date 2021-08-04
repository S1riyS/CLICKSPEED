from flask import Flask

# App
app = Flask(__name__)
app.config.from_object('app_dir.config')

# Jinja2 global variables
app.jinja_env.globals['WEBSITE_URL'] = 'CLICKSPEED.RU'

# Импорт все rout'ов
from . import views
