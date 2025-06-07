# Bíblia no MongoDB

Este projeto inclui um script para importar o arquivo `almeida_ra.json` para uma instância do MongoDB.

## Pré-requisitos

- Node.js instalado
- Uma instância do MongoDB acessível
- Defina a variável de ambiente `MONGODB_URI` com a string de conexão. Exemplo:
  ```
  export MONGODB_URI="mongodb://usuario:senha@localhost:27017/biblia"
  ```

## Importação

Execute o seguinte comando na raiz do projeto:

```
node backend/importBible.js
```

O script irá ler `src/assets/almeida_ra.json` e inserir todos os versículos na coleção `verses` do banco especificado na `MONGODB_URI`.
