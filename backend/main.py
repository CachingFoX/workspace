from backend.api import create_api
from backend.settings import ApiSettings

settings = ApiSettings(
    database_url="sqlite:///./data/develop/app.db",
    short_name="develop",
    upload_path="./data/develop/uploads",
)

app = create_api(settings)

# --------------------
# Starten mit:
# uvicorn main:app --reload
# --------------------
