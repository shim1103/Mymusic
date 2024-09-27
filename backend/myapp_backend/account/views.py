import logging
from django.contrib.auth import logout
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer
from django.conf import settings

logger = logging.getLogger('django')

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    

    # signup
    def create(self, request, *args, **kwargs):
        logger.debug('Request data for create: %s', request.data)
        serializer = RegisterSerializer(data=request.data)

        if CustomUser.objects.filter(username=request.data.get('username')).exists():
            logger.warning('Username already exists: %s', request.data.get('username'))
            return Response({ "type" :"UsernameExists","message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
    
        if serializer.is_valid():
            user = serializer.save()
            logger.info('User created: %s', user.username)
            return Response({
                "user": {
                    "username": user.username,
                    "tell": user.tell,
                }
            }, status=status.HTTP_201_CREATED)
        logger.warning('Validation errors: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #superuser vefify
    @action(detail=False, methods=['post'], url_path='superuser')
    def vefrify_superuser( self, request) :
        username = request.data.get('username')
        superuser = settings.SUPERUSER
        try :
            if not username or  not superuser :
                return Response({
                    "error" : "No username or No superuser", "detail" : f"username : '{username}', superusr : '{superuser}'"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if username == superuser :
                return Response(True, status=status.HTTP_200_OK)
            else :
                return Response(False,status=status.HTTP_200_OK)
        except Exception as e :
            return Response({'error' : 'An excepted error occured','details' : str(e)} ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # login
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        try :
            logger.debug('Login request data: %s', request.data)
            username = request.data.get('username')
            password = request.data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                logger.info('User authenticated: %s', username)
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            logger.warning('Invalid credentials for username: %s', username)
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e :
                return Response({'error' : 'An excepted error occured','details' : str(e)} ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # logout
    @action(detail=False, methods=['post'], url_path='logout')
    def logout_view(self, request):
        logout(request)
        logger.info('logout failed')
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

    # verify password
    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='verify')
    def verify_password(self, request):
        username =request.data.get('username')
        password = request.data.get('password')
        try :
            if not username or not password:
                return Response({'error': 'Required for verifying',
                        'details' :f"Username: '{username}' and password: '{password}' " ,
                        }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)
            print('user :',user)
            if user is None :
                return Response({'status' :f"Invalid credentials! : '{password}'"}, status=status.HTTP_400_BAD_REQUEST)
            if user:
                return JsonResponse({'status': 'Password verified'}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': f"Invalid password :'{password}'"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e :
                return Response({'error' : 'An excepted error occured','details' : str(e)} ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    # update user account setting
    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='update')
    def update_user(self, request):
        username = request.data.get('username')
        tell = request.data.get('tell')
        password = request.data.get('password')
        try :
            if not username or not tell or not password :
                return Response(
                    {'error': 'Required for updating',
                        'details' :f"Username: '{username}' and tell: '{tell}' and password: '{password}' " ,
                        }, status=status.HTTP_400_BAD_REQUEST)
            user = CustomUser.objects.get(username=username)
            user.tell = tell
            user.password = make_password(password)
            user.save()
            return JsonResponse({'status': 'User updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e :
                return Response({'error' : 'An excepted error occured','details' : str(e)} ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
    # delete user account
    @action(detail=False, methods=['delete'], url_path='delete')
    def delete_account(self, request):
        username = request.query_params.get('username')
        try :
            if not username :
                return Response(
                    {
                        'error' : 'required username you delete',
                        'detail' : f"Username : '{username}'"
                    },status=status.HTTP_400_BAD_REQUEST)
                
            account = CustomUser.objects.filter(username=username)
            if not account.exists() :
                return Response({'error' : 'Account not found'}, status=status.HTTP_404_NOT_FOUND)
            
            account.delete()
            return Response({'message': 'Delete account successfully'}, status=status.HTTP_200_OK)
        except Exception as e :
                return Response({'error' : 'An excepted error occured','details' : str(e)} ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       