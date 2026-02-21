import uuid
from repository import insert_customer, get_customer_by_id

fake_id = str(uuid.uuid4())
fake_encrypted = b"111111"
fake_index = b"222222"

insert_customer(fake_id, fake_encrypted, fake_index)

print("Inserted successfully")

data = get_customer_by_id(fake_id)

print("Fetched data:")
print(data)

from repository import delete_customer

print("Deleting record...")
delete_customer(fake_id)

data_after_delete = get_customer_by_id(fake_id)
print("After delete:", data_after_delete)

from repository import update_customer

print("Updating record...")

update_customer(fake_id, b"999999", b"888888")

updated_data = get_customer_by_id(fake_id)
print("After update:", updated_data)

from repository import fetch_candidates_by_search_mask

print("Fetching by mask...")

matches = fetch_candidates_by_search_mask(b"888888")
print("Mask matches:", matches)

from repository import log_action

log_action("admin", "Created customer ACC123456")
log_action("admin", "Deleted customer ACC998877")

print("Audit entries inserted")