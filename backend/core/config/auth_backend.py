import re
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()
PHONE_RE = re.compile(r"^\+?\d{9,15}$")


class EmailOrPhoneBackend(ModelBackend):
    """
    • e-mail  → сотрудник
    • телефон → клиент
    """

    def authenticate(self, request, phone=None, email=None, password=None, **kwargs):
        try:
            if phone and PHONE_RE.match(phone or ""):
                user = User.objects.get(phone=phone, role=User.UserType.CLIENT)
            elif email:
                user = User.objects.get(email=email, role=User.UserType.EMPLOYEE)
            else:
                return None
        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
