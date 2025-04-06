import { Component, OnInit } from '@angular/core';
import { MusicaService } from '../../../services/musica.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-busca-genero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-genero.component.html',
  styleUrls: ['./busca-genero.component.css'],
})
export class buscaGeneroComponent {
  musicas: any[] = [];
  musicasRecomendadas: any[] = [];
  filtro: string = '';
  musicasFiltradas: any[] = [];
  musicasSelecionadas: any[] = [];
  musicasRecomendadasTodas: any[] = [];
  musicasRecomendadasVisiveis: any[] = [];
  paginaAtual: number = 1;
  tamanhoPagina: number = 10;
  musicasPorGenero: any[] = [];
  musicasVisiveisGenero: any[] = [];
  tipoBusca: string = 'titulo';

  constructor(
    private musicaService: MusicaService,
    private sanitizer: DomSanitizer
  ) {}

  sanitizarUrl(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://open.spotify.com/embed/track/${id}`);
  }

  genero: string = '';

  buscarPorGenero(): void {
    if (!this.genero.trim()) return;

    this.musicaService.getMusicasPorGenero(this.genero).subscribe(
      (data) => {
        this.paginaAtual = 1;
        this.musicasPorGenero = data.map(musica => ({
          ...musica,
          spotifyUrlSegura: this.sanitizarUrl(musica.id)
        }));
        this.carregarMais(); // inicializa com a primeira página
      },
      (error) => {
        console.error('Erro ao buscar músicas por gênero:', error);
      }
    );
  }

  carregarMais(): void {
    const inicio = (this.paginaAtual - 1) * this.tamanhoPagina;
    const fim = this.paginaAtual * this.tamanhoPagina;
    const maisMusicas = this.musicasPorGenero.slice(inicio, fim);
    this.musicasVisiveisGenero = [...(this.musicasVisiveisGenero || []), ...maisMusicas];
    this.paginaAtual++;
  }
}
