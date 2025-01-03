import { Component, inject } from '@angular/core';
import { PlaceService } from '../../../servicios/place.service';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

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
  private _placeService = inject(PlaceService);
  readonly data = inject(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close({borrado:false});
  }

  borrarLugar(){
    this._placeService.deletePlace(this.data.id);
    this.dialogRef.close({borrado:true});
  }
}
