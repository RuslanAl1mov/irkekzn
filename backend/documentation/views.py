from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.renderers import OpenApiJsonRenderer, OpenApiYamlRenderer

from .schema import MANUAL_OPENAPI_SCHEMA

class ManualSchemaView(APIView):
    """
    Отдаёт ручную OpenAPI-схему
    """
    permission_classes = [AllowAny]
    renderer_classes = [OpenApiJsonRenderer, OpenApiYamlRenderer]

    def get(self, request, *args, **kwargs):
        return Response(MANUAL_OPENAPI_SCHEMA)