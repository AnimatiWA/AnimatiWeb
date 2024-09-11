from django.http import Http404
from django.shortcuts import render
from django.contrib.auth import authenticate, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.generic import  DetailView, ListView, CreateView, UpdateView, DeleteView
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, UpdateAPIView, GenericAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets, generics



from .models import *
from .serializers import *
# Create your views here.

class CreateUserAPI(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CrearUsuarioSerializer
    permission_classes = [permissions.AllowAny]


class ActualizarUsuarioSerializerAPI(UpdateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = ActualizarUsuarioSerializer


class LoginAPIView(TokenObtainPairView):
    permission_classes = [AllowAny] 

    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(
            username=username,
            password=password
        )

        if user:
            login_serializer = self.serializer_class(data=request.data)
            if login_serializer.is_valid():
                user_serializer = CustomUsuarioSerializer(user)
                return Response({
                    'token': login_serializer.validated_data.get('access'),
                    'refresh-token': login_serializer.validated_data.get('refresh'),
                    'user': user_serializer.data,
                    'message': 'Inicio de Sesion Existoso'
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Contraseña o nombre de usuario incorrectos'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Contraseña o nombre de usuario incorrectos'}, status=status.HTTP_400_BAD_REQUEST)

    

class LogoutView(GenericAPIView):
    permission_classes = [permissions.AllowAny] 
    def post(self, request):
        user = User.objects.filter(id=request.data.get('user',''))
        if user.exists():
            RefreshToken.for_user(user.first())
            return Response({'message':'Sesión Cerrada.'},status=status.HTTP_200_OK)
        return Response({'error':'No se ha Logeado.'}, status=status.HTTP_400_BAD_REQUEST)



        
class ListaDeUsuarios(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    http_method_names = ['get', 'post']
    permission_classes = [ permissions.AllowAny]
    def list(self, request):
        queryset = self.get_queryset()
        serializer = UsuarioSerializer(queryset, many=True)
        if self.request.user:
            return Response(serializer.data)

class PerfilView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UsuarioSerializer
    http_method_names = ['get', 'patch']
    def get_object(self):
        if self.request.user.is_authenticated:
            return self.request.user
    def patch_object(self,request):
        serializer = UsuarioSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#----------------------Vistas Categoria------------------------------------------------

class CategoriaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    def get_object(self, request):

        queryset = self.get_queryset()
        serializers = CategoriaSerializer(queryset, many=True)
        return Response(serializers.data)

#--------------Vistas Productos------------


    
    
class ListaProductos(APIView):
    permission_classes = [permissions.AllowAny]
    http_method_names = [
        'delete',
        'post',
        'get',
        'put',
        'head',
        'options',]
    def get(self, request, format=None):
        productos = Producto.objects.all()
        serializers = ProductosSerializer(productos, many=True)
        return Response(serializers.data)
    
    def delete(self, request, Codigo_Producto, format=None):
        producto = Producto.objects.filter(pk=Codigo_Producto).first()
        producto.delete()
        return Response({'message':'Producto Eliminado'},status=status.HTTP_200_OK)
    
class ActualizarProductoApiView(generics.UpdateAPIView):
    serializer_class = ProductosSerializer
    queryset= Producto.objects.all()
    permission_classes = [permissions.AllowAny]
    lookup_field = 'Codigo_Producto'

    def patch(self, request, Codigo_Producto):
        producto = self.get_queryset().filter(Codigo_Producto=Codigo_Producto).first()
        if producto:
            producto_serializer = self.serializer_class(producto)
            return Response(producto_serializer.data, status=status.HTTP_200_OK)
        return Response({'error':'Producto no encontado'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        
        return super().put(request, *args, **kwargs)
    """def put(self, request, Codigo_Producto):
        
        if self.get_queryset(Codigo_Producto=Codigo_Producto):
            producto_serializer = self.serializer_class(self.get_queryset(Codigo_Producto=Codigo_Producto), data=request.data)    
            if producto_serializer.is_valid():
                producto_serializer.save()
                return Response(producto_serializer.data, status=status.HTTP_200_OK)
            return Response(producto_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    """

    """def get_queryset(self):
        
        return self.get_serializer().Meta.model.objects.all()

    def patch(self, request, Codigo_Producto):
        producto = self.get_queryset().filter(Codigo_Producto=Codigo_Producto).first()
        if producto:
            producto_serializer = self.serializer_class(producto)
            return Response(producto_serializer.data, status=status.HTTP_200_OK)
        return Response({'error':'Producto no encontado'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        
        if self.get_queryset():
            producto_serializer = self.serializer_class(self.get_queryset(), data=request.data)    
            if producto_serializer.is_valid():
                producto_serializer.save()
                return Response(producto_serializer.data, status=status.HTTP_200_OK)
            return Response(producto_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""

class añadirProducto(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, format=None):
        serializer = ProductosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Producto Cargado'},status=status.HTTP_200_OK)
        return Response({'message':'Error al cargar el producto'}, status=status.HTTP_400_BAD_REQUEST)
    
#---------------------Vistas Carrito-----------------

class CarritoComprasVista(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = CarroDeCompraSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"estado": "correcto", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"estado": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DetalleCarrito(DetailView):
    permission_classes = [permissions.AllowAny]
    model = Carrito



class ListaCarritos(ListView):
    permission_classes = [permissions.AllowAny]
    model = Carrito
    context_object_name = 'carritos'


class CrearCarrito(CreateView):
    permission_classes = [permissions.AllowAny]
    model = Carrito


class ActualizarCarrito(UpdateView):
    permission_classes = [permissions.AllowAny]
    model = Carrito


class EliminarCarrito(DeleteView):
    permission_classes = [permissions.AllowAny]
    model = Carrito

class DetalleProductosCarrito(DetailView):
    permission_classes = [permissions.AllowAny]
    model = ProductoCarrito


class ListarProductosEnCarrito(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = CarritoCompras.objects.all()
    serializer_class = CarritoComprasVista



class CrearProductosCarrito(APIView):
    permission_classes = [permissions.AllowAny]
    model = ProductoCarrito
    def post(self, request):
        serializer = CarroDeCompraSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"estado": "correcto", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"estado": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ActualizarProductoenCarrito(UpdateView):
    permission_classes = [permissions.AllowAny]
    model = ProductoCarrito


class EliminarItemEnCarrito(DeleteView):
    permission_classes = [permissions.AllowAny]
    model = ProductoCarrito
