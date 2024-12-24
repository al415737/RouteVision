import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { hasEmailError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { UserService } from '../../servicios/user.service';

export interface FormSignIn{  //de momento se logeará con email y contraseña
  email: FormControl<string | null>
  contraseña: FormControl<string | null>
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
})

export default class SignInComponent {
   
  private _formBuilder = inject(FormBuilder);
  private _service = inject(UserService);
  private _router = inject(Router);

  // Para validar que los campos necesarios sí estén rellenados
  isRequired(field: 'nombre' | 'apellido' | 'email' | 'user' | 'contraseña') {
    return isRequired(field, this.form);
  }

  // Para validar que el correo está bien (tiene @, gmail, .com)
  isEmailIncorrect(){
    return hasEmailError(this.form);
  }

  form = this._formBuilder.group<FormSignIn>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]), // Para saber que está metiendo un email correcto (@, .com, gmail, etc)
    contraseña: this._formBuilder.control('', Validators.required),
  });

  async submit() {
    if(this.form.invalid) return;

    try{
      const email = this.form.get('email')?.value;
      const contraseña = this.form.get('contraseña')?.value;
      
      if(!email || !contraseña) return;  // Si faltan estos campos, no se deja hacer

      await this._service.loginUser(email, contraseña);  
      
      toast.success('¡Bienvenido de nuevo!'); 
      this._router.navigateByUrl('/home');
      
    } catch (error) {
      toast.error('Ha ocurrido un error. Inténtalo de nuevo.')
      
    }
  }
  
}