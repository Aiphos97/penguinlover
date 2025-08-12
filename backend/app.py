# import os
# import sqlite3
# from flask import Flask, g, request, render_template, redirect, jsonify, session
# from werkzeug.security import generate_password_hash, check_password_hash
# from functools import wraps

# app = Flask(__name__)
# app.secret_key = 'your-very-strong-secret-key'  # Change this!
# DATABASE = 'pengudatabase.db'

# def get_db():
#     if 'db' not in g:
#         g.db = sqlite3.connect(DATABASE)
#         g.db.row_factory = sqlite3.Row
#     return g.db

# @app.teardown_appcontext
# def close_connection(exception):
#     db = g.pop('db', None)
#     if db is not None:
#         db.close()

# def init_db():
#     with app.app_context():
#         db = get_db()
#         cursor = db.cursor()
#         # Create all your tables if they don't exist
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 email TEXT UNIQUE NOT NULL,
#                 username TEXT UNIQUE NOT NULL,
#                 password TEXT NOT NULL
#             )
#         ''')
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS mascotas (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 name TEXT NOT NULL,
#                 image TEXT,
#                 mood TEXT,
#                 vidas INTEGER
#             )
#         ''')
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS user_mascotas (
#                 user_id INTEGER NOT NULL,
#                 mascota_id INTEGER NOT NULL,
#                 PRIMARY KEY (user_id, mascota_id),
#                 FOREIGN KEY (user_id) REFERENCES users(id),
#                 FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
#             )
#         ''')
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS messages (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 user_id INTEGER,
#                 content TEXT NOT NULL,
#                 FOREIGN KEY(user_id) REFERENCES users(id)
#             )
#         ''')
#         db.commit()

# # Decorator to protect routes
# def login_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         if 'user_id' not in session:
#             return redirect('/login')
#         return f(*args, **kwargs)
#     return decorated_function

# @app.route('/')
# def index():
#     if 'user_id' in session:
#         return redirect('/asistente')
#     else:
#         return redirect('/login')

# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     if request.method == 'POST':
#         username = request.form['username']
#         email = request.form['email']
#         password = request.form['password']
#         hashed_password = generate_password_hash(password)

#         db = get_db()
#         try:
#             db.execute(
#                 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
#                 (username, email, hashed_password)
#             )
#             db.commit()
#             return redirect('/login')
#         except sqlite3.IntegrityError:
#             return "Username or email already exists."

#     return render_template('register.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']

#         db = get_db()
#         user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()

#         if user and check_password_hash(user['password'], password):
#             session['user_id'] = user['id']
#             session['username'] = user['username']
#             return redirect('/asistente')
#         else:
#             return "Invalid username or password."

#     return render_template('login.html')

# @app.route('/logout')
# def logout():
#     session.clear()
#     return redirect('/login')

# @app.route('/asistente')
# @login_required
# def asistente():
#     # Pass username to template if you want
#     return render_template('asistente.html', username=session.get('username'))

# # @app.route('/button-click', methods=['POST'])
# # @login_required
# # def button_click():
# #     data = request.get_json()
# #     message = data.get('message', '')
# #     db = get_db()
# #     cursor = db.cursor()
# #     cursor.execute("INSERT INTO messages (content, user_id) VALUES (?, ?)", (message, session['user_id']))
# #     db.commit()
# #     return "Message saved!"
# @app.route('/button-click', methods=['POST'])
# def button_click():
#     try:
#         data = request.get_json()
#         message = data.get('message', '')
#         if not message:
#             return "Empty message", 400
#         db = get_db()
#         cursor = db.cursor()
#         cursor.execute("INSERT INTO messages (content) VALUES (?)", (message,))
#         db.commit()
#         return "Message saved!"
#     except Exception as e:
#         print(f"Error in button-click: {e}")
#         return "Internal server error", 500


# @app.route('/messages')
# @login_required
# def messages():
#     db = get_db()
#     cursor = db.execute("SELECT * FROM messages WHERE user_id = ? ORDER BY id DESC", (session['user_id'],))
#     rows = cursor.fetchall()
#     return jsonify({'messages': [dict(row) for row in rows]})

# if __name__ == '__main__':
#     init_db()
#     app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

import os
import sqlite3
from flask import Flask, g, request, render_template, redirect, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your-very-strong-secret-key'  # Change this!
DATABASE = 'pengudatabase.db'

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_connection(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        # Create all your tables if they don't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS mascotas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                image TEXT,
                mood TEXT,
                vidas INTEGER
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_mascotas (
                user_id INTEGER NOT NULL,
                mascota_id INTEGER NOT NULL,
                PRIMARY KEY (user_id, mascota_id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                content TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        db.commit()

# Decorator to protect routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        hashed_password = generate_password_hash(password)

        db = get_db()
        try:
            db.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, hashed_password)
            )
            db.commit()

            # Get the new user's ID
            user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()

            # Assign a new unique mascota to this user
            create_and_assign_mascota(user['id'])

            return redirect('/login')
        except sqlite3.IntegrityError:
            return "Username or email already exists."

    return render_template('register.html')



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        db = get_db()
        user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            return redirect('/asistente')
        else:
            return "Invalid username or password."

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route('/asistente')
def asistente():
    if 'user_id' not in session:
        return redirect('/login')
    # If logged in, render asistente page with username, etc.
    return render_template('asistente.html', username=session.get('username'))


@app.route('/button-click', methods=['POST'])
@login_required
def button_click():
    data = request.get_json()
    message = data.get('message', '')
    if not message:
        return "Empty message", 400
    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO messages (content, user_id) VALUES (?, ?)", (message, session['user_id']))
    db.commit()
    return "Message saved!"

@app.route('/messages')
@login_required
def messages():
    db = get_db()
    cursor = db.execute("SELECT * FROM messages WHERE user_id = ? ORDER BY id DESC", (session['user_id'],))
    rows = cursor.fetchall()
    return jsonify({'messages': [dict(row) for row in rows]})

# @app.route('/complete-task/<int:message_id>', methods=['POST'])
# @login_required
# def complete_task(message_id):
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute("UPDATE messages SET completed = 1 WHERE id = ? AND user_id = ?", (message_id, session['user_id']))
#     db.commit()
#     return "Task marked as completed!"
@app.route('/complete-task/<int:message_id>', methods=['POST'])
@login_required
def complete_task(message_id):
    db = get_db()
    cursor = db.cursor()
    # Mark the task completed
    cursor.execute(
        "UPDATE messages SET completed = 1 WHERE id = ? AND user_id = ?",
        (message_id, session['user_id'])
    )
    # Increment pet vidas by 1 for this user
    cursor.execute("""
        UPDATE mascotas
        SET vidas = vidas + 1
        WHERE id IN (
            SELECT mascota_id FROM user_mascotas WHERE user_id = ?
        )
    """, (session['user_id'],))
    db.commit()
    return "Task marked completed and pet vidas incremented!"



def create_and_assign_mascota(user_id, mascota_name='Pengu', image='pengu.png', mood='happy', vidas=0):
    db = get_db()
    cursor = db.cursor()

    # Create a new mascota for this user
    cursor.execute(
        "INSERT INTO mascotas (name, image, mood, vidas) VALUES (?, ?, ?, ?)",
        (mascota_name, image, mood, vidas)
    )
    db.commit()
    mascota_id = cursor.lastrowid

    # Link mascota to user
    cursor.execute(
        "INSERT INTO user_mascotas (user_id, mascota_id) VALUES (?, ?)",
        (user_id, mascota_id)
    )
    db.commit()

    return mascota_id

@app.route('/get_vidas')
@login_required
def get_vidas():
    db = get_db()
    cursor = db.cursor()
    # Get the mascota ID linked to the user
    mascota = cursor.execute("""
        SELECT m.vidas FROM mascotas m
        JOIN user_mascotas um ON m.id = um.mascota_id
        WHERE um.user_id = ?
    """, (session['user_id'],)).fetchone()

    vidas = mascota['vidas'] if mascota else 0
    return jsonify({'vidas': vidas})


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
