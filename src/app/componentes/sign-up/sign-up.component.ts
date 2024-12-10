import { inject, Component } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../servicios/user.service';

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _service = inject(UserService);

  form = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control(''),
    password: this._formBuilder.control(''),
  });

  async submit() {
      if (this.form.invalid) return;

      try {
        const { email, password } = this.form.value;

        if (!email || !password) return;

        await this._service.createUser("hola", "pepito",email, "hola", password);
      } catch (error) {
        console.log(error);
      }
    }
  }
