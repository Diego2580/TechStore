import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService, Nosotros } from '../../services/company.service';

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acerca.html',
  styleUrl: './acerca.css',
})
export class Acerca implements OnInit {
  nosotros: Nosotros | null = null;
  cargando = true;
  private companyService = inject(CompanyService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarNosotros();
  }

  cargarNosotros(): void {
    this.cargando = true;
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.nosotros = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
