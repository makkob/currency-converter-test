import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component'; 
import { ConverterComponent } from './components/converter/converter.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent , CommonModule, LayoutComponent, ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss', 
})
export class AppComponent {
  title = 'my-angular-project';
}
