"""
One-time script to seed demo users into the database.
Run once after init_db.py:
    python seed_admin.py
"""
import bcrypt
import psycopg2
from app.config import DATABASE_URL

USERS = [
    ("admin1",   "password123", "admin"),
    ("teller1",  "password123", "teller"),
    ("auditor1", "password123", "auditor"),
]

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

for username, password, role in USERS:
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    try:
        cur.execute("""
            INSERT INTO users (username, password_hash, role)
            VALUES (%s, %s, %s)
            ON CONFLICT (username) DO NOTHING
        """, (username, hashed, role))
        print(f"Created: {username} ({role})")
    except Exception as e:
        print(f"Skipped {username}: {e}")

conn.commit()
cur.close()
conn.close()
print("Done.")
