from api import create_api
from settings import ApiSettings

settings = ApiSettings(database_url="sqlite:///./app.db", upload_path="./uploads")

app = create_api(settings)

# --------------------
# Starten mit:
# uvicorn main:app --reload
# --------------------
