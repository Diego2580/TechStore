import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  usuario = '';
  password = '';
  confirm = '';
  errorMsg = '';
  successMsg = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  registrar(): void {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.usuario || !this.password) {
      this.errorMsg = 'Usuario y contraseña son obligatorios';
      return;
    }
    if (this.password !== this.confirm) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }
    this.auth.register(this.usuario, this.password).subscribe({
      next: () => {
        // Auto login tras registrarse para confirmar que quedó guardado
        this.auth.login(this.usuario, this.password).subscribe({
          next: () => this.router.navigate(['/admin']),
          error: () => {
            this.successMsg = 'Registro exitoso, inicia sesión para continuar';
            setTimeout(() => this.router.navigate(['/login']), 1200);
          }
        });
      },
      error: (err) => {
        const msg = (err && typeof err.error === 'string') ? err.error : '';
        this.errorMsg = msg || (err?.status === 409 ? 'El usuario ya existe' : 'No se pudo registrar');
      }
    });
  }
}
