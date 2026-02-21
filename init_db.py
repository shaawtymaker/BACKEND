import psycopg2
from app.config import DATABASE_URL

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username     TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role         TEXT NOT NULL DEFAULT 'auditor',
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS customer_records (
    id             UUID PRIMARY KEY,
    encrypted_data BYTEA NOT NULL,
    search_index   BIT(1024) NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);
""")

conn.commit()
cur.close()
conn.close()
print("Tables created successfully.")
