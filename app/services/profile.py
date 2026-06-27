from typing import Dict, Optional, Any
import os

class ProfileService:
    def __init__(self, api_client):
        self.api_client = api_client
        self.profile = None

    async def load_profile(self) -> Dict[str, Any]:
       
        try:
            self.profile = await self.api_client.get_profile()
            return self.profile
        except Exception:
            raise

    async def update_profile(self, updates: Dict[str, str]) -> Dict[str, Any]:
       
        try:
            self.profile = await self.api_client.update_profile(updates)
            return self.profile
        except Exception:
            raise

    async def upload_profile_pic(self, file_path: str) -> Dict[str, Any]:
       
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        try:
            self.profile = await self.api_client.upload_profile_pic(file_path)
            return self.profile
        except Exception:
            raise

    async def delete_profile_pic(self) -> Dict[str, Any]:
        
        try:
            self.profile = await self.api_client.delete_profile_pic()
            return self.profile
        except Exception:
            raise

    def get_profile(self) -> Optional[Dict]:
        
        return self.profile

    def get_profile_field(self, field: str) -> Optional[str]:
        if self.profile:
            return self.profile.get(field)
        return None
