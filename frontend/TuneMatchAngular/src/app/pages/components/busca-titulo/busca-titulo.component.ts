import { Component, OnInit } from '@angular/core';
import { MusicaService } from '../../../services/musica.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';




@Component({
  selector: 'busca-titulo',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './busca-titulo.component.html',
  styleUrls: ['./busca-titulo.component.css'],
})
export class BuscaTituloComponent implements OnInit {
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
  tipoBusca: string = 'titulo'; // valor inicial

  

  constructor(
    private musicaService: MusicaService,
    private sanitizer: DomSanitizer
  ) {}
  

  ngOnInit(): void {
    this.musicaService.getMusicas().subscribe((data) => {
      this.musicas = data;
      this.musicasFiltradas = data;
      console.log(this.musicas);
    });
  }

  filtrarMusicas(): void {
    const termo = this.filtro.toLowerCase();
    this.musicasFiltradas = this.musicas.filter((musica) =>
      musica.titulo.toLowerCase().includes(termo)
    );
  }

  selecionarMusica(musica: any): void {
    if (
      !this.musicasSelecionadas.some((m) => m.id === musica.id)
    ) {
      this.musicasSelecionadas.push(musica);
      this.filtro = '';
      this.musicasFiltradas = this.musicas;
    }
  }

  removerMusica(musica: any): void {
    this.musicasSelecionadas = this.musicasSelecionadas.filter(
      (m) => m.id !== musica.id
    );
  }

  sugerirPlaylist(): void {
    const ids = this.musicasSelecionadas.map(m => m.id);
  
    this.musicaService.recomendarMusicas(ids).subscribe(
      (recomendadas) => {
        // Cria a propriedade spotifyUrl segura para cada música
        this.musicasRecomendadasTodas = recomendadas.map(musica => ({
          ...musica,
          spotifyUrlSegura: this.sanitizer.bypassSecurityTrustResourceUrl(`https://open.spotify.com/embed/track/${musica.id}`)
        }));
  
        this.paginaAtual = 1;
        this.musicasRecomendadasVisiveis = this.musicasRecomendadasTodas.slice(0, this.tamanhoPagina);
      },
      (error) => {
        console.error('Erro ao sugerir playlist:', error);
      }
    );
  }
  
  
  carregarMais(): void {
    this.paginaAtual++;
    const inicio = (this.paginaAtual - 1) * this.tamanhoPagina;
    const fim = this.paginaAtual * this.tamanhoPagina;
    const maisMusicas = this.musicasRecomendadasTodas.slice(inicio, fim).map(musica => ({
      ...musica,
      spotifyUrlSegura: this.sanitizer.bypassSecurityTrustResourceUrl(`https://open.spotify.com/embed/track/${musica.id}`)
    }));
    this.musicasRecomendadasVisiveis.push(...maisMusicas);
  }
  
  

  sanitizarUrl(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://open.spotify.com/embed/track/${id}`);
  }
  
 
}
