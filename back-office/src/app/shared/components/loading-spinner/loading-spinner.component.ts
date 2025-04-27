import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule]
})
export class LoadingSpinnerComponent {
  @Input() overlay: boolean = false;
  @Input() diameter: number = 40;
  @Input() message: string = 'Loading...';
}
