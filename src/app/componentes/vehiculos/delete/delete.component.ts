import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { Router } from '@angular/router';

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
    private _vehiculoService = inject(VehiculoService);
    private router = inject(Router);
    readonly data = inject(MAT_DIALOG_DATA);
  
    onNoClick(): void {
      this.dialogRef.close({borrado:false});
    }
  
    borrarLugar(){
      this._vehiculoService.eliminarVehiculo(this.data.matricula);
      this.dialogRef.close({borrado:true});
    }
}
