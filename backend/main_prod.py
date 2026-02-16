from backend.api import create_api
from backend.settings import ApiSettings

settings = ApiSettings(
    database_url="sqlite:///./data/prod/app.db",
    short_name="prod",
    upload_path="./data/prod/uploads",
)

app = create_api(settings)

# --------------------
# Starten mit:
# uvicorn main:app --reload
# --------------------
