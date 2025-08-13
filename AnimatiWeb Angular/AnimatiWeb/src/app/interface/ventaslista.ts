export interface MesesPrevios{
    total_ultimo_mes: number;
    total_penultimo_mes: number;
    total_antepenultimo_mes: number;
}
export interface Ventas {
    total_ventas: number;
    total_ingresos: number;
    productos_vendidos: number;
    meses_previos: MesesPrevios;
}
