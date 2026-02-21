from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.auth.auth_service import authenticate_user, create_access_token, hash_password
from app.services.db_service import get_user_by_username, create_user

router = APIRouter()


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    """Public endpoint. New users are always created with role='auditor'."""
    if get_user_by_username(body.username):
        raise HTTPException(status_code=409, detail="Username already taken")
    hashed = hash_password(body.password)
    create_user(body.username, hashed, role="auditor")
    return {"status": "registered", "role": "auditor"}


@router.post("/login")
def login(body: LoginRequest):
    user = authenticate_user(body.username, body.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "username": user["username"],
    }