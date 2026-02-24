from rest_framework.renderers import JSONRenderer


class WrappedJSONRenderer(JSONRenderer):
    """
    Кастомный рендерер, который оборачивает данные ответа в ключ "result",
    если ответ не содержит ошибок (status_code < 300) и не содержит ключ 'detail'.
    Поддерживает как dict (например, {}), так и list (например, []).
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response") if renderer_context else None

        if response is not None and response.status_code < 300:
            if isinstance(data, dict):
                if "result" not in data and "detail" not in data:
                    data = {"result": data}

            elif isinstance(data, list):
                data = {"result": data}

        return super().render(data, accepted_media_type, renderer_context)
