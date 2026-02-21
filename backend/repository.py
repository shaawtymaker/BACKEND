from connection import get_connection


def insert_customer(customer_id, encrypted_data, search_index):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO customer_records (id, encrypted_data, search_index)
        VALUES (%s, %s, %s)
    """, (customer_id, encrypted_data, search_index))

    conn.commit()
    cur.close()
    conn.close()

    log_action("admin", f"Inserted customer {customer_id}")

def get_customer_by_id(customer_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, encrypted_data, search_index, created_at
        FROM customer_records
        WHERE id = %s
    """, (customer_id,))

    result = cur.fetchone()

    cur.close()
    conn.close()

    return result

def delete_customer(customer_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM customer_records
        WHERE id = %s
    """, (customer_id,))

    conn.commit()

    cur.close()
    conn.close()
    log_action("admin", f"Deleted customer {customer_id}")

def update_customer(customer_id, encrypted_data, search_index):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE customer_records
        SET encrypted_data = %s,
            search_index = %s
        WHERE id = %s
    """, (encrypted_data, search_index, customer_id))

    conn.commit()

    cur.close()
    conn.close() 
    log_action("admin", f"Updated customer {customer_id}")   

def fetch_candidates_by_search_mask(mask):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, encrypted_data, search_index, created_at
        FROM customer_records
        WHERE search_index = %s
    """, (mask,))

    results = cur.fetchall()

    cur.close()
    conn.close()

    return results
def log_action(role, action):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO audit_logs (role, action)
        VALUES (%s, %s)
    """, (role, action))

    conn.commit()

    cur.close()
    conn.close()