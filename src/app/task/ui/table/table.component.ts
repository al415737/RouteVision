import { Component, effect, input } from '@angular/core';
import {Task, TaskService} from '../../data-access/task.service';
import { RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table.component.html',
})
export default class TableComponent {
  
  task = input.required<Task[]>();

  constructor(private _taskService: TaskService) {}

  async delete(task: string){
    try {      
      await this._taskService.delete(task);
      
      toast.success(`Lugar de Interés eliminado correctamente.`);
    }catch(error){
        toast.success("Ha ocurrido un problema.");
    }
  }
}
