"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import MetricsCards from "../components/MetricsCards";
import Charts from "../components/Charts";
import InstanceCard from "../components/InstanceCard";
import InstanceFormDialog from "../components/InstanceFormDialog";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_PAGE = 6;

import { Cliente, Metrics } from "./lib/types";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    total_jobs: 0,
    sucessos: 0,
    falhas: 0,
    por_tipo_arquivo: {},
    por_tipo_erro: {},
    tempo_medio_processamento_segundos: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(clientes.length / ITEMS_PER_PAGE);

  const [open, setOpen] = useState(false);
const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>(undefined);
  useEffect(() => {
    fetchClients();
    fetchMetrics();
  }, []);


const handleOpen = (cliente?: Cliente) => {
  setSelectedCliente(cliente);
  setOpen(true);
};


  const fetchClients = async () => {
    const res = await fetch(`${API_BASE}/clientes`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await res.json();
    setClientes(data);
  };

  const fetchMetrics = async () => {
    const res = await fetch(`${API_BASE}/clientes/metrics`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await res.json();
    setMetrics(data);
  };

  const filtered = clientes.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.ativo) ||
      (statusFilter === "inactive" && !c.ativo);
    return matchesSearch && matchesStatus;
  });

  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Instâncias</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select onValueChange={(v: string) => setStatusFilter(v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => {
            fetchClients();
            fetchMetrics();
          }}>
            <RefreshCw size={18} />
          </Button>
          <InstanceFormDialog
  open={open}
  setOpen={setOpen}
  refresh={() => {
    fetchClients();
    fetchMetrics();
  }}
  data={selectedCliente}
/>

<Button onClick={() => handleOpen()}>
  <Plus size={18} className="mr-1" /> Instância+
</Button>
        </div>
      </div>

      <MetricsCards metrics={metrics} totalClientes={clientes.length} />

      <Charts metrics={metrics} />

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {paged.map((c) => (
    <InstanceCard
      key={c.id}
      cliente={c}
      refresh={() => {
        fetchClients();
        fetchMetrics();
      }}
      onEdit={() => handleOpen(c)}
    />
  ))}
</div>



      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
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
