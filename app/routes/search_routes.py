from fastapi import APIRouter, Depends
from app.auth.auth_service import get_current_user
from app.services.crypto_service import decrypt_customer, build_search_query
from app.services.fake_db import search_db

router = APIRouter()

@router.post("/search")
def search(query: str, user=Depends(get_current_user)):

    query_mask = build_search_query(query)
    results = search_db(query_mask)

    if user["role"] == "teller":
        # Decrypt results
        decrypted = [
            decrypt_customer(r["encrypted_data"])
            for r in results
        ]
        return {"results": decrypted}

    elif user["role"] == "auditor":
        # Return metadata only
        return {
            "results": [
                {"record_id": idx}
                for idx, _ in enumerate(results)
            ]
        }

    else:
        return {"results": []}