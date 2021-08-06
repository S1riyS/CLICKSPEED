import os

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = False
SECRET_KEY = '1qaz2wsx3edc4rfv'

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app', 'db', 'application.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False