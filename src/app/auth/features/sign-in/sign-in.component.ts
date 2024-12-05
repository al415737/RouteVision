import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';
import { hasEmailError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { GoogleButtonComponent } from "../../UI/google-button/google-button.component";

export interface FormSignIn{  //de momento se logeará con email y contraseña
  email: FormControl<string | null>
  contraseña: FormControl<string | null>
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, GoogleButtonComponent],
  templateUrl: './sign-in.component.html',
})

export default class SignInComponent {
   
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  //para validar que los campos necesarios sí estén rellenados
  isRequired(field: 'nombre' | 'apellido' | 'email' | 'user' | 'contraseña') {
    return isRequired(field, this.form);
  }

  //para validar que el correo está bien (tiene @, gmail, .com)
  isEmailIncorrect(){
    return hasEmailError(this.form);
  }

  form = this._formBuilder.group<FormSignIn>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),     //para saber que está metiendo un email correcto (@, .com, gmail, etc)
    contraseña: this._formBuilder.control('', Validators.required),
  });

  /*submit() { SIN FIREBASE
    if(this.form.invalid) return;

    const nombre = this.form.get('nombre')?.value;
    const apellido = this.form.get('apellido')?.value;
    const email = this.form.get('email')?.value;
    const user = this.form.get('user')?.value;
    const contraseña = this.form.get('contraseña')?.value;

    if(!nombre || !apellido || !email || !user || !contraseña) return;  //si faltan estos campos, no se deja hacer
  
    console.log({nombre, apellido, email, user, contraseña});
  }*/

  async submit() {
    if(this.form.invalid) return;

    try{
      //const nombre = this.form.get('nombre')?.value;
      //const apellido = this.form.get('apellido')?.value;
      const email = this.form.get('email')?.value;
      //const user = this.form.get('user')?.value;
      const contraseña = this.form.get('contraseña')?.value;

      //if(!nombre || !apellido || !email || !user || !contraseña) return;  //esto es para más adelante, enviar todos los datos (APARTE DEL MAIL Y CONTRASEÑA)
      
      if(!email || !contraseña) return;  //si faltan estos campos, no se deja hacer || PRUEBA FIREBASE

      await this._authService.signIn({email, contraseña});  
      
      toast.success('¡Bienvenido de nuevo!'); //NGX... Un toast es como un mensaje emergente to chulapo.
      this._router.navigateByUrl('/task');  //cuando se registre, irá al path de tareas
      
    } catch (error) {
      toast.error('Ha ocurrido un error. Inténtalo de nuevo.')
      
    }
  }

  async submitWithGoogle(){
    try {
      await this._authService.signInWithGoogle();
      toast.success('Bienvenido de nuevo.');
      this._router.navigateByUrl('/task');
    } catch (error) {
      toast.error('Ha ocurrido un error.')
    }
  }
  
}
