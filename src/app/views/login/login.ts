import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    if (this.authService.login(this.usuario, this.password)) {
      this.router.navigate(['/admin']);
    } else {
      this.errorMsg = 'Usuario o contraseña inválidos';
    }
  }
}
