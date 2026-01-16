import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService, CompanyInfo } from '../../services/company.service';

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acerca.html',
  styleUrl: './acerca.css',
})
export class Acerca implements OnInit {
  empresa: CompanyInfo | null = null;
  cargando = true;
  private companyService = inject(CompanyService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarInformacion();
  }

  cargarInformacion(): void {
    this.cargando = true;
    this.companyService.getFresh().subscribe({
      next: (data) => {
        this.empresa = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
