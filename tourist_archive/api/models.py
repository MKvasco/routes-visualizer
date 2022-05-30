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
  #TODO: send from fronetend current user, if froneend implemented swtich Trues to Falses
  user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE, blank=True, null=True)
  timestamp = models.DateTimeField(auto_now_add=True)

  class Meta:
    db_table = "file_model"
  
  def __str__(self):
    return '%s' % (self.file)

class RouteModel(models.Model):
  id = models.AutoField(primary_key=True)
  route_name = models.CharField(max_length=32, blank=True, null=False)
  title = models.CharField(max_length=32, blank=True, null=True)
  description = models.TextField(blank=True, null=True)
  file_id = models.ForeignKey(FileModel, on_delete=models.CASCADE, blank=False, null=False)
  points_line = models.LineStringField(srid=4326, blank=False, null=False)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    db_table = "route_model"



    
  # https://docs.djangoproject.com/en/4.0/ref/contrib/postgres/fields/#arrayfield
  # pieces = ArrayField(ArrayField(models.IntegerField()))
  # from django.contrib.postgres.fields import ArrayField
  #TODO: make calculations -> duration, time start end , elevation gain, elevation loss, elevation overall etc...
  def get_duration():
    pass


