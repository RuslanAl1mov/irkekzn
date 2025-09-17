from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import ClientCallRequestListView, ClientCallRequestCreateView

urlpatterns = [
    # Client call request
    path('client-call-requests/', ClientCallRequestListView.as_view(), name='client_call_request_list'),
    path('client-call-requests/create/', ClientCallRequestCreateView.as_view(), name='create_client_call_request'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
