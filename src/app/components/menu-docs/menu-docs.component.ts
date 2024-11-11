import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-docs',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './menu-docs.component.html',
  styleUrl: './menu-docs.component.scss',
})
export class MenuDocsComponent {
  
  constructor() {}

  ngOnInit(): void {}
}
