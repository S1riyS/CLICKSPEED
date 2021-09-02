from functools import wraps

from flask import render_template, request, flash, redirect, url_for, session
from flask_login import current_user, login_user, login_required, logout_user
from sqlalchemy import func

from . import app, db, moment
from .data.models import *
from .forms.user import RegisterForm, LoginForm


#  Check "Test time" url parameter
def check_test_time(test_time) -> bool:
    acceptable_values = {1, 2, 5, 10, 15, 30, 60, 100}
    if test_time:
        if test_time in acceptable_values:
            return True
    return False


# Decoration function which adds current url to session variable
def next_url(func):
    @wraps(func)
    def wrapper_function(*args, **kwargs):
        session['next_url'] = request.path
        return func(*args, **kwargs)

    return wrapper_function


# Home page
@app.route('/', methods=['GET'])
@next_url
def home_page():
    return render_template('main.html')


# General test page
@app.route('/tests/<string:test_name>', methods=['GET', 'POST'])
@next_url
def test_page(test_name):
    test_time = request.args.get('test_time', type=int, default=10)
    results = db.session.query(Result).filter(Result.user_id == current_user.id,
                                              func.lower(Result.test_name) == test_name.lower()).order_by(
        Result.date_create.desc())

    if not test_time:
        return render_template(f'{test_name}.html', results=results)

    if check_test_time(test_time):
        return render_template(f'{test_name}.html', test_time=test_time, results=results)
    else:
        return render_template('404.html')


# Sending result to the DB
@app.route('/send_result', methods=['POST'])
def send_result_page():
    if current_user.is_active:
        data = request.json

        result = Result(
            user_id=current_user.id,
            test_name=data['test_name'],
            score=data['score'],
            test_time=data['test_time']
        )

        db.session.add(result)
        db.session.commit()

    return ''


# Profile page
@app.route('/profile', methods=['GET'])
@login_required
def profile_page():
    results = db.session.query(Result).filter(Result.user_id == current_user.id).order_by(Result.date_create.desc())
    return render_template('profile.html', user=current_user, results=results)


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
    session['next_url'] = request.path
    return redirect(url_for('login_page'))


# Login page
@app.route('/login', methods=['GET', 'POST'])
def login_page():
    next_url = session.get('next_url', '/')

    form = LoginForm()
    if form.validate_on_submit():
        # Data
        email = form.email.data
        password = form.password.data
        # Check data
        if email and password:
            user = db.session.query(User).filter(User.email == form.email.data).first()
            # Error
            if not user:
                flash('Wrong login or password!')
                return render_template('login.html', form=form)
            # Success
            elif user.check_password(password):
                login_user(user)
                return redirect(next_url)
            # Error
            else:
                flash('Wrong login or password!')
                return render_template('login.html', form=form)

    return render_template('login.html', form=form)


# Logout page
@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout_page():
    logout_user()
    next_url = session.get('next_url', '/')
    return redirect(next_url)


# 404 error handler
@app.errorhandler(404)
def error_404_page(error):
    return render_template('404.html')
