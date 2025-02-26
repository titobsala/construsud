const initialBudget = {
    project: {
      id: "PROJ-001",
      name: "Projeto",
      client: "Cliente Exemplo",
      date_created: "2025-02-25",
      last_modified: "2025-02-25",
      status: "em_andamento"
    },
    chapters: {
      "CAR 1": {
        header: "FUNDAÇÃO SUPERFICIAL - B. S.C/VIGA",
        items: [
          {
            id: "1-1",
            MATERIAL: "AREIA",
            UNIDADE: "M³",
            QTD: 7.33,
            VALOR_UNITARIO: 73.96,
            VALOR: 542.14
          },
          {
            id: "1-2",
            MATERIAL: "FORMA MADEIRA P/ SAPATA",
            UNIDADE: "M²",
            QTD: 2.36,
            VALOR_UNITARIO: 20.44,
            VALOR: 48.24
          },
          {
            id: "1-3",
            MATERIAL: "ACO CA-50 10 MM",
            UNIDADE: "KG",
            QTD: 14.77,
            VALOR_UNITARIO: 5.51,
            VALOR: 81.38
          },
          {
            id: "1-4",
            MATERIAL: "ACO CA-50 12,5 MM",
            UNIDADE: "KG",
            QTD: 12.88,
            VALOR_UNITARIO: 5.51,
            VALOR: 70.97
          },
          {
            id: "1-5",
            MATERIAL: "ACO CA-50 16 MM",
            UNIDADE: "KG",
            QTD: 20.47,
            VALOR_UNITARIO: 5.51,
            VALOR: 112.79
          },
          {
            id: "1-6",
            MATERIAL: "BROCA MANUAL P/ ESTACA",
            UNIDADE: "UN",
            QTD: 1.00,
            VALOR_UNITARIO: 29.90,
            VALOR: 29.90
          },
          {
            id: "1-7",
            MATERIAL: "CIMENTO CP-II-Z-32",
            UNIDADE: "SC",
            QTD: 1.91,
            VALOR_UNITARIO: 32.07,
            VALOR: 61.25
          },
          {
            id: "1-8",
            MATERIAL: "CONCRETO FCK=25 MPA",
            UNIDADE: "M³",
            QTD: 1.59,
            VALOR_UNITARIO: 336.76,
            VALOR: 536.45
          }
        ]
      },
      "CAR 2": {
        header: "MOVIMENTO DE TERRA, REATERRO, COMPACTACAO E NIVELAMENTO",
        items: [
          {
            id: "2-1",
            MATERIAL: "AREIA",
            UNIDADE: "M³",
            QTD: 0.26,
            VALOR_UNITARIO: 73.96,
            VALOR: 19.23
          },
          {
            id: "2-2",
            MATERIAL: "AREIA GROSSA",
            UNIDADE: "M³",
            QTD: 0.19,
            VALOR_UNITARIO: 87.48,
            VALOR: 16.62
          },
          {
            id: "2-3",
            MATERIAL: "CAMISA PLASTICA",
            UNIDADE: "UN",
            QTD: 1.00,
            VALOR_UNITARIO: 2.59,
            VALOR: 2.59
          },
          {
            id: "2-4",
            MATERIAL: "FITA VEDA ROSCA 1/2\"",
            UNIDADE: "UN",
            QTD: 1.00,
            VALOR_UNITARIO: 2.38,
            VALOR: 2.38
          },
          {
            id: "2-5",
            MATERIAL: "GEOTEXTIL BIDIM OP-50",
            UNIDADE: "M²",
            QTD: 1.50,
            VALOR_UNITARIO: 3.70,
            VALOR: 5.55
          },
          {
            id: "2-6",
            MATERIAL: "MANGUEIRA CRISTAL 1\"",
            UNIDADE: "M",
            QTD: 1.00,
            VALOR_UNITARIO: 4.49,
            VALOR: 4.49
          },
          {
            id: "2-7",
            MATERIAL: "MANGUEIRA CRISTAL 1/2\"",
            UNIDADE: "M",
            QTD: 1.00,
            VALOR_UNITARIO: 2.31,
            VALOR: 2.31
          },
          {
            id: "2-8",
            MATERIAL: "PLASTICO PRETO",
            UNIDADE: "KG",
            QTD: 1.50,
            VALOR_UNITARIO: 6.75,
            VALOR: 10.13
          }
        ]
      },
      "CAR 3": {
        header: "PAREDES",
        items: [
          {
            id: "3-1",
            MATERIAL: "BLOCO CERAMICO 14X19X29",
            UNIDADE: "UN",
            QTD: 125.00,
            VALOR_UNITARIO: 1.65,
            VALOR: 206.25
          },
          {
            id: "3-2",
            MATERIAL: "CHAPISCO C/ MASSA PRONTA",
            UNIDADE: "M²",
            QTD: 12.00,
            VALOR_UNITARIO: 10.82,
            VALOR: 129.84
          },
          {
            id: "3-3",
            MATERIAL: "MASSA ASSENTAMENTO",
            UNIDADE: "M³",
            QTD: 1.50,
            VALOR_UNITARIO: 222.89,
            VALOR: 334.34
          },
          {
            id: "3-4",
            MATERIAL: "MASSA REBOCO/EMBOCO",
            UNIDADE: "M³",
            QTD: 1.50,
            VALOR_UNITARIO: 222.89,
            VALOR: 334.34
          }
        ]
      }
    },
    CONTROLE_INTERNO: {
      VENDA: {
        header: "Venda",
        items: [
          {
            Custo_Seco_Euro: 6542.82,
            Custo_Total_Euro: 6942.82,
            Margem_Percentual: 30.00,
            Venda_Euro: 9025.67,
            Margem_Euro: 2082.85
          }
        ]
      },
      DIVERSOS: {
        header: "Diversos",
        items: [
          {
            Alimentacao_Euro: 150.00,
            Passagens_Euro: 250.00,
            Outros_Euro: 0.00
          }
        ]
      },
      SUB_EMPREITEIROS: {
        header: "Sub-Empreiteiros",
        items: [
          {
            Fornecedor_1_Euro: 0.00,
            Fornecedor_2_Euro: 0.00,
            Fornecedor_3_Euro: 0.00,
            Fornecedor_4_Euro: 0.00,
            Fornecedor_5_Euro: 0.00,
            Total_Euro: 0.00
          }
        ]
      },
      AMORTIZACOES: {
        header: "Amortizações",
        items: [
          {
            tipo: "Material",
            Total_Euro: 0.00
          },
          {
            tipo: "Mão de Obra",
            Total_Euro: 0.00,
            E_O_A: "E",
            Duracao_Horas: 24.00,
            Total_Euro_Mao_de_Obra: 0.00
          }
        ]
      }
    },
    configuracoes: {
      moeda: "EUR",
      formato_numero: "PT-PT",
      casas_decimais: 2,
      mostrar_todos_capitulos: true,
      margem_padrao: 30.00
    }
  };
  
  export default initialBudget;