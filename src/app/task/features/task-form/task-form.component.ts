import { AfterViewChecked, AfterViewInit, Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskCreate, TaskService } from '../../data-access/task.service';
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

    idTask = input.required<string>();
    
    form = this._formBuilder.group({
      coordenadas: this._formBuilder.control('', Validators.required),
      toponimo: this._formBuilder.control('', Validators.required),
    });

    constructor() {
      effect(() => {        
        const id = this.idTask();
        if(id) {
          this.getLugar(id);
        }
      
      })
    }

    async submit(){
      if(this.form.invalid) return ;

      try {
        const {toponimo, coordenadas} = this.form.value;
        const task: TaskCreate = {
          toponimo: toponimo || '',
          coordenadas: coordenadas || '',
        };

        const id = this.idTask();
        if(id){
          await this._taskService.update(task, id);
      
        } else {
          await this._taskService.create(task);
        }

        toast.success(`Lugar de Interés ${id ? 'actualizado' : 'creado'} correctamente.`);
        this._router.navigateByUrl('/task');

      }catch(error){
          toast.success("Ha ocurrido un problema.");
      }
    }

    async getLugar(id: string){
      const taskSnapshot = await this._taskService.getLugar(id); 

      if(!taskSnapshot.exists()){
        return;
      } else {
        const lugar = taskSnapshot.data() as Task;
        this.form.patchValue(lugar);  //para rellenar con la info correspondiente los campos que necesitamos (los coge de la bbdd)
      }
    }

}
