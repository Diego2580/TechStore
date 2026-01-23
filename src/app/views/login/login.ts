import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = '';
  password = '';
  errorMsg = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  login(): void {
    this.errorMsg = '';
    this.authService.login(this.usuario, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => (this.errorMsg = 'Usuario o contraseña inválidos')
    });
  }
}
