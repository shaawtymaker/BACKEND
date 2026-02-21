from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from app.auth.auth_service import require_role
from app.services.crypto_service import encrypt_and_index
from app.services.db_service import insert_customer, list_users, update_user_role

ROLES = {"teller", "auditor", "admin"}

router = APIRouter()


class CustomerRequest(BaseModel):
    name: str
    account_number: str
    account_type: str
    branch_code: str


@router.post("")
def create_customer(body: CustomerRequest, user=Depends(require_role("admin"))):
    """Admin only — encrypt and store a customer record."""
    payload = {
        "name":           body.name,
        "account_number": body.account_number,
        "account_type":   body.account_type,
        "branch_code":    body.branch_code,
    }
    encrypted, index = encrypt_and_index(payload)
    customer_id = str(uuid4())
    insert_customer(customer_id, encrypted, index)
    return {"id": customer_id, "status": "created"}


# ------------------------------------------------------------------
# User management (admin only)
# ------------------------------------------------------------------

@router.get("/users")
def get_users(user=Depends(require_role("admin"))):
    """List all users and their roles."""
    return {"users": list_users()}


class RoleUpdate(BaseModel):
    role: str


@router.patch("/users/{username}/role")
def assign_role(username: str, body: RoleUpdate, user=Depends(require_role("admin"))):
    """Assign a new role to a user."""
    if body.role not in ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(ROLES)}")
    update_user_role(username, body.role)
    return {"username": username, "role": body.role, "status": "updated"}
