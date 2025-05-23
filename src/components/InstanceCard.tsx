// InstanceCard.tsx
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
  onEdit: () => void;
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
            <p className="text-xs text-muted-foreground">API Key</p>
            <p className="font-mono text-sm">•••••{cliente.api_key.slice(-6)}</p>
          </div>
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

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit2 size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetKey}>
            <RotateCcw size={16} />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstanceCard;
