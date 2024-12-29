import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../home/header/header.component';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { Vehiculo } from '../../../modelos/vehiculos/vehiculo';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export default class AddComponent {

  private servicioVehiculo = inject(VehiculoService);
  matricula: string = '';
  marca: string = '';
  modelo: string = '';
  anyo_fabricacion: string = '';
  consumo: number = 0;
  tipo: string = '';

  guardarVehiculo(){
    this.servicioVehiculo.crearVehiculo(
      this.matricula, 
      this.marca, this.modelo, 
      this.anyo_fabricacion,
      this.consumo,
      this.tipo
    );
  }
}
