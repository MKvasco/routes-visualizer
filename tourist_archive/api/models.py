from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField


##### Models

class UserModel(AbstractUser):
  name = models.CharField(max_length=255)
  email = models.CharField(max_length=255, unique=True)
  password = models.CharField(max_length=255)
  username = None

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []

  class Meta:
    db_table = "user_model"

class FileModel(models.Model):
  id = models.AutoField(primary_key=True)
  file = models.FileField(upload_to='api/data', blank=False, null=False)
  timestamp = models.DateTimeField(auto_now_add=True)

  class Meta:
    db_table = "file_model"

class RouteModel(models.Model):
  id = models.AutoField(primary_key=True)
  user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE, blank=False, null=False)
  file_id = models.ForeignKey(FileModel, on_delete=models.CASCADE, blank=False, null=False)
  title = models.CharField(max_length=32, blank=True, null=False)
  description = models.TextField(blank=True, null=False)
  date_start = models.DateTimeField()
  date_end = models.DateTimeField()
  # elevation_average = models.CharField(max_length=64, blank=True, null=True)
  # elevation_difference = models.CharField(max_length=64, blank=True, null=True)
  # https://docs.djangoproject.com/en/4.0/ref/contrib/postgres/fields/#arrayfield
  # pieces = ArrayField(ArrayField(models.IntegerField()))
  route_line = models.LineStringField(srid=4326, blank=False, null=False)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    db_table = "route_model"

  def get_duration():
    pass


