import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export default class TaskFormComponent {
    
    private _formBuilder = inject(FormBuilder);

    form = this._formBuilder.group({
      coordenadas: this._formBuilder.control('', Validators.required),
      toponimo: this._formBuilder.control('', Validators.required),
    });

    submit(){
      
    }

}
