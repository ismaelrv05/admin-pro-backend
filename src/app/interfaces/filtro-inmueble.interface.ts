export interface FiltroInmueble {
  ubicacion?: string;
  tipo?: string;
  disponibilidad?: 'compra' | 'alquiler';
  obraNueva?: boolean;
  precioMin?: number;
  precioMax?: number;
  habitaciones?: number;
  metrosMin?: number;
  metrosMax?: number;
}
