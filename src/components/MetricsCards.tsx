"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle, XCircle, Server, Clock, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Cliente = {
  id: string;
  nome: string;
  api_key: string;
  ativo: boolean;
};

type Metrics = {
  total_jobs: number;
  success: number;
  failures: number;
  by_file_type: Record<string, number>;
  by_error_type: Record<string, number>;
  avg_processing_time_seconds: number;
  total_jobs_prev_month: number;
};

const MetricsCards = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [metricsGlobal, setMetricsGlobal] = useState<Metrics | null>(null);

  const [metricsInstance, setMetricsInstance] = useState<Metrics | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentClientName, setCurrentClientName] = useState<string>("");
  const [loadingInstance, setLoadingInstance] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resClientes, resMetrics] = await Promise.all([
          fetch(`${API_BASE}/clientes`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          }),
          fetch(`${API_BASE}/metrics`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          }),
        ]);

        const clientes = await resClientes.json();
        setClientes(clientes);

        const dataMetrics = await resMetrics.json();
        setMetricsGlobal({
          ...dataMetrics,
          avg_processing_time_seconds: dataMetrics.avg_processing_time_seconds ?? 0,
        });
      } catch (error) {
        toast.error("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenMetrics = async (id: string, name: string) => {
    setShowModal(true);
    setCurrentClientName(name);
    setLoadingInstance(true);
    setMetricsInstance(null);

    try {
      const res = await fetch(`${API_BASE}/clientes/${id}/metrics`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      const data = await res.json();
      setMetricsInstance({
        ...data,
        avg_processing_time_seconds: data.avg_processing_time_seconds ?? 0,
      });
    } catch (error) {
      toast.error("Erro ao buscar métricas da instância.");
    } finally {
      setLoadingInstance(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMetricsInstance(null);
  };

  if (loading) return <p>Carregando...</p>;
  if (!metricsGlobal) return <p>Erro ao carregar métricas globais.</p>;

  const cards = [
    {
      title: "Total Jobs",
      value: metricsGlobal.total_jobs,
      color: "bg-indigo-100",
      textColor: "text-indigo-800",
      icon: <Briefcase size={22} className="text-indigo-600" />,
    },
    {
      title: "Sucessos",
      value: metricsGlobal.success,
      color: "bg-green-100",
      textColor: "text-green-800",
      icon: <CheckCircle size={22} className="text-green-600" />,
    },
    {
      title: "Falhas",
      value: metricsGlobal.failures,
      color: "bg-rose-100",
      textColor: "text-rose-800",
      icon: <XCircle size={22} className="text-rose-600" />,
    },
    {
      title: "Instâncias",
      value: clientes.length,
      color: "bg-sky-100",
      textColor: "text-sky-800",
      icon: <Server size={22} className="text-sky-600" />,
    },
    {
      title: "Tempo Médio (s)",
      value: (metricsGlobal.avg_processing_time_seconds ?? 0).toFixed(2),
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: <Clock size={22} className="text-yellow-600" />,
    },
  ];

  return (
    <>
      {/* Cards Globais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={`${card.color} shadow-md hover:shadow-lg transition rounded-2xl`}
          >
            <CardContent className="flex items-center gap-2 p-3">
              {card.icon}
              <div>
                <h3 className={`text-base md:text-lg font-semibold ${card.textColor}`}>
                  {card.title}
                </h3>
                <p className={`text-2xl md:text-3xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cards de Instâncias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.map((cliente) => (
          <Card
            key={cliente.id}
            className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenMetrics(cliente.id, cliente.nome)}
                >
                  <BarChart2 size={18} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                API Key: •••••{cliente.api_key.slice(-6)}
              </p>
              <p
                className={`text-xs ${
                  cliente.ativo ? "text-green-600" : "text-rose-600"
                }`}
              >
                {cliente.ativo ? "Ativo" : "Inativo"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Métricas da Instância */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-[400px] shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">
              Métricas - {currentClientName}
            </h2>

            {loadingInstance ? (
              <p>Carregando métricas...</p>
            ) : metricsInstance ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong>Jobs (Current Month):</strong>{" "}
                  {metricsInstance.total_jobs}
                </p>
                <p>
                  <strong>Success:</strong> {metricsInstance.success}
                </p>
                <p>
                  <strong>Failures:</strong> {metricsInstance.failures}
                </p>
                <p>
                  <strong>Jobs (Previous Month):</strong>{" "}
                  {metricsInstance.total_jobs_prev_month}
                </p>
                <p>
                  <strong>Avg Time:</strong>{" "}
                  {(metricsInstance.avg_processing_time_seconds ?? 0).toFixed(2)}s
                </p>
              </div>
            ) : (
              <p>Erro ao carregar métricas.</p>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleCloseModal}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MetricsCards;
