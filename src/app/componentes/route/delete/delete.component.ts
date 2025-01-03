import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RouteService } from '../../../servicios/route.service';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  private dialogRef = inject(MatDialogRef);
  private _routeService = inject(RouteService);
  readonly data = inject(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close({borrado:false});
  }

  borrarLugar(){
    this._routeService.deleteRoute(this.data.id);
    this.dialogRef.close({borrado:true});
  }
}
