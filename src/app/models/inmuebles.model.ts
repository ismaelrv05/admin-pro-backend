import { TipoInmueble } from "../enums/type-inmueble.enum";

interface _usuarioInmueble {
  uid: string;
  nombre: string;
  img?: string;
}

export class Inmueble {
  constructor(
    public nombre: string,
    public precio: number,
    public ubicacion: string,
    public tipo: TipoInmueble,
    public disponibilidad: 'compra' | 'alquiler',
    public _id?: string,
    public descripcion?: string,
    public metrosCuadrados?: number,
    public habitaciones?: number,
    public banos?: number,
    public garage?: boolean,
    public amueblado?: boolean,
    public obraNueva?: boolean,
    public fechaPublicacion?: Date | string,
    public img?: string,
    public usuario?: _usuarioInmueble,
    public coordenadas?: {
      type: 'Point';
      coordinates: [number, number]; // [lng, lat]
    },
  ) { }
}

