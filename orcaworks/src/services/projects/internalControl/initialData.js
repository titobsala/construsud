// src/services/projects/internalControl/initialData.js

/**
 * Returns initial data structure for internal control sections
 * @param {string} projectId - Project ID
 * @returns {Array} Array of internal control data objects
 */
export const getInitialInternalControlData = (projectId) => [
    {
      project_id: projectId,
      type: 'VENDA',
      data: {
        header: "Venda",
        items: [
          {
            Custo_Seco_Euro: 0,
            Custo_Total_Euro: 0,
            Margem_Percentual: 30.00,
            Venda_Euro: 0,
            Margem_Euro: 0
          }
        ]
      }
    },
    {
      project_id: projectId,
      type: 'DIVERSOS',
      data: {
        header: "Diversos",
        items: [
          {
            Alimentacao_Euro: 0,
            Passagens_Euro: 0,
            Outros_Euro: 0
          }
        ]
      }
    },
    {
      project_id: projectId,
      type: 'SUB_EMPREITEIROS',
      data: {
        header: "Sub-Empreiteiros",
        items: [
          {
            Fornecedor_1_Euro: 0,
            Fornecedor_2_Euro: 0,
            Fornecedor_3_Euro: 0,
            Fornecedor_4_Euro: 0,
            Fornecedor_5_Euro: 0,
            Total_Euro: 0
          }
        ]
      }
    },
    {
      project_id: projectId,
      type: 'AMORTIZACOES',
      data: {
        header: "Amortizações",
        items: [
          {
            tipo: "Material",
            Total_Euro: 0
          },
          {
            tipo: "Mão de Obra",
            Total_Euro: 0,
            E_O_A: "E",
            Duracao_Horas: 0,
            Total_Euro_Mao_de_Obra: 0
          }
        ]
      }
    }
  ];