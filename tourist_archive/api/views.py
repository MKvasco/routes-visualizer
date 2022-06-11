from django.shortcuts import get_object_or_404
from dotenv import load_dotenv
import jwt, datetime, os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import api_view
from rest_framework import status, viewsets

from .serializers import FileSerializer, RouteSerializer, UserSerializer
from .models import FileModel, RouteModel, UserModel
from .services.parsers.parser import parse_file

load_dotenv()

### ViewSets

class FileViewSet(viewsets.ViewSet):

  queryset = FileModel.objects.all()

  def list(self, request):
    queryset = FileModel.objects.all()
    serializer = FileSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def create(self, request):
    user = get_current_user(request)
    serializer = FileSerializer(data=request.data, fields=('id', 'file', 'user_id', 'timestamp'))
    if serializer.is_valid():
      serializer.save(user_id=user)
      parse_file(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def retrieve(self, request, pk=None):
    file = get_object_or_404(self.queryset, pk=pk)
    serializer = FileSerializer(file)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def update(self, request, pk=None):
    file = get_object_or_404(self.queryset, pk=pk)
    serializer = FileSerializer(file, data=request.data, fields=('file',))
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

  def destroy(self, request, pk=None):
    file = get_object_or_404(self.queryset, pk=pk)
    file.delete()
    os.remove(str(file))
    return Response(status=status.HTTP_204_NO_CONTENT)

class RouteViewSet(viewsets.ViewSet):

  queryset = RouteModel.objects.all()

  def list(self, request):
    #TODO: at end check how caching works with queries
    queryset = RouteModel.objects.all()
    serializer = RouteSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def retrieve(self, request, pk=None):
    base_route = get_object_or_404(self.queryset, pk=pk)
    serializer = RouteSerializer(base_route)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def delete(self, request, pk=None):
    base_route = get_object_or_404(self.queryset, pk=pk)
    base_route.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

### Class based API Views

class Users(APIView):

  def get(self, request):
    queryset = UserModel.objects.all()
    serializer = UserSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def post(self, request):
    serializer = UserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)

### Functional API Views

@api_view(['get'])
def file_routes(request, pk=None):
  queryset = FileModel.objects.all()
  file = get_object_or_404(queryset, pk=pk)
  routes = RouteModel.objects.filter(file=file)
  serializer = RouteSerializer(routes, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['get'])
def user_current(request):
  user = get_current_user(request)
  serializer = UserSerializer(user)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['get'])
def user_current_files(request):
  serializer = FileSerializer(get_current_user_files(request), many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['get'])
def user_current_routes(request):
  serializer = RouteSerializer(get_current_user_routes(request), many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['post'])
def user_login(request):
  email = request.data['email']
  password = request.data['password']
  user = UserModel.objects.filter(email=email).first()
  
  if user is None:
    raise AuthenticationFailed('User not found!')
  if not user.check_password(password):
    raise AuthenticationFailed('Incorrect password!')

  payload = {
    "id": user.id,
    "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
    "iat": datetime.datetime.utcnow()
  }

  token = jwt.encode(payload, os.environ.get('SECRET'), os.environ.get('ENCODE_ALGORITHM'))

  response = Response()
  response.set_cookie(key='jwt', value=token, httponly=True)
  response.data = {
    "token": token
  }

  return response
  
@api_view(['post'])
def user_logout(request):
  response = Response()
  response.delete_cookie('jwt')
  response.data = {
    "message": "Succesfully logged out!"
  }
  return response

### Help functions

def get_current_user(request):
  token = request.COOKIES.get('jwt')
  if not token:
    raise AuthenticationFailed("You are not logged in!")
  
  try: 
    payload = jwt.decode(token, os.environ.get('SECRET'), os.environ.get('DECODE_ALGORITHMS').split())
  except jwt.ExpiredSignatureError:
    raise AuthenticationFailed("You are unauthenticated!")
  return UserModel.objects.filter(id=payload['id']).first() 

def get_current_user_files(request):
  user = get_current_user(request)
  return FileModel.objects.filter(user_id=user)

def get_current_user_routes(request):
  files = get_current_user_files(request)
  queryset = RouteModel.objects.none()
  for file in files:
    queryset |= RouteModel.objects.filter(file_id=file)
  return queryset