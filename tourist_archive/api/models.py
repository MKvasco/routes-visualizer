from datetime import datetime
from django.contrib.auth.models import AbstractUser, UserManager, PermissionsMixin
from django.contrib.gis.db import models

##### Models

class UserManagerModel(UserManager):
  def create_user(self, email, name, password):
    if not email:
        raise ValueError('Email is required!')
    
    email = UserManagerModel.normalize_email(email)
    date_now = datetime.now()
    user = self.model(email=email, name=name, is_staff=False, is_active=True,
                      is_superuser=False, date_joined=date_now, last_login=date_now)
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, name, password):
    superuser = self.create_user(email, name, password)
    superuser.is_staff = True
    superuser.is_active = True
    superuser.is_superuser = True
    superuser.save(using=self._db)
    return superuser

class UserModel(AbstractUser, PermissionsMixin):
  email = models.CharField(max_length=64, unique=True)
  name = models.CharField(max_length=32)
  password = models.CharField(max_length=255)
  username = None
  objects = UserManagerModel()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name', 'password']

  class Meta:
    db_table = "user_model"

class FileModel(models.Model):
  id = models.AutoField(primary_key=True)
  file = models.FileField(upload_to='data/imports', blank=False, null=False)
  user = models.ForeignKey(UserModel, on_delete=models.CASCADE, blank=False, null=True)
  timestamp = models.DateTimeField(auto_now_add=True)

  class Meta:
    db_table = "file_model"
  
  def __str__(self):
    return '%s' % (self.file)
  
class RouteModel(models.Model):
  # Primary key
  id = models.AutoField(primary_key=True)

  # User specifications
  title = models.CharField(max_length=16, blank=True, null=True, default="untitled")
  description = models.TextField(blank=True ,null=True, default="undescribed")
  file = models.ForeignKey(FileModel, on_delete=models.CASCADE, blank=False, null=False)
  # TODO: check how to update modified_at after upadte
  route_width = models.IntegerField(blank=False, null=False, default=5)
  route_color = models.CharField(max_length=12, blank=False, null=False, default="#000000")
  modified_at = models.DateTimeField(auto_now_add=True)

  # Route info
  route_name = models.CharField(max_length=32, blank=True, null=True, default="N/a")
  route_line_string = models.LineStringField(srid=4326, blank=False, null=False)
  route_points_count = models.IntegerField(blank=False, null=False)
  elevation_min = models.FloatField(null=True, blank=False)
  elevation_max = models.FloatField(null=True, blank=False)
  started_at = models.DateTimeField(null=True, blank=False)
  ended_at = models.DateTimeField(null=True, blank=False)

  class Meta:
    db_table = "route_model"
