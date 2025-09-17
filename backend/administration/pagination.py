from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BaseResultPagination(PageNumberPagination):
    """Базовая пагинация для формирования ответа в едином формате."""
    def get_paginated_response(self, data):
        return Response({
            'total': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'result': data
        })


class ProductPagination(BaseResultPagination):
    page_size = 40
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductTagPagination(BaseResultPagination):
    page_size = 40
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductCategoryPagination(BaseResultPagination):
    page_size = 40
    page_size_query_param = 'page_size'
    max_page_size = 100