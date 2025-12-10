# Car Manager API

API REST para gerenciamento de motoristas, carros e utilizações de veículos (Car Usage), desenvolvida como parte de um teste técnico.

A aplicação permite:

- Cadastrar, listar, buscar, atualizar e remover **motoristas**.
- Cadastrar, listar, buscar, atualizar e remover **veículos**.
- Registrar o **início** e a **finalização** de utilizações de automóveis por motoristas, garantindo:
  - Um carro **não pode** estar em mais de uma utilização ativa ao mesmo tempo.
  - Um motorista **não pode** estar usando mais de um carro ao mesmo tempo.

---

## Tecnologias utilizadas

> Ajuste as versões exatas conforme o seu `package.json` e ambiente, se necessário.

| Tecnologia                   | Versão | Uso                              |
| ---------------------------- | ------ | -------------------------------- |
| **Node.js**                  | 20.x   | Runtime                          |
| **Express**                  | 4.x    | Servidor HTTP                    |
| **ESModules (type: module)** | —      | Padrão moderno de imports        |
| **PostgreSQL**               | 14+    | Banco de dados                   |
| **TypeORM**                  | 0.3.x  | ORM                              |
| **Jest**                     | 29.x   | Testes unitários e de integração |
| **Supertest**                | 6.x    | Testes de integração HTTP        |
| **Docker / Docker Compose**  | 24+    | Execução e orquestração          |
| **dotenv**                   | 16.x   | Variáveis de ambiente            |
| **SonarQube**                | —      | Análise de qualidade do código   |

---

## Arquitetura (visão geral)

- **Camada de Domínio** (`src/app/domain`):
  - Entidades: `Car`, `Driver`, `CarUsage` (via `entities` do TypeORM).
  - Services: `CarService`, `DriverService`, `CarUsageService`.
- **Infraestrutura** (`src/app/infra`):
  - Repositórios TypeORM: `OrmCarRepository`, `OrmDriverRepository`, `OrmCarUsageRepository`.
- **Apresentação (HTTP)** (`src/app/presentation/http`):
  - Controllers: `CarController`, `DriverController`, `CarUsageController`.
  - Rotas: `CarRoutes`, `DriverRoutes`, `CarUsageRoutes`, `HealthRoutes`.
- **Configuração** (`src/app/config`):
  - `env.js`: leitura e validação de variáveis de ambiente.
  - `data-source.js`: configuração da conexão do ORM com o banco de dados.
  - `container.js`: composição de repositórios e serviços.

Princípios aplicados:

- Clean Code (nomes claros, funções pequenas, validações explícitas).
- SOLID (especialmente SRP e DIP).
- Inversão de dependência via container (services dependem de repositórios, controllers dependem de services).

---

# Como rodar o projeto com Docker (Passo a passo).

### Requisitos

- Docker instalado
- Porta **3000** livre na sua máquina

Abra o Docker e deixe rodando em segundo plano.

### Subir o projeto

Execute:

`docker-compose up --build`

### Verificar se a API iniciou com sucesso

`http://localhost:3000/health`

Resposta esperada:

{
"status": "ok"
}

### Parar containers

Utilize o comando:
`docker-compose down` para encerrar os containers da aplicação.

---

# Rotas para teste manual

#### Verifique o arquivo `example-payloads.json` na raiz da pasta `tests`, para referência de valores que poderão ser utilizados nos testes de requisições das rotas POST.

## Driver

### Criar motorista

`POST/drivers`

### Listar motoristas

`GET/drivers`

### Recuperar motorista por ID

`GET/drivers/:id`

### Atualizar motorista por ID

`PUT/drivers/:id`

Body:
{
"name": "João Atualizado"
}

### Apagar motorista

`DELETE/drivers/:id`

---

## Car

### Criar carro

`POST/cars`

### Listar carros

`GET/cars`
Opcional: `?color=Prata&brand=Fiat`

### Recuperar carro por ID

`GET/cars/:id`

### Atualizar carro por ID

`PUT/cars/:id`

Body:
{
"color": "Vermelho"
}

### Apagar carro

`DELETE/cars/:id`

---

## Usage

### Criar utilização

`POST/usages`

### Listar utilizações

`GET/usages`

### Recuperar utilização por ID

`GET/usages/:id`

### Finalizar utilização

`PATCH/usages/:id/finish`

Opcional: { "endDate": "pode ser null ou uma data ISO 8601" }
