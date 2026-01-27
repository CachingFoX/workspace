from datetime import timedelta
from datetime import datetime
from typing import Optional
from passlib.context import CryptContext
from jose import jwt
import logging
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

logger = logging.getLogger(__name__)


SECRET_KEY = "SUPER_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def hash_password(password):
    return pwd_context.hash(password)


def get_token_payload(token):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


fake_users_db = {
    "CachingFoX": {
        "username": "CachingFoX",
        "hashed_password": hash_password("otter"),
        "role": "admin",
        "version": 0,
    },
    "Waldkauz1977": {
        "username": "Waldkauz1977",
        "hashed_password": hash_password("tiger"),
        "role": "admin",
        "version": 0,
    },
    "bob": {
        "username": "bob",
        "hashed_password": hash_password("password"),
        "role": "user",
        "version": 0,
    },
}


# tokenUrl must be identical with endpoint!
def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    try:
        payload = get_token_payload(token)
        username: str = payload.get("sub")
        role: str = payload.get("role")
        version: int = payload.get("version")

        if username is None:
            logging.warning("username is not set")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="user name is not set"
            )

        if username not in fake_users_db:
            logging.warning("username is unknown")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"username '{username}' is unknown",
            )

        user = fake_users_db[username]
        if version != user["version"]:
            logging.warning("version doesn't match")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        return {"username": username, "name": username, "role": role, "avatar": "?"}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


def update_user_token_timestamp(username: str):
    fake_users_db[username]["version"] += 1
    pass


def create_new_token(username: str, password: str):
    user = fake_users_db.get(username)
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    token = create_access_token(
        data={
            "sub": user["username"],
            "role": user["role"],
            "version": user["version"],
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer"}
