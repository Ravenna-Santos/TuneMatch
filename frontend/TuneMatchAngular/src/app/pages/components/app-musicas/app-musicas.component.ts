import { Component, OnInit } from '@angular/core';
import { MusicaService } from '../../../services/musica.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { buscaGeneroComponent } from '../busca-genero/busca-genero.component';
import { BuscaTituloComponent } from "../busca-titulo/busca-titulo.component";



@Component({
  selector: 'app-app-musicas',
  standalone: true,
  imports: [CommonModule, FormsModule, buscaGeneroComponent, BuscaTituloComponent],
  templateUrl: './app-musicas.component.html',
  styleUrls: ['./app-musicas.component.css'],
})
export class MusicasComponent{

  tipoBusca: string = 'titulo'; // valor inicial





  


}


