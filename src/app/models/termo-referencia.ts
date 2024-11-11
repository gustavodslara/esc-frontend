export class TermoReferencia {
    esc: string;
    categoria: string;
    anexo: string;
    objeto: string;
    justificativa: string;
    modalidadeLicitacao: string;
    investimento: number; 
    especificacoes: string;
    ementa: string;
    obrigacoesContratante: string;
    obrigacoesContratada: string;
    sancoes: string;
    dotacaoOrcamentaria: string; // Ajustar o tipo conforme necessário
    condicoesPagamento: string;
    documentosRegularidade: string[]; // Considerando que pode haver múltiplos documentos
    contrato: string;
    acompanhamento: string;
    nomeAssinante: string;
    cargoAssinante: string;
    id: number;
    modalidade: string; 
  }