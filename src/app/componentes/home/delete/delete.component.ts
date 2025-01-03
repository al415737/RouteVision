import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserService } from '../../../servicios/user.service';
import { AuthStateService } from '../../../utils/auth-state.service';
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
  private _userService = inject(UserService);
  private _authState: AuthStateService = inject(AuthStateService);
  private router = inject(Router); // Inyecta el Router
  readonly data = inject(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
    // Emitir "true" para indicar que se cancela la eliminación (redirige a /home)
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  borrarCuenta(){
    this._userService.deleteUser(this._authState.currentUser?.email);
    this.dialogRef.close();
    // Emitir "false" para indicar que la cuenta se ha borrado y redirigir a /default
    this.router.navigate(['/default']);;
  }
}
