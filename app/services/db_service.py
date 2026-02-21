import psycopg2
from app.config import DATABASE_URL


def get_connection():
    return psycopg2.connect(DATABASE_URL)


# -----------------------------
# User management
# -----------------------------
def create_user(username: str, password_hash: str, role: str = "auditor"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO users (username, password_hash, role)
        VALUES (%s, %s, %s)
    """, (username, password_hash, role))
    conn.commit()
    cur.close()
    conn.close()


def get_user_by_username(username: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, username, password_hash, role
        FROM users WHERE username = %s
    """, (username,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return None
    return {"id": str(row[0]), "username": row[1], "password_hash": row[2], "role": row[3]}


def list_users():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, username, role, created_at
        FROM users ORDER BY created_at DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {"id": str(r[0]), "username": r[1], "role": r[2], "created_at": str(r[3])}
        for r in rows
    ]


def update_user_role(username: str, new_role: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE users SET role = %s WHERE username = %s", (new_role, username))
    conn.commit()
    cur.close()
    conn.close()


# -----------------------------
# Customer records
# -----------------------------
def insert_customer(customer_id: str, encrypted_blob: bytes, search_index: int):
    conn = get_connection()
    cur = conn.cursor()
    bitmask = format(search_index, '01024b')
    cur.execute("""
        INSERT INTO customer_records (id, encrypted_data, search_index)
        VALUES (%s, %s, %s::bit(1024))
    """, (customer_id, encrypted_blob, bitmask))
    conn.commit()
    cur.close()
    conn.close()


def fetch_candidates_by_search_mask(mask: int):
    conn = get_connection()
    cur = conn.cursor()
    bitmask = format(mask, '01024b')
    cur.execute("""
        SELECT id, encrypted_data, search_index, created_at
        FROM customer_records
        WHERE (search_index & %s::bit(1024)) = %s::bit(1024)
    """, (bitmask, bitmask))
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results


def update_customer(customer_id: str, encrypted_blob: bytes, search_index: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE customer_records SET encrypted_data = %s, search_index = %s WHERE id = %s
    """, (encrypted_blob, search_index, customer_id))
    conn.commit()
    cur.close()
    conn.close()


def delete_customer(customer_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM customer_records WHERE id = %s", (customer_id,))
    conn.commit()
    cur.close()
    conn.close()


def get_customer_by_id(customer_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, encrypted_data, search_index, created_at
        FROM customer_records WHERE id = %s
    """, (customer_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result