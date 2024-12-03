import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms'

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
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
})

export default class SignUpComponent {
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group<FormSignUp>({
    nombre: this._formBuilder.control('', Validators.required),
    apellido: this._formBuilder.control('', Validators.required),
    email: this._formBuilder.control('', [Validators.required, Validators.email]),     //para saber que está metiendo un email correcto (@, .com, gmail, etc)
    user: this._formBuilder.control('', Validators.required),
    contraseña: this._formBuilder.control('', Validators.required),
  });

  submit() {
    if(this.form.invalid) return;

    const nombre = this.form.get('nombre')?.value;
    const apellido = this.form.get('apellido')?.value;
    const email = this.form.get('email')?.value;
    const user = this.form.get('user')?.value;
    const contraseña = this.form.get('contraseña')?.value;

    if(!nombre || !apellido || !email || !user || !contraseña) return;  //si faltan estos campos, no se deja hacer
  
    console.log({nombre, apellido, email, user, contraseña});
  
  }
}
