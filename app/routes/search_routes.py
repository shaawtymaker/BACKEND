from fastapi import APIRouter, Depends
from app.auth.auth_service import get_current_user
from app.services.crypto_service import decrypt_customer, build_search_query
from app.services.db_service import fetch_candidates_by_search_mask

router = APIRouter()

@router.post("/search")
def search(query: str, user=Depends(get_current_user)):

    query_mask = build_search_query(query)
    records = fetch_candidates_by_search_mask(query_mask)

    if user["role"] == "teller":
        decrypted = [
            decrypt_customer(record[1])
            for record in records
        ]
        return {"results": decrypted}

    elif user["role"] == "auditor":
        return {
            "results": [
                {"record_id": record[0]}
                for record in records
            ]
        }

    return {"results": []}