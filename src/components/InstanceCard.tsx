"use client";

import React from "react";
import { Cliente } from "../app/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Copy, RotateCcw, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  cliente: Cliente;
  refresh: () => void;
  onEdit: () => void; // ✅ Adiciona prop para abrir modal de edição
};

const InstanceCard = ({ cliente, refresh, onEdit }: Props) => {
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
    <Card className="bg-white border border-slate-200 shadow-md hover:shadow-lg transition rounded-2xl">
  <CardContent className="p-4 space-y-4">

    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{cliente.nome}</h2>
        <p className="text-xs text-slate-500">
          ID: <span className="font-mono">{cliente.id}</span>
        </p>
        <p className="text-xs text-slate-500">
          API Key: <span className="font-mono">••••••{cliente.api_key.slice(-6)}</span>
        </p>
      </div>

      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" title="Copiar API Key"
          onClick={() => {
            navigator.clipboard.writeText(cliente.api_key);
            toast.success("API Key copiada!");
          }}>
          <Copy size={16} />
        </Button>
        <Button variant="ghost" size="icon" title="Resetar API Key" onClick={handleResetKey}>
          <RotateCcw size={16} />
        </Button>
        <Button variant="ghost" size="icon" title="Editar" onClick={onEdit}>
          <Edit2 size={16} />
        </Button>
        <Button variant="ghost" size="icon" title="Excluir" onClick={handleDelete}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>

    {/* Financials */}
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-xs text-slate-500">Uso 30d</p>
        <p className="text-base font-bold">${(cliente.uso * 0.01).toFixed(2)}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Atual</p>
        <p className="text-base font-bold">${(cliente.uso_atual * 0.01).toFixed(2)}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Anterior</p>
        <p className="text-base font-bold">${(cliente.uso_anterior * 0.01).toFixed(2)}</p>
      </div>
    </div>

    {/* Status */}
    <div className="flex justify-end">
      <Switch
        checked={cliente.ativo}
        onCheckedChange={handleToggleStatus}
        className="bg-gray-200 data-[state=checked]:bg-green-500"
      />
    </div>

  </CardContent>
</Card>

  );
};

export default InstanceCard;
