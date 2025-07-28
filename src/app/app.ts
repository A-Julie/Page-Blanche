import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterModule], // si Header est standalone
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'page-blanche';
}
