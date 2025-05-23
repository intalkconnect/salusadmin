"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Metrics } from "../app/lib/types";

type Props = {
  metrics: Metrics;
};

const COLORS = [
  "#4f46e5", // indigo
  "#059669", // emerald
  "#d97706", // amber
  "#dc2626", // red
  "#0d9488", // teal
  "#7c3aed", // violet
  "#be123c", // rose
  "#2563eb", // blue
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Gráfico por tipo de arquivo */}
      <Card className="bg-card p-4 shadow-md hover:shadow-lg rounded-2xl transition">
        <h3 className="text-lg font-semibold mb-3">Por Tipo de Arquivo</h3>
        {fileData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={fileData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
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
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-600">Nenhum dado encontrado</p>
        )}
      </Card>

      {/* Lista de erros mais compacta */}
      <Card className="bg-card p-4 shadow-md hover:shadow-lg rounded-2xl transition">
        <h3 className="text-lg font-semibold mb-3">Por Tipo de Erro</h3>
        {errorData.length > 0 ? (
          <div className="space-y-1">
            <div className="flex justify-between font-semibold border-b pb-1">
              <span>Erro</span>
              <span>Qtd</span>
            </div>
            {errorData.map((err) => (
              <div
                key={err.name}
                className="flex justify-between text-sm text-slate-700"
              >
                <span>{err.name}</span>
                <span className="font-medium">{err.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">Nenhum erro encontrado</p>
        )}
      </Card>
    </div>
  );
};

export default Charts;
