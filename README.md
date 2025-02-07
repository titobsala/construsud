# Sistema de Gestão de Propostas - Documentação

## Visão Geral
Sistema para automatizar o processo de criação e análise de propostas de construção civil, baseado em um template Excel existente (Modelo 2024.001 Matriz Proposta.xlsx).

## Workflow Atual
1. Recebimento de proposta do cliente com orçamento e mapa de quantidades
2. Uso do arquivo template Excel para gerar orçamento
3. Cálculo manual de margens e custos
4. Geração de proposta final

## Solução Proposta
Sistema web que automatiza o processo, dividido em três camadas principais:

### 1. Extração de Dados
- Parser para propostas de clientes
- Mapeamento para estrutura padronizada
- Suporte a diferentes formatos de entrada

### 2. Motor de Cálculo
- Engine para processamento de custos
- Cálculo automático de margens
- Validações e alertas

### 3. Interface
- Configuração de parâmetros base
- Input estruturado por capítulos
- Visualização de resultados e análises

## Estrutura Técnica

### Tecnologias
- React + TypeScript
- TailwindCSS para estilização
- Bibliotecas UI: shadcn/ui

### Arquitetura de Código
```
src/
├── components/         # Componentes React
├── lib/               # Lógica de negócio
├── types/             # Tipos TypeScript
├── hooks/             # Custom hooks
├── context/           # Contextos React
└── pages/             # Páginas da aplicação
```

### Core Features
1. Configuração de Parâmetros
   - Custos de mão de obra
   - Custos logísticos
   - Gestão de subempreiteiros

2. Processamento de Dados
   - Cálculo de custos diretos e indiretos
   - Análise de margens
   - Validações automáticas

3. Dashboard de Resultados
   - Visualização de custos
   - Análise de margens
   - Relatórios

## Próximos Passos

### Fase 1 - Setup Inicial
1. Criar estrutura base do projeto
2. Configurar ambiente de desenvolvimento
3. Implementar motor de cálculo base

### Fase 2 - Interface Básica
1. Desenvolver interface de configuração
2. Criar formulários de input
3. Implementar visualização básica

### Fase 3 - Funcionalidades Avançadas
1. Adicionar validações
2. Implementar análises
3. Desenvolver relatórios

## Primeiro Sprint
1. Setup do projeto com estrutura proposta
2. Migração do CalculationEngine para TypeScript
3. Implementação da interface de configuração
4. Testes iniciais com dados reais

## Regras de Negócio Importantes
- Cálculo de custos considerando material, mão de obra, subempreiteiros, logística e diversos
- Margens calculadas com base no preço de venda vs custo seco
- Validações específicas para cada tipo de serviço