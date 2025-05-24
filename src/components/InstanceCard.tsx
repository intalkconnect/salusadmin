"use client";

import React, { useState } from "react";
import { Cliente } from "../app/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Copy, RotateCcw, Edit2, Trash2, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  cliente: Cliente;
  refresh: () => void;
  onEdit: () => void;
};

const InstanceCard = ({ cliente, refresh, onEdit }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 🚀 ✅ Função faz requisição PARA O ID DA INSTÂNCIA!
  const handleFetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/clientes/${cliente.id}/metrics`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics({
          ...data,
          avg_processing_time_seconds: data.avg_processing_time_seconds ?? 0,
        });
        setShowModal(true);
      } else {
        toast.error("Erro ao buscar métricas.");
      }
    } catch (error) {
      toast.error("Erro na requisição.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetKey = async () => {
    if (!confirm("Regenerar API Key?")) return;
    const newKey = crypto.randomUUID();
    await fetch(`${API_BASE}/clientes/${cliente.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ api_key: newKey }),
    });
    toast.success(`Nova API Key: ${newKey}`);
    refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Deseja excluir essa instância?")) return;
    await fetch(`${API_BASE}/clientes/${cliente.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    refresh();
  };

  const handleToggleStatus = async (checked: boolean) => {
    await fetch(`${API_BASE}/clientes/${cliente.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ ativo: checked }),
    });
    refresh();
  };

  return (
    <>
      <Card className="bg-card text-card-foreground border border-border rounded-xl shadow-md">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{cliente.nome}</h3>
            <Switch
              checked={cliente.ativo}
              onCheckedChange={handleToggleStatus}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">{cliente.id}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Edit2 size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleResetKey}>
              <RotateCcw size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleFetchMetrics}>
              <BarChart2 size={16} />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <Trash2 size={16} />
            </Button>
            <Button
  variant="ghost"
 size="icon"
  onClick={() => {
    navigator.clipboard.writeText(cliente.api_key);
    toast.success("API Key copiada!");
  }}

>
  <Copy size={16} />
</Button>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-[400px] shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">
              Métricas - {cliente.nome}
            </h2>

            {loading ? (
              <p>Carregando...</p>
            ) : metrics ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Jobs (Current Month):</strong> {metrics.total_jobs}</p>
                <p><strong>Success:</strong> {metrics.success}</p>
                <p><strong>Failures:</strong> {metrics.failures}</p>
                <p><strong>Jobs (Previous Month):</strong> {metrics.total_jobs_prev_month}</p>
                <p>
                  <strong>Avg Time:</strong>{" "}
                  {(metrics.avg_processing_time_seconds ?? 0).toFixed(2)}s
                </p>
              </div>
            ) : (
              <p>Erro ao carregar métricas.</p>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstanceCard;
