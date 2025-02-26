# Especificação Técnica: Sistema de Orçamentação para Construção Civil

## 1. Visão Geral do Sistema

O Sistema de Orçamentação para Construção Civil ("OrçaWorks") é uma aplicação web projetada para simplificar e otimizar o processo de criação de orçamentos na construção civil. O sistema permite aos usuários criar, gerenciar e analisar orçamentos detalhados, com foco em:

- Organização hierárquica por capítulos de trabalho (CAR)
- Detalhamento de materiais, quantidades e valores
- Cálculos automáticos de custos e margens
- Controle interno de dados financeiros
- Geração de documentos para clientes e uso interno

### 1.1 Objetivos-chave

- Simplificar o processo de orçamentação
- Reduzir erros de cálculo
- Fornecer insights financeiros claros
- Separar dados visíveis para clientes de informações de uso interno
- Centralizar a gestão de projetos de construção

## 2. Arquitetura do Sistema

### 2.1 Estrutura de Camadas

```
+-------------------------------------------+
|              Interface do Usuário         |
|  (Componentes React/Vue, Páginas, Modais) |
+-------------------------------------------+
|              Gerenciamento de Estado      |
|      (Context API, Redux ou Pinia)        |
+-------------------------------------------+
|              Lógica de Negócios           |
|    (Cálculos, Validações, Formatações)    |
+-------------------------------------------+
|              Serviços                     |
| (Armazenamento local, Simulação de API)   |
+-------------------------------------------+
```

### 2.2 Tecnologias Recomendadas

#### Front-end:
- **Framework**: Next.js (React) ou Nuxt.js (Vue.js)
- **Estilização**: Tailwind CSS
- **Componentes**: Shadcn/UI (React) ou PrimeVue (Vue.js)
- **Gerenciamento de estado**: Context API/Redux (React) ou Pinia (Vue.js)
- **Tabelas interativas**: TanStack Table (React) ou VueGoodTable (Vue.js)
- **Formulários**: React Hook Form ou VeeValidate
- **Manipulação de dados numéricos**: dinero.js, numeral.js

#### Funcionalidades de exportação:
- **PDF**: jsPDF, react-pdf
- **Excel**: xlsx, SheetJS
- **Compartilhamento**: html2canvas

## 3. Estrutura de Dados

### 3.1 Esquema Principal

O sistema utiliza uma estrutura de dados JSON para representar orçamentos. A estrutura principal inclui:

```javascript
{
  "CAR_1": {
    "header": "FUNDAÇÃO SUPERFICIAL - B. S.C/VIGA",
    "items": [
      {
        "MATERIAL": "AREIA",
        "UNIDADE": "M³",
        "QTD": "7,33",
        "VALOR_UNITARIO": "73,96",
        "VALOR": "542,14"
      },
      // Outros itens...
    ]
  },
  // Outros capítulos (CAR)...

  "CONTROLE_INTERNO": {
    "VENDA": {
      "header": "Venda",
      "items": [
        {
          "Custo_Seco_Euro": "0,00",
          "Custo_Total_Euro": "0,00",
          "Margem_Percentual": "30,00%",
          "Venda_Euro": "0,00",
          "Margem_Euro": "0,00"
        }
      ]
    },
    "DIVERSOS": { /* ... */ },
    "SUB_EMPREITEIROS": { /* ... */ },
    "AMORTIZACOES": { /* ... */ }
  }
}
```

### 3.2 Estrutura Detalhada do Controle Interno

```javascript
"CONTROLE_INTERNO": {
  "VENDA": {
    "header": "Venda",
    "items": [
      {
        "Custo_Seco_Euro": "0,00",
        "Custo_Total_Euro": "0,00",
        "Margem_Percentual": "30,00%",
        "Venda_Euro": "0,00",
        "Margem_Euro": "0,00"
      }
    ]
  },
  "DIVERSOS": {
    "header": "Diversos",
    "items": [
      {
        "Alimentacao_Euro": "0,00",
        "Passagens_Euro": "0,00",
        "Outros_Euro": "0,00"
      }
    ]
  },
  "SUB_EMPREITEIROS": {
    "header": "Sub-Empreiteiros",
    "items": [
      {
        "Fornecedor_1_Euro": "0,00",
        "Fornecedor_2_Euro": "0,00",
        "Fornecedor_3_Euro": "0,00",
        "Fornecedor_4_Euro": "0,00",
        "Fornecedor_5_Euro": "0,00",
        "Total_Euro": "0,00"
      }
    ]
  },
  "AMORTIZACOES": {
    "header": "Amortizações",
    "items": [
      {
        "tipo": "Material",
        "Total_Euro": "0,00"
      },
      {
        "tipo": "Mão de Obra",
        "Total_Euro": "0,00",
        "E_O_A": "E",
        "Duracao_Horas": "0,00",
        "Total_Euro_Mao_de_Obra": "0,00"
      }
    ]
  }
}
```

## 4. Interfaces do Usuário

### 4.1 Telas Principais

1. **Dashboard de Projetos**
   - Lista de projetos/orçamentos
   - Criação de novo orçamento
   - Filtros e pesquisa

2. **Editor de Orçamento**
   - Visualização de capítulos (CAR)
   - Edição de itens
   - Controle interno (painel lateral)
   - Cálculo automático de valores

3. **Gestão de Capítulos**
   - Adicionar/Editar/Remover capítulos
   - Reordenar capítulos
   - Importar modelos

4. **Exportação e Relatórios**
   - Geração de PDF para cliente
   - Exportação Excel
   - Relatórios internos

### 4.2 Componentes Interativos

1. **Capítulos Expansíveis**
   - Dropdown para expandir/contrair detalhes
   - Exibição de totais por capítulo
   - Ações rápidas (editar, duplicar, excluir)

2. **Editor de Itens**
   - Modal para edição de detalhes
   - Campos validados
   - Cálculo automático de valores

3. **Tabela de Controle Interno**
   - Campos editáveis
   - Totalizadores automáticos
   - Adição dinâmica de linhas/colunas

4. **Barra de Resumo**
   - Totais do orçamento
   - Indicadores de margem
   - Alertas de validação

### 4.3 Mockups de Interface

#### Tela Principal de Orçamentação
![Interface Completa de Orçamentação com Controle Interno](./budget-internal-control.svg)

#### Modal de Edição de Item
![Interface de Edição de Item do Orçamento](./item-detail-mockup.svg)

#### Modal de Adição de Capítulo
![Interface de Adição de Novo Capítulo](./new-chapter-mockup.svg)

## 5. Lógica de Cálculo

### 5.1 Cálculos para Itens de Capítulo

```javascript
// Cálculo do valor total de um item
valorTotal = quantidade * valorUnitario;

// Cálculo do total de um capítulo
totalCapitulo = items.reduce((sum, item) => sum + parseFloat(item.VALOR), 0);

// Cálculo do total geral de materiais
totalGeralMateriais = Object.keys(orcamento)
  .filter(key => key.startsWith('CAR'))
  .reduce((sum, key) => {
    return sum + calculateChapterTotal(orcamento[key]);
  }, 0);
```

### 5.2 Cálculos para Controle Interno

```javascript
// Cálculo do custo total
custoTotal = custoSeco + totalDiversos + totalSubEmpreiteiros + totalAmortizacoes;

// Cálculo do valor de venda
valorVenda = custoTotal / (1 - (margemPercentual / 100));

// Cálculo da margem em euros
margemEuros = valorVenda - custoTotal;

// Cálculo do total de sub-empreiteiros por linha
totalSubEmpreiteirosLinha = fornecedor1 + fornecedor2 + fornecedor3 + fornecedor4 + fornecedor5;

// Cálculo do total geral de sub-empreiteiros
totalGeralSubEmpreiteiros = subEmpreiteiros.items.reduce((sum, item) => {
  return sum + parseFloat(item.Total_Euro);
}, 0);
```

### 5.3 Validações de Dados

- Valores numéricos: devem ser números positivos
- Quantidades: devem ser números positivos
- Margem percentual: entre 0% e 100%
- Cálculos: verificar consistência entre valor calculado e informado

## 6. Fluxos de Navegação e Interação

### 6.1 Fluxo de Criação de Orçamento

```
Início → Criar Novo Orçamento → Informações Básicas → 
Adicionar Capítulos → Adicionar Itens → Configurar Controle Interno →
Revisar Orçamento → Exportar/Salvar
```

### 6.2 Fluxo de Adição de Item

```
Selecionar Capítulo → Clicar em "Adicionar Item" → 
Preencher Formulário (Material, Unidade, Quantidade, Valor Unitário) → 
Sistema Calcula Valor Total → Confirmar → Item Adicionado
```

### 6.3 Fluxo de Edição de Capítulo

```
Selecionar Capítulo → Opções → Editar → 
Modificar Título/Dados → Salvar → Capítulo Atualizado
```

### 6.4 Fluxo de Atualização de Margens

```
Acessar Seção "VENDA" → Modificar Margem Percentual → 
Sistema Recalcula Valor de Venda e Margem em Euros → 
Atualização Automática do Resumo
```

## 7. Plano de Implementação por Fases

### Fase 1: Estrutura Básica e Interface
- Configuração do projeto com framework escolhido
- Implementação da estrutura de componentes
- Interface de navegação básica
- Estilização conforme mockups

### Fase 2: Funcionalidades de Orçamentação
- Adição/edição/remoção de capítulos
- Adição/edição/remoção de itens
- Cálculos automáticos básicos
- Persistência de dados local

### Fase 3: Controle Interno
- Implementação da seção de controle interno
- Integração com os dados de capítulos
- Cálculos financeiros avançados
- Validações de dados

### Fase 4: Exportação e Recursos Adicionais
- Exportação para PDF/Excel
- Salvar/carregar orçamentos
- Melhorias de usabilidade
- Otimizações de performance

## 8. Recomendações de Desenvolvimento

1. **Abordagem Modular**: Desenvolver componentes isolados e reutilizáveis
2. **Prototipagem Ágil**: Começar com funcionalidades essenciais e expandir
3. **Teste com Usuários Reais**: Validar a usabilidade o mais cedo possível
4. **Separação de Lógica**: Manter a lógica de cálculo separada da interface
5. **Dados de Exemplo**: Criar um conjunto de dados de exemplo realistas para testes

## 9. Considerações de UX/UI

1. **Consistência Visual**: Manter padrão visual em todas as seções
2. **Feedback Claro**: Indicar claramente o resultado de ações (sucesso/erro)
3. **Sugestões Contextuais**: Ajudar o usuário com dicas em campos importantes
4. **Performance Percebida**: Garantir que cálculos complexos não travem a interface
5. **Modo de Edição vs. Visualização**: Distinguir claramente áreas editáveis

## 10. Bibliotecas e Recursos Recomendados

### Componentes e UI
- Shadcn/UI: https://ui.shadcn.com/ (React)
- PrimeVue: https://primevue.org/ (Vue.js)
- TailwindCSS: https://tailwindcss.com/

### Manipulação de Dados
- Zod: https://github.com/colinhacks/zod (validação)
- Dinero.js: https://dinerojs.com/ (valores monetários)
- date-fns: https://date-fns.org/ (manipulação de datas)

### Exportação
- jsPDF: https://github.com/parallax/jsPDF
- SheetJS: https://sheetjs.com/
- html-to-image: https://github.com/bubkoo/html-to-image

## 11. Glossário de Termos

- **CAR**: Capítulo de Orçamento, representa uma categoria de trabalho ou serviço
- **Custo Seco**: Soma de todos os custos diretos de materiais
- **Custo Total**: Custo seco acrescido de outros custos (diversos, sub-empreiteiros, amortizações)
- **Margem**: Diferença entre o valor de venda e o custo total
- **E/O/A**: Classificação da mão de obra (Equipamento, Outros, Auxiliares)
- **Sub-Empreiteiros**: Fornecedores terceirizados para serviços específicos