import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms'
import { hasEmailError, isRequired } from '../../utils/validators';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../data-access/auth.service';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { GoogleButtonComponent } from '../../UI/google-button/google-button.component';

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
  imports: [ReactiveFormsModule, GoogleButtonComponent],
  templateUrl: './sign-up.component.html',
})

export default class SignUpComponent {
  
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

  form = this._formBuilder.group<FormSignUp>({
    nombre: this._formBuilder.control('', Validators.required),
    apellido: this._formBuilder.control('', Validators.required),
    email: this._formBuilder.control('', [Validators.required, Validators.email]),     //para saber que está metiendo un email correcto (@, .com, gmail, etc)
    user: this._formBuilder.control('', Validators.required),
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
      const nombre = this.form.get('nombre')?.value;
      const apellido = this.form.get('apellido')?.value;
      const email = this.form.get('email')?.value;
      const user = this.form.get('user')?.value;
      const contraseña = this.form.get('contraseña')?.value;

      if(!nombre || !apellido || !email || !user || !contraseña) return;  //esto es para más adelante, enviar todos los datos (APARTE DEL MAIL Y CONTRASEÑA)
      
      //if(!email || !contraseña) return;  //si faltan estos campos, no se deja hacer || PRUEBA FIREBASE

      await this._authService.signUp({email, contraseña});  
      
      toast.success('Usuario creado correctamente.'); //NGX... Un toast es como un mensaje emergente to chulapo.
      this._router.navigateByUrl('/task');  //cuando se registre, irá al path de tareas
      
    } catch (error) {
      toast.error('Usuario NO creado. Ha ocurrido un error.')
      
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
