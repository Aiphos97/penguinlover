import os
from flask import Flask, request, send_from_directory, abort

app = Flask(__name__)

@app.route('/')
def index():
    frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend'))
    filename = 'asistente.html'

    if os.path.exists(os.path.join(frontend_path, filename)):
        return send_from_directory(frontend_path, filename)
    else:
        abort(404, description="File not found")

@app.route('/button-click', methods=['POST'])
def button_click():
    data = request.get_json()
    message = data.get('message', '')
    print(f"Received message: {message}")
    return "Received"

if __name__ == '__main__':
    app.run(debug=True)
