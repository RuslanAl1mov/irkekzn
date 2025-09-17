from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import AboutCompanyActualInfoView, AboutCompanyUpdateView

urlpatterns = [    
    # About company
    path('about-company/', AboutCompanyActualInfoView.as_view(), name='about_company'),
    path('about-company/<int:pk>/update/', AboutCompanyUpdateView.as_view(), name='about_company_update'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
