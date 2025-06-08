import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public desde: number = 0;

  constructor(private _userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this._userService.getUsers(this.desde)
      .subscribe( ({ total, usuarios }) => {
        this.totalUsuarios= total;
        this.usuarios = usuarios;
      });
  }

  cargarPagina( valor: number ) {
    this.desde += valor;

      if (this.desde < 0) {
        this.desde = 0;
      } else if (this.desde >= this.totalUsuarios) {
        this.desde -= valor;
      }

      this.cargarUsuarios();

  }

  editarUsuario(id: string): void {
    this.router.navigate([`/admin/usuarios/edit/${id}`]);
  }

  eliminarUsuario(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this._userService.deleteUser(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error('Error al eliminar usuario', err)
    });
  }

  crearUsuario(): void {
    this.router.navigate(['/admin/usuarios/new']);
  }
}
