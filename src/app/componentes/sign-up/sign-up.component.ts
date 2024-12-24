import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms'
import { hasEmailError, isRequired } from '../../utils/validators';
//import { toast } from 'ngx-sonner';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../servicios/user.service';

interface FormSignUp{
  nombre: FormControl<string | null>
  apellido: FormControl<string | null>
  email: FormControl<string | null>
  user: FormControl<string | null>
  contraseña: FormControl<string | null>
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
})
export default class SignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _service = inject(UserService);
  private _router = inject(Router);

  // Para validar que los campos necesarios sí estén rellenados
  isRequired(field: 'nombre' | 'apellido' | 'email' | 'user' | 'contraseña') {
    return isRequired(field, this.form);
  }

  // Para validar que el correo está bien
  isEmailIncorrect(){
    return hasEmailError(this.form);
  }

  form = this._formBuilder.group<FormSignUp>({
    nombre: this._formBuilder.control('', Validators.required),
    apellido: this._formBuilder.control('', Validators.required),
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    user: this._formBuilder.control('', Validators.required),
    contraseña: this._formBuilder.control('', Validators.required),
  });

  async submit() {
    if(this.form.invalid) return;

    try{
      const nombre = this.form.get('nombre')?.value;
      const apellido = this.form.get('apellido')?.value;
      const email = this.form.get('email')?.value;
      const user = this.form.get('user')?.value;
      const contraseña = this.form.get('contraseña')?.value;

      if(!nombre || !apellido || !email || !user || !contraseña) return; 
      
      await this._service.createUser(nombre, apellido, email, user, contraseña);  
      
      //toast.success('Usuario creado correctamente.'); 
      // this._router.navigateByUrl('/home'); Cuando tenga el home  
      toast.success('Usuario creado correctamente.'); 
      this._router.navigateByUrl('/home');
      
    } catch (error) {
      //toast.error('Usuario NO creado. Ha ocurrido un error.')
      
    }
  }
}