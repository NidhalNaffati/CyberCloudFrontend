import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  standalone: true,
  imports: [
    RouterLink
  ],
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent {

}
