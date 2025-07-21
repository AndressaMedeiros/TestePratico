# Teste Prático - Desenvolvedor .NET

Este repositório contém a solução desenvolvida para o teste prático com o objetivo de avaliar meus conhecimentos técnicos e capacidade de implementação com base nos requisitos propostos.

## 📝 Descrição

A aplicação fornecida (`FI.WebAtividadeEntrevista.sln`) trata-se de um sistema de manutenção de dados básicos de clientes. As seguintes funcionalidades foram implementadas conforme solicitado:

### ✅ Funcionalidades Implementadas

- **Campo CPF no cadastro de clientes**
  - Inclusão do campo CPF na tela de cadastro/alteração de clientes
  - Validação do CPF (formato e dígito verificador)
  - CPF obrigatório e com formatação `999.999.999-99`
  - Não permite duplicidade de CPF no banco de dados

- **Botão "Beneficiários"**
  - Inclusão de botão para gerenciar beneficiários do cliente
  - Pop-up para cadastro/edição/exclusão de beneficiários
  - Campos: CPF e Nome do Beneficiário
  - Validação de CPF (formato e integridade)
  - Impede duplicidade de CPF entre beneficiários de um mesmo cliente
  - Persistência dos beneficiários atrelada ao cliente no momento do "Salvar"

## 🛠️ Tecnologias Utilizadas

- .NET Framework 4.8
- ASP.NET Web Forms
- SQL Server Express 2019 LocalDB
- Visual Studio 2022

## 📁 Estrutura de Banco de Dados

### Tabela: `CLIENTES`
- Adicionado campo: `CPF` (string, obrigatório, único)

### Tabela: `BENEFICIARIOS`
- Campos:
  - `ID` (int, identity, chave primária)
  - `IDCLIENTE` (int, chave estrangeira)
  - `NOME` (string, obrigatório)
  - `CPF` (string, obrigatório, único por cliente)

Em caso de erro no banco de dados, será necessário rodar todos os scripts presentes na pasta DAL
