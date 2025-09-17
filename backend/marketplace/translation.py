from modeltranslation.translator import register, TranslationOptions
from .models import (
    ProductCategory,
    ProductTag,
    Product,
    MeasurementType,
    MeasurementUnit,
)

@register(ProductCategory)
class ProductCategoryTranslationOptions(TranslationOptions):
    """
    Переводимые поля для категории товара:
    - name: название категории
    - description: описание категории
    """
    fields = (
        'name',
        'description',
    )

@register(ProductTag)
class ProductTagTranslationOptions(TranslationOptions):
    """
    Переводимые поля для тега товара:
    - name: название тега
    """
    fields = (
        'name',
    )

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    """
    Переводимые поля для товара:
    - name: название товара
    - description: короткое описание
    - description_short: полное описание
    """
    fields = (
        'name',
        'description',
        'description_short',
    )

@register(MeasurementType)
class MeasurementTypeTranslationOptions(TranslationOptions):
    """
    Переводимые поля для типа измерения:
    - name: название параметра
    """
    fields = (
        'name',
    )

@register(MeasurementUnit)
class MeasurementUnitTranslationOptions(TranslationOptions):
    """
    Переводимые поля для единицы измерения:
    - name: обозначение единицы (мм, см и т.д.)
    """
    fields = (
        'name',
    )
