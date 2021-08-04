from . import app
from flask import render_template, request

@app.route('/', methods=['GET'])
def home_page():
    return render_template('main.html')


def check_test_time(test_time: str) -> bool:
    acceptable_values = {1, 2, 5, 10, 15, 30, 60, 100}
    if test_time in acceptable_values:
        return True
    return False


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


########## ОБРАБОТЧИК ОШИБКИ 404 ##########
@app.errorhandler(404)
def error_404_page(error):
    return render_template('404.html')