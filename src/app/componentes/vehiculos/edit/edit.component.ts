import { Component, effect, inject, input } from '@angular/core';
import { HeaderComponent } from '../../home/header/header.component';
import { FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { isRequired } from '../../../utils/validators';


interface FormVehicle{
  matricula: FormControl<string | null>
  marca: FormControl<string | null>
  modelo: FormControl<string | null>
  fecha: FormControl<any | null>
  tipo: FormControl<string | null>
  consumo: FormControl<any | null>
  favorito: FormControl<any | null>
}

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export default class EditComponent {
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private servicioVehiculo = inject(VehiculoService);
  matricula = input.required<string>();

  constructor() {
    effect(async () => {
      const matricula = this.matricula();
      const vehiculo = await this.servicioVehiculo.getVehiculo(matricula);
      const prueba = {
        matricula: vehiculo.getMatricula(),
        marca: vehiculo.getMarca(),
        modelo: vehiculo.getModelo(),
        fecha: vehiculo.getAñoFabricacion(),
        consumo: vehiculo.getConsumo(),
        tipo: vehiculo.getTipo(),
        favorito: vehiculo.getFavorito()
      };
      this.form.patchValue(prueba);
    });
  }
    
  isRequired(field: 'matricula' | 'marca' | 'modelo' | 'fecha' | 'consumo' | 'tipo') {
    return isRequired(field, this.form);
  }

  form = this._formBuilder.group<FormVehicle>({
    matricula: this._formBuilder.control('', Validators.required),
    marca: this._formBuilder.control('', Validators.required),
    modelo: this._formBuilder.control('', Validators.required),
    fecha: this._formBuilder.control('', Validators.required),
    tipo: this._formBuilder.control('', Validators.required),
    consumo: this._formBuilder.control('', Validators.required),
    favorito: this._formBuilder.control('', Validators.required)
  });

  async submit() {
    if(this.form.invalid){
      toast.info('Por favor, rellene el formularo con campos correctos.')
      return;
    }

    try{
      const matricula = this.form.get('matricula')?.value;
      const marca = this.form.get('marca')?.value;
      const modelo = this.form.get('modelo')?.value;
      const fecha = this.form.get('fecha')?.value;
      const tipo = this.form.get('tipo')?.value;
      const consumo = this.form.get('consumo')?.value;
      const favorito = this.form.get('favorito')?.value;

      if(!matricula || !marca || !modelo || !fecha || !consumo || !tipo) return; 

      let fav;
      if (favorito == 'true') {
        fav = true;
      }else{
        fav =false;
      }
      await this.servicioVehiculo.actualizarVehiculo(matricula, marca, modelo, fecha, consumo, tipo, fav);  
      
      toast.success('Vehiculo editado correctamente.'); 
      this._router.navigateByUrl('/vehiculos'); 
      
    } catch (error) {
      toast.error('Vehiculo NO editado. Ha ocurrido un error.')
      
    }
  }
}
