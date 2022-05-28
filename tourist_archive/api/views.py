import jwt, datetime
from django.http import Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status

from .serializers import FileSerializer, UserSerializer
from .models import FileModel, UserModel
from .service import parse_file

##### API Views
#TODO: make RouteView for getting routes from client

class UserListView(APIView):
#TODO: get all users
  def get(self, request):
    pass

class UserView(APIView):

  def get(self, request):
    token = request.COOKIES.get('jwt')
    if not token:
      raise AuthenticationFailed("You are unauthenticated!")
    
    try: 
      payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
      raise AuthenticationFailed("You are unauthenticated!")

    user = UserModel.objects.filter(id=payload['id']).first()
    serializer = UserSerializer(user)

    return Response(serializer.data)

class RegisterView(APIView):

  def post(self, request):
    serializer = UserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)

class LoginView(APIView):

  def post(self, request):
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

    #TODO: make secret and algorithm enviroment variable
    token = jwt.encode(payload, 'secret', algorithm='HS256')

    response = Response()
    response.set_cookie(key='jwt', value=token, httponly=True)
    response.data = {
      "token": token
    }

    return response
  
class LogoutView(APIView):

  def post(self, request):
    response = Response()
    response.delete_cookie('jwt')
    response.data = {
      "message": "Succesfully logged out!"
    }
    return response


### list all files or create new file

class FileListView(APIView):

  def get(self, request, format=None):
    queryset = FileModel.objects.all()
    serializer = FileSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def post(self, request):
    serializer = FileSerializer(data=request.data, fields=('file',))
    if serializer.is_valid():
      serializer.save()
      parse_file(serializer.data['file'])
      #TODO: from parse_file validations return make responses here 
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


### read, update or delete file

class FileDetailView(APIView):

  def get_object(self, pk):
    try:
      return FileModel.objects.get(pk=pk)
    except FileModel.DoesNotExist:
      raise Http404

  def get(self, request, pk, format=None):
    file = self.get_object(pk)
    serializer = FileSerializer(file)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def put(self, request, pk, format=None):
    file = self.get_object(pk)
    serializer = FileSerializer(file, data=request.data, fields=('file',))
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

  def delete(self, request, pk, format=None):
    file = self.get_object(pk)
    file.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
