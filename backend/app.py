import os
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/asistente')
def asistente():
    return render_template('asistente.html')

@app.route('/button-click', methods=['POST'])
def button_click():
    data = request.get_json()
    message = data.get('message', '')
    print(f"Received message: {message}")
    return "Received"

if __name__ == '__main__':
    app.run(debug=True)
