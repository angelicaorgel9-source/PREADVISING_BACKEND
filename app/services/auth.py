from typing import Optional, Dict, Any
import json
import os

class AuthService:
    def __init__(self):
        self.user_storage_file = ".user_session"
        self._user = None
        self._load_user_from_storage()

    def _load_user_from_storage(self):
        try:
            if os.path.exists(self.user_storage_file):
                with open(self.user_storage_file, "r") as f:
                    self._user = json.load(f)
        except Exception:
            self._user = None

    def _save_user_to_storage(self, user_data: Dict):
        try:
            with open(self.user_storage_file, "w") as f:
                json.dump(user_data, f)
        except Exception:
            pass

    async def handle_login(self, api_client, username: str, password: str) -> Dict[str, Any]:
       
        try:
            response = await api_client.login(username, password)
            self._user = response.get("user")
            self._save_user_to_storage(self._user)
            return self._user
        except Exception:
            raise

    def handle_logout(self):
        self._user = None
        if os.path.exists(self.user_storage_file):
            os.remove(self.user_storage_file)

    @property
    def user(self) -> Optional[Dict]:
        return self._user

    @property
    def is_authenticated(self) -> bool:
        return self._user is not None

    def get_user_field(self, field: str) -> Optional[str]:
        if self._user:
            return self._user.get(field)
        return None
