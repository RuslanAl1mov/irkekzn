from datetime import timedelta
from django.conf import settings
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class SetCookieService:
    """
    Класс установки кук в ответ запроса
    """

    @staticmethod
    def _seconds(v: timedelta | int | str) -> int:
        """
        Функция перевода секунд в Int

        :param v: Секунды
        :type v: timedelta | int | str
        :return: Секунды в Int
        :rtype: int
        """
        return int(v.total_seconds()) if isinstance(v, timedelta) else int(v)

    def set_access_token_to_cookie(self, response: Response, token: str) -> None:
        """
        Функция установки access токена в куки

        :param response: Объект ответа запроса
        :type response: Response
        :param token: access токен
        :type token: str
        """
        response.set_cookie(
            key=settings.REST_AUTH.get("JWT_AUTH_COOKIE"),
            value=token,
            httponly=settings.REST_AUTH.get("JWT_AUTH_HTTPONLY"),
            secure=settings.REST_AUTH.get("JWT_AUTH_SECURE"),
            samesite=settings.REST_AUTH.get("JWT_AUTH_SAMESITE"),
            max_age=self._seconds(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]),
        )

    def set_refresh_token_to_cookie(self, response: Response, token: str) -> None:
        """
        Функция установки refresh токена в куки

        :param response: Объект ответа запроса
        :type response: Response
        :param token: refresh токен
        :type token: str
        """
        response.set_cookie(
            key=settings.REST_AUTH.get("JWT_AUTH_REFRESH_COOKIE"),
            value=token,
            httponly=settings.REST_AUTH.get("JWT_AUTH_HTTPONLY"),
            secure=settings.SESSION_COOKIE_SECURE,
            samesite=settings.REST_AUTH.get("JWT_AUTH_SAMESITE"),
            max_age=self._seconds(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]),
        )

    def set_response_cookie(self, response: Response, token: RefreshToken) -> None:
        """
        Функция установки токенов в ответ запроса

        :param response: Объект ответа запроса
        :type response: Response
        :param token: Токен
        :type token: RefreshToken
        """
        self.set_access_token_to_cookie(response, str(token.access_token))
        self.set_refresh_token_to_cookie(response, str(token))
