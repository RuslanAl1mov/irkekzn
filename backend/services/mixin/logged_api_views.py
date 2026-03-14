from rest_framework import generics
from .logger_mixin import UserLoggingMixin
from rest_framework import viewsets


class LoggedCreateAPIView(UserLoggingMixin, generics.CreateAPIView):
    """
    CreateAPIView + логирование действия пользователя.
    """

    pass


class LoggedUpdateAPIView(UserLoggingMixin, generics.UpdateAPIView):
    """
    UpdateAPIView + логирование действий (PUT/PATCH).
    """

    pass



class LoggedDestroyAPIView(UserLoggingMixin, generics.DestroyAPIView):
    """
    DestroyAPIView + логирование действия пользователя.
    """

    pass