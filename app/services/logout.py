from typing import Callable, Optional

class LogoutService:
    def __init__(self):
        self.show_confirmation = False
        self.on_logout_confirmed = None

    def handle_logout_click(self):
        self.show_confirmation = True

    def handle_confirm_logout(self, callback: Optional[Callable] = None):
        self.show_confirmation = False
        if self.on_logout_confirmed:
            self.on_logout_confirmed()
        if callback:
            callback()

    def handle_cancel_logout(self):
        self.show_confirmation = False

    def is_showing_confirmation(self) -> bool:
        
        return self.show_confirmation

    def set_on_logout_callback(self, callback: Callable):
        self.on_logout_confirmed = callback
