import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskCreate, TaskService } from '../../data-access/task.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export default class TaskFormComponent {
    
    private _formBuilder = inject(FormBuilder);
    private _taskService = inject(TaskService);
    private _router = inject(Router);

    form = this._formBuilder.group({
      coordenadas: this._formBuilder.control('', Validators.required),
      toponimo: this._formBuilder.control('', Validators.required),
    });

    async submit(){
      if(this.form.invalid) return ;

      try {
        const {toponimo, coordenadas} = this.form.value;
        const task: TaskCreate = {
          toponimo: toponimo || '',
          coordenadas: coordenadas || '',
        };

        await this._taskService.create(task);

        toast.success("Lugar de Interés creado correctamente.");
        this._router.navigateByUrl('/task');

      }catch(error){
          toast.success("Ha ocurrido un problema.");
      }
    }

}
