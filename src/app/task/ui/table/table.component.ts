import { Component, effect, input } from '@angular/core';
import {Task} from '../../data-access/task.service';
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
  private _taskService: any;
  private _router: any;

  async delete(){
    try {
      const id = this.task();
      
      if(id){
        await this._taskService.delete(id);
      }

      toast.success(`Lugar de Interés eliminado correctamente.`);
      this._router.navigateByUrl('/task');


    }catch(error){
        toast.success("Ha ocurrido un problema.");
    }
  }
}
