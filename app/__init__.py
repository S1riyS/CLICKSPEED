from flask import Flask
from flask import render_template, redirect, url_for, request

# App
app = Flask(__name__)
app.config.from_object('config')

# Jinja2 global variables
app.jinja_env.globals['WEBSITE_URL'] = 'CLICKSPEED.RU'


@app.route('/', methods=['GET', 'POST'])
def home_page():
    return render_template('main.html')


def check_test_time(test_time: str):
    if test_time.isdigit() and test_time in {'1', '2', '5', '10', '15', '30', '60', '100'}:
        return True
    return False


@app.route('/cps', methods=['GET', 'POST'])
def cps_test_page():
    test_time = request.args.get('test_time')

    if check_test_time(test_time):
        return render_template('cps_test.html', test_time=test_time)
    else:
        return render_template('404.html')


@app.route('/aim', methods=['GET', 'POST'])
def aim_test_page():
    test_time = request.args.get('test_time')

    if check_test_time(test_time):
        return render_template('aim_test.html', test_time=test_time)
    else:
        return render_template('404.html')


@app.route('/reactiontime', methods=['GET', 'POST'])
def reaction_test_page():
    return render_template('/reaction_test.html')


########## ОБРАБОТЧИК ОШИБКИ 404 ##########
@app.errorhandler(404)
def error_404_page(error):
    return render_template('404.html')

