package com.aed2.tunematch.negocio;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

public class Grafo {
    //Lista de Vertices
    private Map<String, Musica> musicas;
    //Lista de adjacencias (arestas nao direcionadas)
    private Map<String, Map<Musica, Double>> listaAdjacencia = new HashMap<>();

    public Grafo(){
        musicas = new HashMap<>();
    }

    public Grafo(String caminhoCSV){
        musicas = new HashMap<>();
        listaAdjacencia = new HashMap<>();
        carregarGrafo(caminhoCSV);
    }

    private void carregarGrafo(String caminhoCSV) {
        try (Reader leitor = new FileReader(caminhoCSV);
             CSVParser csvParser = new CSVParser(leitor, CSVFormat.DEFAULT.withQuote('"'))) {
            
            Iterator<CSVRecord> iterator = csvParser.iterator();
            if (!iterator.hasNext()) return;
            
            CSVRecord primeiraLinha = iterator.next();
            int numMusicas = Integer.parseInt(primeiraLinha.get(0));
            int numArestas = Integer.parseInt(primeiraLinha.get(1));

            for (int i = 0; i < numMusicas && iterator.hasNext(); i++) {
                CSVRecord registro = iterator.next();
                String id = registro.get(0);
                String titulo = registro.get(1);
                List<String> artistas = Arrays.asList(registro.get(2).split(";"));
                String genero = registro.get(3);
                int popularidade = Integer.parseInt(registro.get(4));
                double danceability = Double.parseDouble(registro.get(5));
                double energy = Double.parseDouble(registro.get(6));
                double valence = Double.parseDouble(registro.get(7));

                Musica musica = new Musica(id, titulo, artistas, genero, popularidade, danceability, energy, valence);
                musicas.put(id, musica);
                listaAdjacencia.put(id, new HashMap<>());
            }

            for (int i = 0; i < numArestas && iterator.hasNext(); i++) {
                CSVRecord registro = iterator.next();
                String idMusica1 = registro.get(0);
                String idMusica2 = registro.get(1);
                double peso = Double.parseDouble(registro.get(2));

                listaAdjacencia.get(idMusica1).put(musicas.get(idMusica2), peso);
                listaAdjacencia.get(idMusica2).put(musicas.get(idMusica1), peso);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public void inserirMusica(Musica musica){
        //Inserir cria um vértice e cria um array de vértices, como se fosse uma lista de adjacencia
        musicas.putIfAbsent(musica.getId(), musica);
        listaAdjacencia.putIfAbsent(musica.getId(), new HashMap<Musica, Double>());
    }

    public Map<String, Map<Musica, Double>> getListaAdjacencia() {
        return listaAdjacencia;
    }

    public Map<String, Musica> getMusicas() {
        return musicas;
    }

    public List<Musica> recomendarMusicas(List<Musica> musicasBase) {
        Set<Musica> visitados = new HashSet<>(musicasBase); // Conjunto para evitar ciclos e repetições
        Map<Musica, Double> mapaPesos = new HashMap<>(); // Acumula os pesos de conexões com as músicas base
    
        // Acumular pesos de todas as conexões de todas as músicas da base
        for (Musica musica : musicasBase) {
            if (!listaAdjacencia.containsKey(musica.getId())) continue;
    
            for (Map.Entry<Musica, Double> entrada : listaAdjacencia.get(musica.getId()).entrySet()) {
                Musica vizinho = this.musicas.get(entrada.getKey().getId());
                if (vizinho == null || visitados.contains(vizinho)) continue;
    
                // Soma os pesos para vizinhos em comum entre músicas base
                mapaPesos.merge(vizinho, entrada.getValue(), Double::sum);
            }
        }
    
        // Criar fila de prioridade com base nos pesos acumulados
        PriorityQueue<Map.Entry<Musica, Double>> fila_de_prioridade = new PriorityQueue<>(
            (a, b) -> Double.compare(b.getValue(), a.getValue()) // Ordenação decrescente por peso
        );
        fila_de_prioridade.addAll(mapaPesos.entrySet());
    
        List<Musica> recomendacoes = new ArrayList<>();
        while (!fila_de_prioridade.isEmpty() && recomendacoes.size() < 30) {
            Map.Entry<Musica, Double> maisRelacionado = fila_de_prioridade.poll();
    
            if (!recomendacoes.contains(maisRelacionado.getKey())) {
                recomendacoes.add(maisRelacionado.getKey());
                visitados.add(maisRelacionado.getKey());
            }
    
            // Explorar vizinhos das músicas recomendadas para aumentar a profundidade da recomendação
            if (listaAdjacencia.containsKey(maisRelacionado.getKey().getId())) {
                for (Map.Entry<Musica, Double> entrada : listaAdjacencia.get(maisRelacionado.getKey().getId()).entrySet()) {
                    Musica vizinho = this.musicas.get(entrada.getKey().getId());
                    if (vizinho != null && !visitados.contains(vizinho)) {
                        mapaPesos.merge(vizinho, entrada.getValue(), Double::sum);
                        fila_de_prioridade.offer(Map.entry(vizinho, mapaPesos.get(vizinho)));
                    }
                }
            }
        }
        return recomendacoes;
    }

    public List<Musica> buscarPorGenero(String genero) {
    return musicas.values().stream()
            .filter(m -> m.getGenero().equalsIgnoreCase(genero))
            .collect(Collectors.toList());
    }
}