from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import PermissionDenied
from django.middleware.csrf import CsrfViewMiddleware


class ForceCsrfAuthentication(BaseAuthentication):
    """
    Пример кастомной аутентификации, которая принудительно вызывает проверку CSRF для любого запроса.
    
    По умолчанию DRF с SessionAuthentication не вызывает CSRF-проверку для анонимных запросов,
    поэтому POST-запрос может проходить без валидного CSRF-токена.
    
    Здесь мы вручную вызываем CSRF-проверку через методы CsrfViewMiddleware:
      - process_request() – проверяет наличие CSRF-токена в запросе.
      - process_view() – выполняет дополнительную проверку контекста представления.
    
    Для корректной работы проверки мы передаём фиктивную функцию (lambda), так как CsrfViewMiddleware
    требует аргумент get_response, а также используем dummy_view в process_view.
    
    Важно: чтобы проверка прошла, в запросе должны присутствовать:
      • Cookie с именем 'csrftoken'
      • Заголовок 'X-CSRFToken' с тем же значением, что и в cookie.
    Если хотя бы один из этих элементов отсутствует или значения не совпадают – будет возвращён 403.
    """

    def authenticate(self, request):
        # Фиктивная функция для get_response, необходимая для инициализации CsrfViewMiddleware.
        dummy_get_response = lambda req: None
        csrf_mw = CsrfViewMiddleware(dummy_get_response)

        # Выполняем проверку CSRF через process_request.
        response = csrf_mw.process_request(request)
        if response:
            raise PermissionDenied("CSRF Failed: process_request")
        
        # Создаём фиктивное представление для корректной работы process_view.
        dummy_view = lambda req, *args, **kwargs: None
        response = csrf_mw.process_view(request, dummy_view, (), {})
        if response:
            raise PermissionDenied("CSRF Failed: process_view")
        
        return (None, None)
