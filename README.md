# API da plataforma de Bots

Back-end da plataforma de bots, desenvolvida por Felipe Guerra

### Stack de tecnologias

A API foi desenvolvida usando Node.js, Express e MongoDB. Para a realização de testes, utilizei a lib Chai (os testes precisam ser finalizados, embora a estrutura para executá-los já esteja pronta).

### Design Patterns

A arquitetura do API foi inspirada no design pattern MVC (Model, View e Controller), com algumas adaptações em sua estrutura.

Para saber mais, [clique aqui](https://www.geeksforgeeks.org/mvc-design-pattern/) 

### Endpoints

Uma vez que você baixou e executou o projeto localmemte, é possível importar o Workspace de testes no Postman através [deste link](https://www.getpostman.com/collections/8fd08656a965fb136ddd).

### Escalabilidade

Essa aplicação foi desenvolvida num framework altamente escalável capaz de ser implantando em todos os grandes players de computação em nuvem. Além disso, a combinação com um banco de dados não relacional como o MongoDB, permite que a aplicação seja extremamente eficiente.

### Setup do projeto

Instale as dependências através do comando: 

```sh
npm i
```

Customize o arquivo `.env.development` de acordo com o nome da base de dados que você vai usar para o projeto e outras configurações de ambiente


### Execução

Para executar o projeto em ambiente de desenvolvimento:

```sh
npm run dev
```
