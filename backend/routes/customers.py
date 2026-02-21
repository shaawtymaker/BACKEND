from fastapi import APIRouter
from repository import insert_customer, update_customer, delete_customer, get_customer_by_id

router = APIRouter()

@router.post("/customers")
def create_customer(customer_data: dict):
    # P1 WILL PROVIDE THIS
    encrypted_blob, search_index = encrypt_and_index(customer_data)

    customer_id = customer_data["id"]

    insert_customer(customer_id, encrypted_blob, search_index)

    return {"message": "Customer created"}
from fastapi import APIRouter, Depends
from repository import (
    insert_customer,
    update_customer,
    delete_customer,
    get_customer_by_id
)

# From P1
from crypto_module import encrypt_and_index
from auth_module import require_role

router = APIRouter()


@router.post("/customers")
def create_customer(data: dict, role=Depends(require_role("admin"))):
    encrypted_blob, search_index = encrypt_and_index(data)

    customer_id = data["id"]

    insert_customer(customer_id, encrypted_blob, search_index)

    return {"message": "Customer created"}


@router.put("/customers/{customer_id}")
def update_customer_route(customer_id: str, data: dict, role=Depends(require_role("admin"))):
    encrypted_blob, search_index = encrypt_and_index(data)

    update_customer(customer_id, encrypted_blob, search_index)

    return {"message": "Customer updated"}


@router.delete("/customers/{customer_id}")
def delete_customer_route(customer_id: str, role=Depends(require_role("admin"))):
    delete_customer(customer_id)
    return {"message": "Customer deleted"}


@router.get("/customers/{customer_id}")
def get_customer_route(customer_id: str, role=Depends(require_role("admin"))):
    record = get_customer_by_id(customer_id)

    if not record:
        return {"error": "Not found"}

    return {"id": record[0], "created_at": record[3]}