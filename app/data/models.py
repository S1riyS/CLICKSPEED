import datetime

import sqlalchemy
from sqlalchemy import orm
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app import db, login_manager


class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    nickname = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    email = sqlalchemy.Column(sqlalchemy.String,
                              index=True, unique=True, nullable=True)
    hashed_password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    registration_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                          default=datetime.datetime.utcnow)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)


class Test(db.Model):
    __tablename__ = "tests"
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, unique=True)
    unit = sqlalchemy.Column(sqlalchemy.String)
    link = sqlalchemy.Column(sqlalchemy.String)
    icon = sqlalchemy.Column(sqlalchemy.String)


class Result(db.Model):
    __tablename__ = "results"
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer,
                                sqlalchemy.ForeignKey("users.id"))
    user = orm.relation('User')
    # ----- In .JS -----
    test_name = sqlalchemy.Column(sqlalchemy.Integer,
                                  sqlalchemy.ForeignKey("tests.name"))
    test = orm.relation('Test')
    score = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    test_time = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    # -------
    date_create = sqlalchemy.Column(sqlalchemy.DateTime,
                                    default=datetime.datetime.utcnow)

    def get_test(self) -> Test:
        test = db.session.query(Test).filter(Test.name == self.test_name).first()
        return test


@login_manager.user_loader
def load_user(user_id):
    return db.session.query(User).get(user_id)
