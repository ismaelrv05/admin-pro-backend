import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public formSubmited = false;

  public registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordsMatch });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  createUser() {
    this.formSubmited = true;

    if (this.registerForm.invalid) {
      return;
    }

    // Llamada al servicio para registrar el usuario
    this.userService.createUser(this.registerForm.value).subscribe( resp => {
        this.router.navigateByUrl('/home');
      }, (err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  // Método para comprobar si un campo es inválido después del intento de envío
  noValidLabel(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return this.formSubmited && control?.invalid ? true : false;
  }

  // Método para comprobar que las contraseñas coincidan
  passwordsMatch(formGroup: FormGroup) {
    const pass = formGroup.get('password')?.value;
    const confirmPass = formGroup.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { mismatch: true };
  }
}
