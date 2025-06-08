import { Usuario } from "../models/usuario.model";

export interface LoadUser {
  total: number;
  usuarios: Usuario[];
}
