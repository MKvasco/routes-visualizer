import django.contrib.auth.password_validation as validators
from django.core import exceptions
from rest_framework import serializers

from .models import UserModel
from .models import FileModel
from .models import RouteBaseModel
from .models import RouteModel

###### Serializers

class BaseSerializer(serializers.ModelSerializer):
  def __init__(self, *args, **kwargs):
    fields = kwargs.pop('fields', None)
    super().__init__(*args, **kwargs)

    if fields is not None:
        allowed = set(fields)
        existing = set(self.fields)
        for field_name in existing - allowed:
            self.fields.pop(field_name)

class UserSerializer(BaseSerializer):
  class Meta:
    model = UserModel
    fields = ['id', 'name', 'email', 'password']
    extra_kwargs = {
      'password': { 'write_only': True }
    }

  def validate(self, data):
    user = UserModel(**data)
    password = data.get('password')
    errors = dict()

    try:
      validators.validate_password(password=password, user=user)
    except exceptions.ValidationError as e:
      errors['password'] = list(e.messages)

    if errors:
      raise serializers.ValidationError(errors)
    return data

  def create(self, validated_data):
    password = validated_data.pop('password', None)
    instance = self.Meta.model(**validated_data)
    if password is not None:
      instance.set_password(password)
    instance.save()
    return instance
  


class FileSerializer(BaseSerializer):
  class Meta:
    model = FileModel
    fields = '__all__'

class RouteBaseSerializer(BaseSerializer):
  class Meta:
    model = RouteBaseModel
    fields = '__all__'

  