from django.contrib.sitemaps import Sitemap
from marketplace.models import Product, ProductCategory

FRONT_DOMAIN = "irkekzn.com"   # домен фронта (React)
PROTOCOL = "https"           # https для продакшна


class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = PROTOCOL

    def items(self):
        return Product.objects.filter(is_actual=True).only("slug", "date_created")

    def lastmod(self, obj):
        # у модели нет updated_at — используем date_created
        return obj.date_created

    def location(self, obj):
        return f"/product/{obj.slug}"

    # Форсим домен фронта (чтобы не попал api-домен)
    def get_urls(self, page=1, site=None, protocol=None):
        class _Site:
            domain = FRONT_DOMAIN
            name = FRONT_DOMAIN
        return super().get_urls(page=page, site=_Site(), protocol=self.protocol)


class CategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6
    protocol = PROTOCOL

    def items(self):
        return ProductCategory.objects.filter(is_actual=True).only("slug", "date_created")

    def lastmod(self, obj):
        return obj.date_created

    def location(self, obj):
        return f"/category/{obj.slug}"

    def get_urls(self, page=1, site=None, protocol=None):
        class _Site:
            domain = FRONT_DOMAIN
            name = FRONT_DOMAIN
        return super().get_urls(page=page, site=_Site(), protocol=self.protocol)


class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.5
    protocol = PROTOCOL

    def items(self):
        # базовые страницы фронта
        return ["/", "/search", "/about", "/contacts"]

    def location(self, item):
        return item

    def get_urls(self, page=1, site=None, protocol=None):
        class _Site:
            domain = FRONT_DOMAIN
            name = FRONT_DOMAIN
        return super().get_urls(page=page, site=_Site(), protocol=self.protocol)
