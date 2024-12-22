import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './default.component.html',
  styleUrl: './default.component.css'
})
export default class DefaultComponent {

}
