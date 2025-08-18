export interface ProductoCarrito{
    id: number;
    Codigo: number;
    Id_Categoria: number;
    nombre_producto: string;
    imagen_producto: string;
    Precio: number;
    Stock: number;
    Cantidad:number;
    loading?: boolean;
}