export type Cliente = {
  id: string;
  nome: string;
  api_key: string;
  uso: number;
  uso_atual: number;
  uso_anterior: number;
  ativo: boolean;
};

export type Metrics = {
  total_jobs: number;
  sucessos: number;
  falhas: number;
  por_tipo_arquivo: Record<string, number>;
  por_tipo_erro: Record<string, number>;
  tempo_medio_processamento_segundos: number;
};
