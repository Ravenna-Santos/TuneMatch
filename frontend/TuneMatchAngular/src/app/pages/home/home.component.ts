import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TitleComponent } from "../components/title/title.component";
import { MusicasComponent } from "../components/app-musicas/app-musicas.component";
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [
    TitleComponent,
    MusicasComponent,
    FooterComponent,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
