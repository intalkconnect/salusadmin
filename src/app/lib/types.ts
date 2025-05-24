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
  success: number;
  failures: number;
  by_file_type: Record<string, number>;
  by_error_type: Record<string, number>;
  avg_processing_time_seconds: number;
};
