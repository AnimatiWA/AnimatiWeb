export interface MesesPrevios{
    ultimo_mes: number;
    penultimo_mes: number;
    antepenultimo_mes: number;
}
export interface Ventas {
    total_ventas: number;
    total_ingresos: number;
    productos_vendidos: number;
    meses_previos: MesesPrevios;
}
