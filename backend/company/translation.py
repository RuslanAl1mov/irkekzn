from modeltranslation.translator import register, TranslationOptions
from .models import (
    AboutCompany,
    Market
)

@register(AboutCompany)
class AboutCompanyTranslationOptions(TranslationOptions):
    """
    Переводимые поля информции о компании:
    - shortdescription: короткое описание компании
    - office_address: адрес офиса
    """
    fields = (
        'shortdescription',
        'office_address',
    )

@register(Market)
class MarketTranslationOptions(TranslationOptions):
    """
    Переводимые поля информции о магазинах:
    - name: название магазина
    - address: адрес магазина
    """
    fields = (
        'name',
        'address',
    )
