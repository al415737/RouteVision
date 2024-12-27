import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultar.component.html',
  styleUrl: './consultar.component.css'
})
export default class ConsultarComponent {
    //Prueba
    vehiculos = new MatTableDataSource(); 

    constructor(private router: Router){}

    eliminarVehiculo(id: number){

    }
}
