
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Cliente } from "@/app/lib/types";
import { RefreshCw } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: Cliente;
  refresh: () => void;
};

const InstanceFormDialog = ({ open, setOpen, data, refresh }: Props) => {
  const [nome, setNome] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (data) {
      setNome(data.nome);
      setApiKey(data.api_key);
    } else {
      setNome("");
      setApiKey(crypto.randomUUID());
    }
  }, [data, open]);

  const handleSubmit = async () => {
    if (!nome) {
      toast.error("Nome é obrigatório");
      return;
    }

    const method = data ? "PATCH" : "POST";
    const url = data
      ? `${API_BASE}/clientes/${data.id}`
      : `${API_BASE}/clientes`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ nome, api_key: apiKey }),
    });

    toast.success(data ? "Instância atualizada" : "Instância criada");
    setOpen(false);
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Editar Instância" : "Nova Instância"}
          </DialogTitle>
          <DialogDescription>
            {data
              ? "Atualize os dados da instância"
              : "Preencha os campos para criar uma nova instância"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Nome</label>
            <Input
              className="col-span-3"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">API Key</label>
            <div className="flex col-span-3 gap-2">
              <Input
                className="w-full"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => setApiKey(crypto.randomUUID())}
                title="Gerar nova API Key"
              >
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} variant="default">
            {data ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstanceFormDialog;
