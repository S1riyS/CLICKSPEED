from flask import render_template, request, flash, redirect, url_for, session
from flask_login import current_user, login_user, login_required, logout_user

from . import app, db, moment
from .data.models import *
from .forms.user import RegisterForm, LoginForm


def check_test_time(test_time) -> bool:
    acceptable_values = {1, 2, 5, 10, 15, 30, 60, 100}
    if test_time:
        if test_time in acceptable_values:
            return True
    return False


# Home page
@app.route('/', methods=['GET'])
def home_page():
    return render_template('main.html')


@app.route('/tests/<string:test_name>', methods=['GET', 'POST'])
def test_page(test_name):
    test_time = request.args.get('test_time', type=int, default=10)

    if not test_time:
        return render_template(f'{test_name}_test.html')

    if check_test_time(test_time):
        return render_template(f'{test_name}.html', test_time=test_time)
    else:
        return render_template('404.html')


# Profile page
@app.route('/profile', methods=['GET'])
@login_required
def profile_page():
    return render_template('profile.html', user=current_user)


# Registration page
@app.route('/signup', methods=['GET', 'POST'])
def sing_up_page():
    form = RegisterForm()
    if form.validate_on_submit():
        if db.session.query(User).filter(User.email == form.email.data).first():
            flash("There is already a user which is signed in.")
            return render_template('register.html', form=form)
        if form.password.data != form.password_again.data:
            flash("Passwords don't match")
            return render_template('register.html', form=form)
        user = User(
            nickname=form.nickname.data,
            email=form.email.data,
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login_page'))
    return render_template('register.html', form=form)


# Unauthorized handler
@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect(url_for('login_page'))


# Login page
@app.route('/login', methods=['GET', 'POST'])
def login_page():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        if email and password:
            user = db.session.query(User).filter(User.email == form.email.data).first()
            print(user)
            if not user:
                flash('Wrong login or password!')
                return render_template('login.html', form=form)
            elif user.check_password(password):
                login_user(user)
                print(current_user.nickname)
                return redirect(url_for('home_page'))
            else:
                flash('Wrong login or password!')
                return render_template('login.html', form=form)

    return render_template('login.html', form=form)


# Logout page
@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout_page():
    logout_user()
    return redirect(url_for('home_page'))


# 404 error handler
@app.errorhandler(404)
def error_404_page(error):
    return render_template('404.html')
