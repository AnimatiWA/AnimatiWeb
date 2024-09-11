from django.urls import path, include, re_path
from rest_framework import routers 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from AnimatiApp import views
from .views import *


router=routers.DefaultRouter()
router.register(r'Categoria', views.CategoriaViewSet)





urlpatterns =[
    path('login', LoginAPIView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name = 'logout'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registro', CreateUserAPI.as_view(), name='registro'),
    path('perfilusuario', PerfilView.as_view(), name='perfilusuario'),
    path('usuarios', ListaDeUsuarios.as_view(), name='listadeusuarios'),
    path('vercategoria', CategoriaViewSet.as_view({'get': 'list'}), name='vercategoria'),
    path(r'delete/<Codigo_Producto>', ListaProductos.as_view(), name='eliminarproducto'),
    path('update/<int:Codigo_Producto>', ActualizarProductoApiView.as_view(), name='actualizarrproducto'), 
    path('añadirproducto', añadirProducto.as_view(), name='añadirproducto'), 
    path('listaproductos', ListaProductos.as_view(), name='listaproducto'),    
    path('carrito', CarritoComprasVista.as_view(), name='carritodecompras'),
    path('listacarrito', ListaCarritos.as_view(), name='listacarrito'),
    path('carrito/<int:pk>', DetalleCarrito.as_view(), name='detallecarrito'),
    path('carrito/crear', CrearCarrito.as_view(), name='crearcarrito'),
    path('carrito/<int:pk>/actualizar', ActualizarCarrito.as_view(), name='actualizarcarrito'),
    path('carrito/<int:pk>/eliminar', EliminarCarrito.as_view(), name='eliminarcarrito'),
    path('carritoProductos/<int:pk>', DetalleProductosCarrito.as_view(), name='detalleproductoencarrito'),
    path('carritoProductos/crear', CrearProductosCarrito.as_view(), name='crearproductoencarrito'),
    path('carritoProductos/<int:pk>/actualizar', ActualizarProductoenCarrito.as_view(), name='actualizarproductoencarrito'),
    path('carritoProductos/<int:pk>/eliminar', EliminarItemEnCarrito.as_view(), name='eliminarproductodelcarrito'),
        
    path('', include(router.urls)),
]