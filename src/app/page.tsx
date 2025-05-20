"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Copy, RefreshCw, Plus, Trash2, Edit2, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import toast from "react-hot-toast";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const ITEMS_PER_PAGE = 6;

type Metrics = {
  total_jobs: number;
  sucessos: number;
  falhas: number;
  por_tipo_arquivo: Record<string, number>;
  por_tipo_erro: Record<string, number>;
};

type Cliente = {
  id: string;
  nome: string;
  api_key: string;
  openai_key: string;
  uso: number;
  uso_atual: number;
  uso_anterior: number;
  ativo: boolean;
};

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#8b5cf6",
  "#f43f5e",
  "#3b82f6",
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [Data, setData] = useState<Partial<Cliente>>({});

  const [metrics, setMetrics] = useState<Metrics>({
    total_jobs: 0,
    sucessos: 0,
    falhas: 0,
    por_tipo_arquivo: {},
    por_tipo_erro: {},
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(clientes.length / ITEMS_PER_PAGE);

  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    fetchClients();
    fetchMetrics();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/clientes`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      setClientes(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE}/clientes/metrics`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      setMetrics(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir?")) return;
    await fetch(`${API_BASE}/clientes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    fetchClients();
    fetchMetrics();
  };

  const handleResetKey = async (id: string) => {
    if (!confirm("Regenerar API Key?")) return;
    const newKey = crypto.randomUUID();
    try {
      // Atualiza no banco via PATCH
      await fetch(`${API_BASE}/clientes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ api_key: newKey }),
      });
      toast.success(`Nova API Key: ${newKey}`);
      fetchClients();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao regenerar API Key");
    }
  };

  const handleOpen = (c?: Cliente) => {
    if (c) {
      setData(c);
      setNome(c.nome);
      setOpenaiKey(c.openai_key);
      setApiKey(c.api_key);
    } else {
      setData({});
      setNome("");
      setOpenaiKey("");
      setApiKey("");
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    const method = Data.id ? "PATCH" : "POST";
    const url = Data.id
      ? `${API_BASE}/clientes/${Data.id}`
      : `${API_BASE}/clientes`;
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ nome, openai_key: openaiKey, api_key: apiKey }),
    });
    setOpen(false);
    fetchClients();
    fetchMetrics();
  };

  // Filtering
  const filtered = clientes.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.ativo) ||
      (statusFilter === "inactive" && !c.ativo);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const maskedKey = (k?: string) => (k ? `******${k.slice(-6)}` : "");
  const fileData = Object.entries(metrics.por_tipo_arquivo).map(([n, v]) => ({
    name: n,
    value: v,
  }));
  const errorData = Object.entries(metrics.por_tipo_erro).map(([n, v]) => ({
    name: n,
    value: v,
  }));

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-slate-800">Instâncias</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="bg-slate-100 placeholder-slate-400"
          />

          <Select onValueChange={(v: string) => setStatusFilter(v)}>
            <SelectTrigger className="w-36 bg-slate-100">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              fetchClients();
              fetchMetrics();
            }}
          >
            <RefreshCw size={18} />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-1" /> Instância+
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {Data.id ? "Editar Instância" : "Nova Instância"}
                </DialogTitle>
                <DialogDescription>
                  {Data.id
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNome(e.target.value)
                    }
                  />
                  <Input
                    type="password"
                    className="col-span-3"
                    value={openaiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOpenaiKey(e.target.value)
                    }
                  />
                  <Input
                    className="col-span-3"
                    value={apiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setApiKey(e.target.value)
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} variant="default">
                  {Data.id ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics cards */}
     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
  <Card className="bg-indigo-100">
    <CardContent>
      <h3 className="text-lg font-semibold text-indigo-800">Total Jobs</h3>
      <p className="text-3xl font-bold text-indigo-900">{metrics.total_jobs}</p>
    </CardContent>
  </Card>

  <Card className="bg-green-100">
    <CardContent>
      <h3 className="text-lg font-semibold text-green-800">Sucessos</h3>
      <p className="text-3xl font-bold text-green-900">{metrics.sucessos}</p>
    </CardContent>
  </Card>

  <Card className="bg-rose-100">
    <CardContent>
      <h3 className="text-lg font-semibold text-rose-800">Falhas</h3>
      <p className="text-3xl font-bold text-rose-900">{metrics.falhas}</p>
    </CardContent>
  </Card>

  <Card className="bg-sky-100">
    <CardContent>
      <h3 className="text-lg font-semibold text-sky-800">Instâncias</h3>
      <p className="text-3xl font-bold text-sky-900">{clientes.length}</p>
    </CardContent>
  </Card>
</div>


      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* PieChart por tipo de arquivo */}
        <Card className="bg-slate-100 p-4">
          <h3 className="text-lg font-semibold mb-2">Por Tipo de Arquivo</h3>
          {fileData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={fileData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {fileData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-600">Nenhum registro</p>
          )}
        </Card>

        {/* BarChart por tipo de erro */}
        <Card className="bg-slate-100 p-4">
          <h3 className="text-lg font-semibold mb-2">Por Tipo de Erro</h3>
          {errorData.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {errorData.map((err, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-slate-200"
                >
                  <span className="text-sm text-slate-700">{err.name}</span>
                  <span className="text-sm font-semibold text-rose-600">
                    {err.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">Nenhum erro</p>
          )}
        </Card>
      </div>

      {/* Instance Cards */}
      <div className="space-y-4">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          paged.map((c) => (
            <Card
              key={c.id}
              className="bg-white border border-slate-200 shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <label className="block text-xs text-slate-500">ID</label>
                    <span className="font-mono text-sm text-slate-700 truncate">
                      {c.id}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Copiar API Key"
                      onClick={() => {
                        navigator.clipboard.writeText(c.api_key);
                        toast.success("Copiado para a área de transferência");
                      }}
                    >
                      <Copy size={16} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Resetar API Key"
                      onClick={() => {
                        const newKey = crypto.randomUUID();
                        fetch(`${API_BASE}/clientes/${c.id}`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${API_KEY}`,
                          },
                          body: JSON.stringify({ api_key: newKey }),
                        }).then(() => {
                          toast.success(`Nova API Key: ${newKey}`);
                          fetchClients();
                        });
                      }}
                    >
                      <RotateCcw size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Editar"
                      onClick={() => handleOpen(c)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Excluir"
                      onClick={() => {
                        if (confirm("Deseja excluir?")) {
                          fetch(`${API_BASE}/clientes/${c.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${API_KEY}` },
                          }).then(() => {
                            fetchClients();
                            fetchMetrics();
                          });
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 mb-2 text-sm text-slate-700">
                  <div>
                    <label className="block text-xs text-slate-500">
                      Cliente
                    </label>
                    <p className="text-base font-medium text-slate-900 truncate">
                      {c.nome}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">
                      OpenAI Key
                    </label>
                    <p className="truncate">{maskedKey(c.openai_key)}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">
                      Uso 30d
                    </label>
                    <p className="font-semibold">
                      ${(c.uso * 0.01).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">
                      Atual
                    </label>
                    <p className="font-semibold">
                      ${(c.uso_atual * 0.01).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">
                      Anterior
                    </label>
                    <p className="font-semibold">
                      ${(c.uso_anterior * 0.01).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Switch
                    checked={c.ativo}
                    onCheckedChange={async (checked: boolean) => {
                      await fetch(`${API_BASE}/clientes/${c.id}`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${API_KEY}`,
                        },
                        body: JSON.stringify({ ativo: checked }),
                      });
                      // recarregar lista e métricas após alteração
                      await fetchClients();
                      await fetchMetrics();
                    }}
                    className="bg-gray-200 data-[state=checked]:bg-green-500"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination fixed footer */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
