module.exports = {
  theme: {
    extend: {
      colors: {
        // Identidade Institucional SEPLAG (Estado)
        gov: {
          primary: '#0056A4',    // Azul Real
          dark: '#0A2540',       // Azul Escuro para Textos/Sidebar
          light: '#F4F6F9',      // Fundo da aplicação
        },
        // Cores Semânticas para o Painel Orçamentário
        status: {
          success: '#10B981',    // Verde (Contratos vigentes, Orçamentos revisados)
          warning: '#F59E0B',    // Amarelo/Laranja (Contratos suspensos, Pago > Liquidado)
          danger: '#EF4444',     // Vermelho (Saldo negativo, Contrato vencido)
          info: '#3B82F6',       // Azul (Valores empenhados/padrão)
          muted: '#94A3B8',      // Cinza (Informação não disponível, Contrato encerrado)
        }
      }
    }
  }
}