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


class RequestLogsListPagination(DefaultPagination):
    pass


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


class ShopsListPagination(DefaultPagination):
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


class SizesListPagination(DefaultPagination):
    pass


class ColorPaletteListPagination(DefaultPagination):
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


class ProductCategoryListPagination(DefaultPagination):
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


class ProductCardListPagination(DefaultPagination):
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


class ProductListPagination(DefaultPagination):
    def get_paginated_response(self, data):
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


class ProductStockListPagination(DefaultPagination):
    def get_paginated_response(self, data):
        stats = getattr(self.request, "product_stock_stats", {})
        return Response(
            {
                "pages": self.page.paginator.num_pages,
                "count": self.page.paginator.count,
                "total_amount": stats.get("total_amount", 0),
                "unique_products": stats.get("unique_products", 0),
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "result": data,
            }
        )