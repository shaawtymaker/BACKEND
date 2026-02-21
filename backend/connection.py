import psycopg2

def get_connection():
    return psycopg2.connect(
        dbname="bank_secure_db",
        user="postgres",
        password="Postgre@11",
        host="localhost",
        port="5000"
    )