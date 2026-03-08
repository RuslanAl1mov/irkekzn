from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class DefaultPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(
            {
                "pages": self.page.paginator.num_pages,
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "result": data,
            }
        )


class UsersListPagination(DefaultPagination):
    def get_paginated_response(self, data):
        # Получаем статистику из request
        stats = getattr(self.request, "stats", {})
        total_count = stats.get("total_count", self.page.paginator.count)
        inactive_count = stats.get("inactive_count", 0)

        return Response(
            {
                "pages": self.page.paginator.num_pages,
                "count": total_count,
                "active": total_count - inactive_count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "result": data,
            }
        )
