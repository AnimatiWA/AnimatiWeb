export interface Producto{
    Codigo_Producto: number;
    Id_Categoria: number;
    Nombre_Producto: string;
    Imagen: string;
    Precio: number;
    Stock: number;
    Cantidad:number;
    Descripcion?: string;
}