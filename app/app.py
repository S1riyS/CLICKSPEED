from flask import Flask
from flask import render_template, redirect, url_for, request

app = Flask(__name__)
app.config.from_object('config')

@app.route('/cpstest', methods=['GET', 'POST'])
def main_page():
    test_time = request.args.get('test_time')
    if test_time.isdigit() and test_time in {'1', '2', '5', '10', '15', '30', '60', '100'}:
        return render_template('cps_test.html', test_time=test_time)
    else:
        return render_template('404.html')