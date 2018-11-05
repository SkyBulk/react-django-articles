from django.conf.urls import url

from .views import ArticleListView, ArticleDetailView

urlpatterns = [
    url(r'^api/', ArticleListView.as_view()),
    url(r'^api/(?P<pk>\d+)$', ArticleDetailView.as_view())
]
