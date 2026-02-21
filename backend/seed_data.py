import uuid
from repository import insert_customer

def seed():

    customers = [
        {
            "name": "Rahul Verma",
            "account_number": "ACC123456",
            "account_type": "Savings",
            "branch_code": "BLR01"
        },
        {
            "name": "Anita Rao",
            "account_number": "ACC998877",
            "account_type": "Current",
            "branch_code": "MUM02"
        },
        {
            "name": "Vikram Singh",
            "account_number": "ACC556677",
            "account_type": "Savings",
            "branch_code": "DEL03"
        },
        {
            "name": "Priya Nair",
            "account_number": "ACC112233",
            "account_type": "Current",
            "branch_code": "CHE04"
        },
        {
            "name": "Arjun Mehta",
            "account_number": "ACC445566",
            "account_type": "Savings",
            "branch_code": "HYD05"
        }
    ]

    for customer in customers:
        fake_id = str(uuid.uuid4())

        # TEMPORARY fake encryption
        encrypted_blob = str(customer).encode()
        search_index = customer["account_number"].encode()

        insert_customer(fake_id, encrypted_blob, search_index)

        print(f"Inserted: {customer['name']}")

if __name__ == "__main__":
    seed()