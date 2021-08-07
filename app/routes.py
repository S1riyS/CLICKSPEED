from flask import render_template, request, flash, redirect, session
from flask_login import current_user

from . import app, db
from .data.models import *
from .forms.user import RegisterForm, LoginForm


def check_test_time(test_time: str) -> bool:
    acceptable_values = {1, 2, 5, 10, 15, 30, 60, 100}
    if test_time in acceptable_values:
        return True
    return False


@app.route('/', methods=['GET'])
def home_page():
    return render_template('main.html')


@app.route('/cps', methods=['GET'])
def cps_test_page():
    test_time = request.args.get('test_time', type=int)

    if check_test_time(test_time):
        return render_template('cps_test.html', test_time=test_time)
    else:
        return render_template('404.html')


@app.route('/aim', methods=['GET'])
def aim_test_page():
    test_time = request.args.get('test_time', type=int)

    if check_test_time(test_time):
        return render_template('aim_test.html', test_time=test_time)
    else:
        return render_template('404.html')


@app.route('/reactiontime', methods=['GET'])
def reaction_test_page():
    return render_template('/reaction_test.html')


@app.route('/registration', methods=['GET', 'POST'])
def registration_page():
    session.pop('_flashes', None)
    form = RegisterForm()
    if form.validate_on_submit():
        if db.session.query(User).filter(User.email == form.email.data).first():
            flash("Такой пользователь уже есть")
            return render_template('register.html', form=form)
        if form.password.data != form.password_again.data:
            flash("Пароли не совпадают")
            return render_template('register.html', form=form)
        user = User(
            nickname=form.nickname.data,
            email=form.email.data,
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html', title='Регистрация', form=form, user=current_user)

########## ОБРАБОТЧИК ОШИБКИ 404 ##########
@app.errorhandler(404)
def error_404_page(error):
    return render_template('404.html')
