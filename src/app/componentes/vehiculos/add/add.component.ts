import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../home/header/header.component';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { Router, RouterLink } from '@angular/router';
import { isRequired } from '../../../utils/validators';
import { toast } from 'ngx-sonner';

interface FormVehicle{
  matricula: FormControl<string | null>
  marca: FormControl<string | null>
  modelo: FormControl<string | null>
  fecha: FormControl<any | null>
  tipo: FormControl<string | null>
  consumo: FormControl<any | null>
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export default class AddComponent {
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  
  isRequired(field: 'matricula' | 'marca' | 'modelo' | 'fecha' | 'consumo' | 'tipo') {
    return isRequired(field, this.form);
  }

  getControlError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return control?.hasError(errorCode) && control?.touched || false;
  }

  consumoMayorQueCero(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && value !== undefined && value <= 0) {
      return { consumoInvalido: true }; // Error personalizado
    }
    return null;
  }
  
  form = this._formBuilder.group<FormVehicle>({
    matricula: this._formBuilder.control('', [Validators.required, Validators.pattern(/^[0-9]{4} [A-Z]{3}$/)]),
    marca: this._formBuilder.control('', Validators.required),
    modelo: this._formBuilder.control('', Validators.required),
    fecha: this._formBuilder.control('', Validators.required),
    tipo: this._formBuilder.control('', Validators.required),
    consumo: this._formBuilder.control('', [Validators.required, this.consumoMayorQueCero]),
  });

  private servicioVehiculo = inject(VehiculoService);

  async submit() {
    if(this.form.invalid){
      console.log(this.form)
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

      if(!matricula || !marca || !modelo || !fecha || !consumo || !tipo) return; 

      
      await this.servicioVehiculo.crearVehiculo(matricula, marca, modelo, fecha, consumo, tipo);  
      
      toast.success('Vehiculo creado correctamente.'); 
      this._router.navigateByUrl('/vehiculos'); 
      
    } catch (error) {
      toast.error('Vehiculo NO creado. Ha ocurrido un error.')
      
    }
  }
}
