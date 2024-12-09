import { Component, inject } from '@angular/core';
import TableComponent from '../../ui/table/table.component';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../data-access/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './task-list.component.html',
  styles: ``
})
export default class TaskListComponent {
  task = inject(TaskService).getLugarInteres;
}
