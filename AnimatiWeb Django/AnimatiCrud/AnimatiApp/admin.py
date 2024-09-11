from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import *

# Register your models here.


class CategoriaAdmin(admin.ModelAdmin):
    list_display =('Nombre_Categoria', 'Descripcion_Categoria')

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('Nombre_Producto', 'Precio', 'Stock', 'Id_Categoria')

class ClienteAdmin(admin.ModelAdmin):
    list_display = ('Nombre', 'Apellido', 'Correo_Electronico', 'Direccion', 'Telefono')


class PedidosAdmin(admin.ModelAdmin):
    list_display = ('Nro_Pedido', 'Id_Producto', 'DNI', 'Cantidad')

@admin.register(get_user_model())
class CustomUsuarioAdmin(UserAdmin):
    pass

admin.site.register(Categoria, CategoriaAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(Cliente, ClienteAdmin)   
admin.site.register(CarritoCompras)