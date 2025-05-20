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
import { Copy, Eye, RefreshCw, Plus } from "lucide-react";

// Defina sua chave de API no .env: REACT_APP_API_KEY=teste
const API_KEY = process.env.REACT_APP_API_KEY || "teste";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8001";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/clientes`, {
        headers: {
          "X-API-Key": API_KEY || "",
          accept: "application/json",
        },
      });
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = clientes.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.ativo) ||
      (statusFilter === "inactive" && !c.ativo);
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Instâncias</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 placeholder-gray-400"
          />
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-36 bg-gray-800">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchClients}>
            <RefreshCw size={18} />
          </Button>
          <Button>
            <Plus size={18} className="mr-1" /> Instância+
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          filtered.map((c) => (
            <Card key={c.id} className="bg-gray-800">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono truncate">{c.id}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(c.api_key)}
                    >
                      <Copy size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
                <h2 className="text-lg font-medium">{c.nome}</h2>
                <p className="text-sm text-gray-400">
                  Uso (30d): {c.uso} — Mês atual: {c.uso_atual} — Anterior:{" "}
                  {c.uso_anterior}
                </p>
                <Button
                  size="sm"
                  variant={c.ativo ? "destructive" : "secondary"}
                  onClick={async () => {
                    await fetch(`${API_BASE}/api/clientes/${c.id}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY || "",
                        accept: "application/json",
                      },
                      body: JSON.stringify({ ativo: !c.ativo }),
                    });
                    fetchClients();
                  }}
                >
                  {c.ativo ? "Desativar" : "Ativar"}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
