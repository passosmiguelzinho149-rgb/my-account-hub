export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      carrinho_itens: {
        Row: {
          criado_em: string
          id: string
          produto_id: string
          quantidade: number
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          produto_id: string
          quantidade?: number
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          produto_id?: string
          quantidade?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrinho_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      cartoes: {
        Row: {
          apelido: string | null
          bandeira: string | null
          bloqueado: boolean
          conta_id: string | null
          criado_em: string
          cvv: string | null
          id: string
          limite: number
          limite_disponivel: number
          numero_mascarado: string | null
          status: string
          tipo: string
          user_id: string
          validade: string | null
        }
        Insert: {
          apelido?: string | null
          bandeira?: string | null
          bloqueado?: boolean
          conta_id?: string | null
          criado_em?: string
          cvv?: string | null
          id?: string
          limite?: number
          limite_disponivel?: number
          numero_mascarado?: string | null
          status?: string
          tipo?: string
          user_id: string
          validade?: string | null
        }
        Update: {
          apelido?: string | null
          bandeira?: string | null
          bloqueado?: boolean
          conta_id?: string | null
          criado_em?: string
          cvv?: string | null
          id?: string
          limite?: number
          limite_disponivel?: number
          numero_mascarado?: string | null
          status?: string
          tipo?: string
          user_id?: string
          validade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cartoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      chaves_pix: {
        Row: {
          chave: string
          conta_id: string | null
          criado_em: string
          id: string
          status: string
          tipo: string
          user_id: string
        }
        Insert: {
          chave: string
          conta_id?: string | null
          criado_em?: string
          id?: string
          status?: string
          tipo?: string
          user_id: string
        }
        Update: {
          chave?: string
          conta_id?: string | null
          criado_em?: string
          id?: string
          status?: string
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chaves_pix_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      cheques: {
        Row: {
          conta_id: string | null
          criado_em: string
          data: string
          deposito_ficticio: string | null
          id: string
          numero: string
          situacao: string
          user_id: string
          valor: number
        }
        Insert: {
          conta_id?: string | null
          criado_em?: string
          data?: string
          deposito_ficticio?: string | null
          id?: string
          numero: string
          situacao?: string
          user_id: string
          valor?: number
        }
        Update: {
          conta_id?: string | null
          criado_em?: string
          data?: string
          deposito_ficticio?: string | null
          id?: string
          numero?: string
          situacao?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "cheques_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_cartao: {
        Row: {
          cartao_id: string | null
          categoria: string | null
          criado_em: string
          data: string
          estabelecimento: string | null
          fatura_id: string | null
          id: string
          parcela_atual: number
          parcelas: number
          user_id: string
          valor: number
        }
        Insert: {
          cartao_id?: string | null
          categoria?: string | null
          criado_em?: string
          data?: string
          estabelecimento?: string | null
          fatura_id?: string | null
          id?: string
          parcela_atual?: number
          parcelas?: number
          user_id: string
          valor?: number
        }
        Update: {
          cartao_id?: string | null
          categoria?: string | null
          criado_em?: string
          data?: string
          estabelecimento?: string | null
          fatura_id?: string | null
          id?: string
          parcela_atual?: number
          parcelas?: number
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "compras_cartao_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_cartao_fatura_id_fkey"
            columns: ["fatura_id"]
            isOneToOne: false
            referencedRelation: "faturas"
            referencedColumns: ["id"]
          },
        ]
      }
      consorcios: {
        Row: {
          criado_em: string
          id: string
          parcela_atual: number
          parcelas: number
          status: string
          tipo: string
          user_id: string
          valor_carta: number
          valor_parcela: number
        }
        Insert: {
          criado_em?: string
          id?: string
          parcela_atual?: number
          parcelas?: number
          status?: string
          tipo?: string
          user_id: string
          valor_carta?: number
          valor_parcela?: number
        }
        Update: {
          criado_em?: string
          id?: string
          parcela_atual?: number
          parcelas?: number
          status?: string
          tipo?: string
          user_id?: string
          valor_carta?: number
          valor_parcela?: number
        }
        Relationships: []
      }
      conta_internacional: {
        Row: {
          cambio: number
          criado_em: string
          id: string
          moeda: string
          saldo: number
          status: string
          user_id: string
        }
        Insert: {
          cambio?: number
          criado_em?: string
          id?: string
          moeda?: string
          saldo?: number
          status?: string
          user_id: string
        }
        Update: {
          cambio?: number
          criado_em?: string
          id?: string
          moeda?: string
          saldo?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      contas: {
        Row: {
          agencia: string
          criado_em: string
          id: string
          moeda: string
          numero: string
          saldo: number
          status: string
          tipo: string
          user_id: string
        }
        Insert: {
          agencia?: string
          criado_em?: string
          id?: string
          moeda?: string
          numero: string
          saldo?: number
          status?: string
          tipo?: string
          user_id: string
        }
        Update: {
          agencia?: string
          criado_em?: string
          id?: string
          moeda?: string
          numero?: string
          saldo?: number
          status?: string
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      dispositivos_autorizados: {
        Row: {
          criado_em: string
          dispositivo: string
          id: string
          local: string | null
          modelo: string | null
          status: string
          ultimo_acesso: string | null
          user_id: string
        }
        Insert: {
          criado_em?: string
          dispositivo: string
          id?: string
          local?: string | null
          modelo?: string | null
          status?: string
          ultimo_acesso?: string | null
          user_id: string
        }
        Update: {
          criado_em?: string
          dispositivo?: string
          id?: string
          local?: string | null
          modelo?: string | null
          status?: string
          ultimo_acesso?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emprestimos: {
        Row: {
          conta_id: string | null
          contrato: string | null
          criado_em: string
          id: string
          parcelas: number
          status: string
          taxa_juros: number
          user_id: string
          valor: number
          valor_parcela: number
          valor_total: number
        }
        Insert: {
          conta_id?: string | null
          contrato?: string | null
          criado_em?: string
          id?: string
          parcelas?: number
          status?: string
          taxa_juros?: number
          user_id: string
          valor?: number
          valor_parcela?: number
          valor_total?: number
        }
        Update: {
          conta_id?: string | null
          contrato?: string | null
          criado_em?: string
          id?: string
          parcelas?: number
          status?: string
          taxa_juros?: number
          user_id?: string
          valor?: number
          valor_parcela?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "emprestimos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      faturas: {
        Row: {
          cartao_id: string | null
          criado_em: string
          data_fechamento: string | null
          data_vencimento: string | null
          id: string
          mes_referencia: string
          status: string
          user_id: string
          valor: number
        }
        Insert: {
          cartao_id?: string | null
          criado_em?: string
          data_fechamento?: string | null
          data_vencimento?: string | null
          id?: string
          mes_referencia: string
          status?: string
          user_id: string
          valor?: number
        }
        Update: {
          cartao_id?: string | null
          criado_em?: string
          data_fechamento?: string | null
          data_vencimento?: string | null
          id?: string
          mes_referencia?: string
          status?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "faturas_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes"
            referencedColumns: ["id"]
          },
        ]
      }
      favorecidos: {
        Row: {
          agencia: string | null
          banco: string | null
          chave_pix: string | null
          conta: string | null
          criado_em: string
          id: string
          nome: string
          tipo_chave: string | null
          user_id: string
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          chave_pix?: string | null
          conta?: string | null
          criado_em?: string
          id?: string
          nome: string
          tipo_chave?: string | null
          user_id: string
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          chave_pix?: string | null
          conta?: string | null
          criado_em?: string
          id?: string
          nome?: string
          tipo_chave?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financas: {
        Row: {
          categoria: string | null
          criado_em: string
          data: string
          descricao: string | null
          id: string
          pago: boolean
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          criado_em?: string
          data?: string
          descricao?: string | null
          id?: string
          pago?: boolean
          tipo?: string
          user_id: string
          valor?: number
        }
        Update: {
          categoria?: string | null
          criado_em?: string
          data?: string
          descricao?: string | null
          id?: string
          pago?: boolean
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      historico_acessos: {
        Row: {
          data: string
          dispositivo: string | null
          id: string
          ip: string | null
          local: string | null
          status: string
          user_id: string
        }
        Insert: {
          data?: string
          dispositivo?: string | null
          id?: string
          ip?: string | null
          local?: string | null
          status?: string
          user_id: string
        }
        Update: {
          data?: string
          dispositivo?: string | null
          id?: string
          ip?: string | null
          local?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      investimentos: {
        Row: {
          criado_em: string
          data_aplicacao: string
          id: string
          nome: string | null
          produto: string
          rentabilidade: number
          saldo: number
          status: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          data_aplicacao?: string
          id?: string
          nome?: string | null
          produto: string
          rentabilidade?: number
          saldo?: number
          status?: string
          user_id: string
        }
        Update: {
          criado_em?: string
          data_aplicacao?: string
          id?: string
          nome?: string | null
          produto?: string
          rentabilidade?: number
          saldo?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      metas_financeiras: {
        Row: {
          alerta: string | null
          criado_em: string
          id: string
          prazo: string | null
          titulo: string
          user_id: string
          valor_atual: number
          valor_meta: number
        }
        Insert: {
          alerta?: string | null
          criado_em?: string
          id?: string
          prazo?: string | null
          titulo: string
          user_id: string
          valor_atual?: number
          valor_meta?: number
        }
        Update: {
          alerta?: string | null
          criado_em?: string
          id?: string
          prazo?: string | null
          titulo?: string
          user_id?: string
          valor_atual?: number
          valor_meta?: number
        }
        Relationships: []
      }
      movimentacoes_internacional: {
        Row: {
          cambio: number | null
          conta_internacional_id: string | null
          criado_em: string
          data: string
          descricao: string | null
          id: string
          moeda: string
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          cambio?: number | null
          conta_internacional_id?: string | null
          criado_em?: string
          data?: string
          descricao?: string | null
          id?: string
          moeda?: string
          tipo?: string
          user_id: string
          valor?: number
        }
        Update: {
          cambio?: number | null
          conta_internacional_id?: string | null
          criado_em?: string
          data?: string
          descricao?: string | null
          id?: string
          moeda?: string
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_internacional_conta_internacional_id_fkey"
            columns: ["conta_internacional_id"]
            isOneToOne: false
            referencedRelation: "conta_internacional"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_investimento: {
        Row: {
          criado_em: string
          data: string
          id: string
          investimento_id: string | null
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          criado_em?: string
          data?: string
          id?: string
          investimento_id?: string | null
          tipo?: string
          user_id: string
          valor?: number
        }
        Update: {
          criado_em?: string
          data?: string
          id?: string
          investimento_id?: string | null
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_investimento_investimento_id_fkey"
            columns: ["investimento_id"]
            isOneToOne: false
            referencedRelation: "investimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          criado_em: string
          excluida: boolean
          id: string
          lida: boolean
          mensagem: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          excluida?: boolean
          id?: string
          lida?: boolean
          mensagem?: string | null
          tipo?: string
          titulo: string
          user_id: string
        }
        Update: {
          criado_em?: string
          excluida?: boolean
          id?: string
          lida?: boolean
          mensagem?: string | null
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      open_finance: {
        Row: {
          autorizado_em: string | null
          criado_em: string
          expira_em: string | null
          id: string
          instituicao: string
          status: string
          user_id: string
        }
        Insert: {
          autorizado_em?: string | null
          criado_em?: string
          expira_em?: string | null
          id?: string
          instituicao: string
          status?: string
          user_id: string
        }
        Update: {
          autorizado_em?: string | null
          criado_em?: string
          expira_em?: string | null
          id?: string
          instituicao?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      open_finance_contas: {
        Row: {
          compartilhado: boolean
          criado_em: string
          id: string
          nome: string | null
          numero_mascarado: string | null
          open_finance_id: string | null
          saldo: number
          tipo: string | null
          user_id: string
        }
        Insert: {
          compartilhado?: boolean
          criado_em?: string
          id?: string
          nome?: string | null
          numero_mascarado?: string | null
          open_finance_id?: string | null
          saldo?: number
          tipo?: string | null
          user_id: string
        }
        Update: {
          compartilhado?: boolean
          criado_em?: string
          id?: string
          nome?: string | null
          numero_mascarado?: string | null
          open_finance_id?: string | null
          saldo?: number
          tipo?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "open_finance_contas_open_finance_id_fkey"
            columns: ["open_finance_id"]
            isOneToOne: false
            referencedRelation: "open_finance"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          codigo_barras: string | null
          comprovante: string | null
          conta_id: string | null
          criado_em: string
          data_agendamento: string | null
          debito_automatico: boolean
          descricao: string | null
          id: string
          status: string
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          codigo_barras?: string | null
          comprovante?: string | null
          conta_id?: string | null
          criado_em?: string
          data_agendamento?: string | null
          debito_automatico?: boolean
          descricao?: string | null
          id?: string
          status?: string
          tipo?: string
          user_id: string
          valor?: number
        }
        Update: {
          codigo_barras?: string | null
          comprovante?: string | null
          conta_id?: string | null
          criado_em?: string
          data_agendamento?: string | null
          debito_automatico?: boolean
          descricao?: string | null
          id?: string
          status?: string
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      parcelas_emprestimo: {
        Row: {
          criado_em: string
          emprestimo_id: string
          id: string
          numero: number
          status: string
          user_id: string
          valor: number
          vencimento: string | null
        }
        Insert: {
          criado_em?: string
          emprestimo_id: string
          id?: string
          numero?: number
          status?: string
          user_id: string
          valor?: number
          vencimento?: string | null
        }
        Update: {
          criado_em?: string
          emprestimo_id?: string
          id?: string
          numero?: number
          status?: string
          user_id?: string
          valor?: number
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcelas_emprestimo_emprestimo_id_fkey"
            columns: ["emprestimo_id"]
            isOneToOne: false
            referencedRelation: "emprestimos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_itens: {
        Row: {
          cashback: number
          criado_em: string
          id: string
          nome_produto: string | null
          pedido_id: string
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          user_id: string
        }
        Insert: {
          cashback?: number
          criado_em?: string
          id?: string
          nome_produto?: string | null
          pedido_id: string
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          user_id: string
        }
        Update: {
          cashback?: number
          criado_em?: string
          id?: string
          nome_produto?: string | null
          pedido_id?: string
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cashback: number
          criado_em: string
          id: string
          status: string
          user_id: string
          valor_total: number
        }
        Insert: {
          cashback?: number
          criado_em?: string
          id?: string
          status?: string
          user_id: string
          valor_total?: number
        }
        Update: {
          cashback?: number
          criado_em?: string
          id?: string
          status?: string
          user_id?: string
          valor_total?: number
        }
        Relationships: []
      }
      pix: {
        Row: {
          chave_destino: string | null
          chave_pix_id: string | null
          comprovante: string | null
          conta_id: string | null
          criado_em: string
          data_agendamento: string | null
          descricao: string | null
          id: string
          nome_destino: string | null
          recorrencia: string | null
          status: string
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          chave_destino?: string | null
          chave_pix_id?: string | null
          comprovante?: string | null
          conta_id?: string | null
          criado_em?: string
          data_agendamento?: string | null
          descricao?: string | null
          id?: string
          nome_destino?: string | null
          recorrencia?: string | null
          status?: string
          tipo?: string
          user_id: string
          valor?: number
        }
        Update: {
          chave_destino?: string | null
          chave_pix_id?: string | null
          comprovante?: string | null
          conta_id?: string | null
          criado_em?: string
          data_agendamento?: string | null
          descricao?: string | null
          id?: string
          nome_destino?: string | null
          recorrencia?: string | null
          status?: string
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pix_chave_pix_id_fkey"
            columns: ["chave_pix_id"]
            isOneToOne: false
            referencedRelation: "chaves_pix"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          cashback: number
          categoria: string | null
          criado_em: string
          descricao: string | null
          id: string
          imagem_url: string | null
          nome: string
          preco: number
        }
        Insert: {
          ativo?: boolean
          cashback?: number
          categoria?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          preco?: number
        }
        Update: {
          ativo?: boolean
          cashback?: number
          categoria?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          atualizado_em: string
          cpf: string | null
          criado_em: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          nome: string | null
          preferencias: Json
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string
          cpf?: string | null
          criado_em?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id: string
          nome?: string | null
          preferencias?: Json
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string
          cpf?: string | null
          criado_em?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome?: string | null
          preferencias?: Json
          telefone?: string | null
        }
        Relationships: []
      }
      recargas: {
        Row: {
          conta_id: string | null
          criado_em: string
          data: string
          id: string
          operadora: string
          status: string
          telefone: string | null
          user_id: string
          valor: number
        }
        Insert: {
          conta_id?: string | null
          criado_em?: string
          data?: string
          id?: string
          operadora: string
          status?: string
          telefone?: string | null
          user_id: string
          valor?: number
        }
        Update: {
          conta_id?: string | null
          criado_em?: string
          data?: string
          id?: string
          operadora?: string
          status?: string
          telefone?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "recargas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      saques: {
        Row: {
          conta_id: string | null
          criado_em: string
          data: string
          id: string
          local: string | null
          status: string
          user_id: string
          valor: number
        }
        Insert: {
          conta_id?: string | null
          criado_em?: string
          data?: string
          id?: string
          local?: string | null
          status?: string
          user_id: string
          valor?: number
        }
        Update: {
          conta_id?: string | null
          criado_em?: string
          data?: string
          id?: string
          local?: string | null
          status?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "saques_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      seguros: {
        Row: {
          apolice: string | null
          cotacao: number
          criado_em: string
          detalhes: string | null
          id: string
          seguradora: string | null
          status: string
          tipo: string
          user_id: string
          vigencia_fim: string | null
          vigencia_inicio: string | null
        }
        Insert: {
          apolice?: string | null
          cotacao?: number
          criado_em?: string
          detalhes?: string | null
          id?: string
          seguradora?: string | null
          status?: string
          tipo: string
          user_id: string
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Update: {
          apolice?: string | null
          cotacao?: number
          criado_em?: string
          detalhes?: string | null
          id?: string
          seguradora?: string | null
          status?: string
          tipo?: string
          user_id?: string
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          categoria: string
          comprovante: string | null
          conta_id: string | null
          criado_em: string
          data: string
          descricao: string | null
          id: string
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          comprovante?: string | null
          conta_id?: string | null
          criado_em?: string
          data?: string
          descricao?: string | null
          id?: string
          tipo: string
          user_id: string
          valor?: number
        }
        Update: {
          categoria?: string
          comprovante?: string | null
          conta_id?: string | null
          criado_em?: string
          data?: string
          descricao?: string | null
          id?: string
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      transferencias: {
        Row: {
          agencia_destino: string | null
          banco_destino: string | null
          comprovante: string | null
          conta_destino: string | null
          conta_id: string | null
          criado_em: string
          data_agendamento: string | null
          descricao: string | null
          destino: string
          favorecido_id: string | null
          id: string
          nome_destino: string | null
          status: string
          user_id: string
          valor: number
        }
        Insert: {
          agencia_destino?: string | null
          banco_destino?: string | null
          comprovante?: string | null
          conta_destino?: string | null
          conta_id?: string | null
          criado_em?: string
          data_agendamento?: string | null
          descricao?: string | null
          destino?: string
          favorecido_id?: string | null
          id?: string
          nome_destino?: string | null
          status?: string
          user_id: string
          valor?: number
        }
        Update: {
          agencia_destino?: string | null
          banco_destino?: string | null
          comprovante?: string | null
          conta_destino?: string | null
          conta_id?: string | null
          criado_em?: string
          data_agendamento?: string | null
          descricao?: string | null
          destino?: string
          favorecido_id?: string | null
          id?: string
          nome_destino?: string | null
          status?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_favorecido_id_fkey"
            columns: ["favorecido_id"]
            isOneToOne: false
            referencedRelation: "favorecidos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
