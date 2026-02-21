from app.services.crypto_service import encrypt_and_index

# Simulated DB table
FAKE_DB = []

def seed_data():
    customers = [
        {
            "name": "Rahul Verma",
            "account_number": "ACC123456",
            "account_type": "Savings",
            "branch_code": "BLR01"
        },
        {
            "name": "Anita Sharma",
            "account_number": "ACC789012",
            "account_type": "Current",
            "branch_code": "DEL02"
        }
    ]

    for c in customers:
        encrypted, index = encrypt_and_index(c)
        FAKE_DB.append({
            "encrypted_data": encrypted,
            "search_index": index
        })

def search_db(query_mask):
    results = []
    for record in FAKE_DB:
        if record["search_index"] & query_mask == query_mask:
            results.append(record)
    return results