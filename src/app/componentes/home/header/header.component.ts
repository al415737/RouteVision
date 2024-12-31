import { Component, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../servicios/user.service';
import { DeleteComponent } from '../delete/delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private _service = inject(UserService);
  private _router = inject(Router);
  readonly dialog = inject(MatDialog);
  isSettingsOpen: boolean = false;
  

  toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  async logout(){
    await this._service.logoutUser();
    this._router.navigateByUrl('/default');   
  }

  onDelete() {
      this.dialog.open(DeleteComponent).afterClosed().subscribe(() => {
        this._router.navigateByUrl('/default'); 
      });
        
    }
}
