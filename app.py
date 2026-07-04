from flask import Flask, render_template, jsonify, request
import sqlite3
import os
from database import get_db_connection, init_db

app = Flask(__name__)
app.config['SECRET_KEY'] = 'papuaverse-secret-key-12345'

# Ensure the database exists and has been initialized
DATABASE_FILE = os.path.join(os.path.dirname(__file__), 'papua_tourism.db')
if not os.path.exists(DATABASE_FILE):
    print("Database file not found, initializing database...")
    init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM destinations')
        rows = cursor.fetchall()
        conn.close()
        
        destinations = []
        for row in rows:
            destinations.append(dict(row))
        return jsonify(destinations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/culture', methods=['GET'])
def get_culture():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM culture')
        rows = cursor.fetchall()
        conn.close()
        
        culture_list = []
        for row in rows:
            culture_list.append(dict(row))
        return jsonify(culture_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/food', methods=['GET'])
def get_food():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM food')
        rows = cursor.fetchall()
        conn.close()
        
        food_list = []
        for row in rows:
            food_list.append(dict(row))
        return jsonify(food_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if request.method == 'POST':
            data = request.get_json() or {}
            player_name = data.get('player_name', 'Anonymous').strip()
            score = int(data.get('score', 0))
            
            # Determine badge based on score
            if score >= 90:
                badges = 'Papua Expert'
            elif score >= 75:
                badges = 'Explorer'
            else:
                badges = 'Beginner'
                
            cursor.execute(
                'INSERT INTO leaderboard (player_name, score, badges) VALUES (?, ?, ?)',
                (player_name, score, badges)
            )
            conn.commit()
            
            # Fetch rank/placement
            cursor.execute('SELECT count(*) + 1 FROM leaderboard WHERE score > ?', (score,))
            rank = cursor.fetchone()[0]
            
            conn.close()
            return jsonify({
                "status": "success",
                "message": "Score saved successfully",
                "player_name": player_name,
                "score": score,
                "badge": badges,
                "rank": rank
            })
            
        else:  # GET
            cursor.execute('SELECT player_name, score, badges, date_played FROM leaderboard ORDER BY score DESC, date_played DESC LIMIT 10')
            rows = cursor.fetchall()
            conn.close()
            
            scores = []
            for row in rows:
                scores.append(dict(row))
            return jsonify(scores)
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask import Flask, render_template, jsonify, request
import sqlite3
import os
from database import get_db_connection, init_db

app = Flask(__name__)
app.config['SECRET_KEY'] = 'papuaverse-secret-key-12345'

# Ensure the database exists and has been initialized
DATABASE_FILE = os.path.join(os.path.dirname(__file__), 'papua_tourism.db')
if not os.path.exists(DATABASE_FILE):
    print("Database file not found, initializing database...")
    init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM destinations')
        rows = cursor.fetchall()
        conn.close()
        
        destinations = []
        for row in rows:
            destinations.append(dict(row))
        return jsonify(destinations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/culture', methods=['GET'])
def get_culture():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM culture')
        rows = cursor.fetchall()
        conn.close()
        
        culture_list = []
        for row in rows:
            culture_list.append(dict(row))
        return jsonify(culture_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/food', methods=['GET'])
def get_food():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM food')
        rows = cursor.fetchall()
        conn.close()
        
        food_list = []
        for row in rows:
            food_list.append(dict(row))
        return jsonify(food_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if request.method == 'POST':
            data = request.get_json() or {}
            player_name = data.get('player_name', 'Anonymous').strip()
            score = int(data.get('score', 0))
            
            # Determine badge based on score
            if score >= 90:
                badges = 'Papua Expert'
            elif score >= 75:
                badges = 'Explorer'
            else:
                badges = 'Beginner'
                
            cursor.execute(
                'INSERT INTO leaderboard (player_name, score, badges) VALUES (?, ?, ?)',
                (player_name, score, badges)
            )
            conn.commit()
            
            # Fetch rank/placement
            cursor.execute('SELECT count(*) + 1 FROM leaderboard WHERE score > ?', (score,))
            rank = cursor.fetchone()[0]
            
            conn.close()
            return jsonify({
                "status": "success",
                "message": "Score saved successfully",
                "player_name": player_name,
                "score": score,
                "badge": badges,
                "rank": rank
            })
            
        else:  # GET
            cursor.execute('SELECT player_name, score, badges, date_played FROM leaderboard ORDER BY score DESC, date_played DESC LIMIT 10')
            rows = cursor.fetchall()
            conn.close()
            
            scores = []
            for row in rows:
                scores.append(dict(row))
            return jsonify(scores)
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Start Flask development server on port 5001 to avoid conflicts
    app.run(host='0.0.0.0', port=5001, debug=True)
