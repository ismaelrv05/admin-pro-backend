import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  userId: string | null = null;
  isEditMode = false;

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.userForm = this._fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      role: ['USER_ROLE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this._route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this._userService.getUserById(this.userId).subscribe(resp => {
        this.userForm.patchValue({
          nombre: resp.usuario.nombre,
          email: resp.usuario.email,
          role: resp.usuario.role
        });
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.isEditMode && this.userId) {
      if (!userData.password) delete userData.password;

      this._userService.updateUser(this.userId, userData).subscribe(() => {
        this._router.navigate(['/admin/usuarios']);
      });
    } else {
      this._userService.createUser(userData).subscribe(() => {
        this._router.navigate(['/admin/usuarios']);
      });
    }
  }

  cancelar(): void {
    this._router.navigate(['/admin/usuarios']);
  }

}
