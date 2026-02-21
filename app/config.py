import os
from dotenv import load_dotenv

load_dotenv()

DATA_ENCRYPTION_KEY = os.getenv("DATA_ENCRYPTION_KEY")
SEARCH_INDEX_KEY = os.getenv("SEARCH_INDEX_KEY")
JWT_SECRET = os.getenv("JWT_SECRET")