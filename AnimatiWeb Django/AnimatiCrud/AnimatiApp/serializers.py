from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.db import models
from .models import *



class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductosSerializer(serializers.ModelSerializer):
    Id_Categoria = serializers.SlugRelatedField(
        queryset = Categoria.objects.all(), slug_field="Nombre_Categoria")
    class Meta:
        model = Producto
        fields = '__all__'       


class CarroDeCompraSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(max_length=200)
    producto_precio = serializers.FloatField()
    producto_cantidad = serializers.IntegerField(required=False, default=1)

    class Meta:
        model = CarritoCompras
        fields = ('__all__')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    pass

class CustomUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','email','name','last_name')

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class CrearUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'name', 'last_name')
        extra_kwargs = {
            'password': {'required': True}
        }

    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ActualizarUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password')

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        if password:
            instance.set_password(password)
        instance = super().update(instance, validated_data)
        return instance


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128, min_length=6, write_only=True)
    password2 = serializers.CharField(max_length=128, min_length=6, write_only=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                {'password':'Debe ingresar ambas contraseñas iguales'}
            )
        return data

class UsuarioListaSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

    def to_representation(self, instance):
        return {
            'id': instance['id'],
            'name': instance['name'],
            'username': instance['username'],
            'email': instance['email']
        }