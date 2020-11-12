# Parking App

## Solução
A solução consiste numa API REST, utilizando Node.js 14.x + Nest.js e MongoDB 4.2x.

### Por que Nest.js?

Para tomar essa decisão, foi levado em conta os requisitos do desafio.

Nest.js tem uma gama de plugins que permite fazer integração direta com MongoDB, através do pacote Mongoose. Além disso, Nest.js tem diversas ferramentas para validação de dados, gerenciamento de erros, e uma opinião de estrutura sólida.

Nest.js por padrão, utiliza TypeScript. O que torna o código melhor documentado e minimiza problemas em runtime.

## Rodando a aplicação

Foi criado um arquivo docker-compose junto a um Dockerfile para rodar toda a aplicação dockerizada.

**Obs**: todos os comandos scripts para buildar e rodar a aplicação, estão no arquivo `Makefile`.


Primeiramente, crie um arquivo `.env` e defina todas as variáveis que estão dentro de `.env.example`.

### Instale os pacotes necessários

```bash
make install
```

### Construa a aplicação

```bash
make build
```

### Subindo os containers

```bash
make dkup
# se preferir um build adiante, use dkbuild ou dkup/build
```

**Obs**: foi criado um script shell para criar um usuário no MongoDB somente para a aplicação. *Você precisa definir as variáveis de ambiente dentro do arquivo `.env`.*


### Rodando os testes

```bash
make test
```

### Rodando testes E2E

Devido a algumas limitações (alguns binários do mongo em memória), este comando é executado no host.

```bash
make test/e2e
```

## E as rotas?

Todas as rotas estão documentadas utilizando [Swagger](https://swagger.io/). Basta acessar a rota `/api-docs` da aplicação. Ex: http://localhost:3000/api-docs.

## E integração continua, tem?

Siimm! Os arquivos de workflow se encontram na pasta `.github/workflows`. Foi criado alguns jobs para rodar os testes unitários e de ponta-a-ponta.
