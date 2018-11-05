## Project Setup

- Make sure you have python and pip w/ `python --version` and `pip --version`
- Install virtualenv if you don't have it already w/ `pip install virtualenv`
- Create folder name (maybe 'django-react') for project and run `mkdir client` within it
- In the root (or backend folder if you want), run `virtualenv env` to create our environment (also creates an env folder)
- Activate our project with `source env/bin/activate`
- Install django w/ `pip install django`
- Install Django Rest Framework w/ `pip install djangorestframework`
- Start our project with `django-admin startproject src`
- Open project in VS Code w/ `code .`

# Integrating Django with VS Code

- Install the following extensions:

1. Python (Syntax highlight)
2. Django Template (for Django template language support)
3. Django Snippets (useful code snippets)

Note: You may also want to install pylint w/ `pip install -U pylint` or autopep8 for formatting `pip install -U autopep8`

## Add React App

- Run `npx create-react-app .` in the client folder

## Start Server

- `cd src` folder, then run ``python manage.py runserver`
- We'll get an error:

"You have 13 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them."

- Obviously run `python manage.py migrate`, and our migrations will be run and applied
- We can then run our server command again (`python manage.py runserver`)
- It should start up successfully from here, so we can go to 'http://127.0.0.1:8000/' or 'localhost:8000'

## Start our App

- Run `python manage.py startapp <app-label>` (here we can give our app a label, i.e. 'articles')
- So we'll run `python manage.py startapp articles`
- Now we're going to add articles to our 'settings.py' file in 'django-react' (or djreact, whatever the name of the folder is in 'src')
  _Note than an 'articles' folder was created for us upon running the last command_
- To the INSTALLED_APPS array in 'settings.py', we're going to add 'articles' as well as 'rest_framework' (for Django Rest Framework)
- Then we'll head to 'urls.py' (in the same folder) and add to url patterns:

```
from django.contrib import admin
from django.conf.urls import url, include

urlpatterns = [
    url('api-auth/', include('rest_framework.urls')),
    url(r'^admin/', admin.site.urls),
]
```

- Then we'll add some django rest framework default settings in settings.py underneath everything at the bottom (taken from django-rest-framework.org):

```
REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}
```

- Then we can run `python manage.py runserver` again to see if everything is correct

# Creating Models

- In 'articles' folder, we'll go to models.py and create our first model
- Our base model will come from Django's model (models.Model):

```
class Article(models.Model):
  title = models.CharField(max_length=100)
  content = models.TextField()

  def __str__(self):
    return self.title
  objects = models.Manager()
```

Note: https://stackoverflow.com/questions/45135263/class-has-no-objects-member

- Then we want to migrate everything with `python manage.py makemigrations` to create our Article model (it will tell us that we create a model 'Article')
- Then to actually perform/run the migration, we need to run `python manage.py migrate`
- Then we can run our server again `python manage.py runserver`

## Add New Model to Admin

- Now we need to _register_ our model
- Go to 'admin.py' and import our newly created Article model:

```
from .models import Article

admin.site.register(Article)
```

## Create a SuperUser

- Run `python manage.py createsuperuser`
- Put in some default values:
  (Username: 'conradknapp', Passwords: 'conradknapp')
- Then run the server and go to localhost:8000/admin to login

## Manually Create Articles

- In our admin panel, once we've signed in, we can click on the 'Add' button and manually add articles
- I'll add one with 'Title' of 'React' and content of lorem ipsum and another with title 'Vue' and the same content
- We've got some articles and now we're going to use the Django Rest Framework as the API we'll be using for our React client

## Serializers

- Serializers are the way that we convert JSON data into a model
- Then we'll go inside our articles folder and create a new folder called 'api'
- Here we'll create the **init**.py file (we don't have to do anything here)
- Then we need to declare our serializers. We'll do so in a 'serializers.py' file

```
from rest_framework import serializers

from articles.models import Article

class ArticleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Article
    field = ('title', 'content')
    fields = '__all__'
```

Note: https://github.com/maxolasersquad/orthosie/issues/35

- Then we'll create a new file in the api folder, which will be 'views.py'
- Here we'll import the generic views:

```
from rest_framework.generics import ListAPIView, RetrieveAPIView

from articles.models import Article
from .serializers import ArticleSerializer

class ArticleListView(ListAPIView):
  queryset = Article.objects.all()
  serializer_class = ArticleSerializer

class ArticleDetailView(RetrieveAPIView):
  queryset = Article.objects.all()
  serializer_class = ArticleSerializer
```

- Now we need some urls, so we'll create a 'urls.py' file in 'api'

```
from django.conf.urls import url

from .views import ArticleListView, ArticleDetailView

urlpatterns = [
  url('', ArticleListView.as_view()),
  url('<pk>', ArticleDetailView.as_view())
]
```

- Now we'll include this urls file in our project urls, so in 'djreact/urls.py', we'll add another path:

```
urlpatterns = [
    url('api-auth/', include('rest_framework.urls')),
    url(r'^admin/', admin.site.urls),
    url('api/', include('articles.api.urls'))
]
```

- Now if we go to 'http://localhost:8000/api/', we should get our two articles

## useEffect / axios to get API Data

- We'll use the 'useEffect' hook to get our articles

```
const App = () => {
  const [articles, setArticles] = useState([]);

  useEffect(async () => {
    const { data } = await axios.get('http://localhost:8000/api');
    setArticles(data);
  }, [])

  return (
    <div>
      {articles.map((article, i) => (
        <div key={i} style={{ marginBottom: '2em' }}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  )
}
```

- But we get a CORS error:

"Access to XMLHttpRequest at 'http://localhost:8000/api' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource."

- We need to use 'django cors headers' to fix this, `pip install cors-header`
- Then we go 'settings.py' in 'dj-react' and add the text 'corsheaders' to INSTALLED_APPS
- Also we need to add the following line to MIDDLEWARE: 'corsheaders.middleware.CorsMiddleware' ([make sure it is above all other middleware](<https://github.com/crs4/ome_seadragon/wiki/Enable-Django-CORS-(Cross-Origin-Resource-Sharing)-Headers-configuration>))
- Then at the very bottom of 'settings.py', set CORS_ORIGIN_ALLOW_ALL = True

And finally we should have our two articles displayed!!

- One last note, to get an id to more easily iterate over our articles, we can go to our serializers.py file an add

```
const useAxios = url => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const { data } = axios.get(url);
    setData(data);
    setLoading(false);
  }, []);

  return { data, loading }
}

const ArticleDetail = ({ articleId }) => {
  const { data, loading } = useAxios(`/api/${articleId}`);

  return !loading && (
    <div>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
    </div>
  )
}
```
