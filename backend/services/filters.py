from django_filters import rest_framework as filters

class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    """
    Класс фильтрации значений полей с целым числом с помощью lookup`а in
    """
    pass

class ChoiceInFilter(filters.BaseInFilter, filters.ChoiceFilter):
    """
    Класс фильтрации значений полей со строкой с помощью lookup`а in
    """
    pass