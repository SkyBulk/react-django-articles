from rest_framework import serializers

from articles.models import Article

class ArticleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Article
    field = ('title', 'content')
    fields = '__all__'