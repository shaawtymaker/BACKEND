from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.auth.auth_service import get_current_user
from app.services.crypto_service import decrypt_customer, build_search_query
from app.services.db_service import fetch_candidates_by_search_mask

router = APIRouter()


class SearchRequest(BaseModel):
    query: str


@router.post("/search")
def search(body: SearchRequest, user=Depends(get_current_user)):
    query_mask = build_search_query(body.query)
    records = fetch_candidates_by_search_mask(query_mask)

    if user["role"] == "teller":
        # psycopg2 returns BYTEA as memoryview — must convert to bytes first
        decrypted = [decrypt_customer(bytes(record[1])) for record in records]
        return {"results": decrypted}

    elif user["role"] == "auditor":
        return {"results": [{"record_id": record[0]} for record in records]}

    return {"results": []}