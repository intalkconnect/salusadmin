"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Metrics } from "../app/lib/types";

type Props = {
  metrics: Metrics;
};

const COLORS = [
  "#4f46e5", "#059669", "#d97706", "#dc2626", "#0d9488", "#7c3aed", "#be123c", "#2563eb",
];

const Charts = ({ metrics }: Props) => {
  const fileData = Object.entries(metrics.por_tipo_arquivo).map(([name, value]) => ({
    name,
    value,
  }));

  const errorData = Object.entries(metrics.por_tipo_erro).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Gráfico por tipo de arquivo */}
      <Card className="bg-card p-3 shadow-md rounded-xl transition max-w-sm w-full">
        <h3 className="text-md font-semibold mb-2">Por Tipo de Arquivo</h3>
        {fileData.length > 0 ? (
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={fileData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={45} // reduzido
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {fileData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-500">Nenhum dado encontrado</p>
        )}
      </Card>

      {/* Lista de erros compacta */}
      <Card className="bg-card p-3 shadow-md rounded-xl transition max-w-sm w-full">
        <h3 className="text-md font-semibold mb-2">Por Tipo de Erro</h3>
        {errorData.length > 0 ? (
          <div className="space-y-1">
            <div className="flex justify-between font-semibold border-b pb-1 text-sm">
              <span>Erro</span>
              <span>Qtd</span>
            </div>
            {errorData.map((err) => (
              <div
                key={err.name}
                className="flex justify-between text-xs text-slate-700"
              >
                <span>{err.name}</span>
                <span className="font-medium">{err.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Nenhum erro encontrado</p>
        )}
      </Card>
    </div>
  );
};

export default Charts;
