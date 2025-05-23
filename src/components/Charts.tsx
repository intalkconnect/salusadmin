
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Metrics } from "@/app/lib/types";

type Props = {
  metrics: Metrics;
};

const COLORS = [
  "#4f46e5", // indigo-600
  "#059669", // emerald-600
  "#d97706", // amber-600
  "#dc2626", // red-600
  "#0d9488", // teal-600
  "#7c3aed", // violet-600
  "#be123c", // rose-700
  "#2563eb", // blue-600
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
      {/* PieChart por tipo de arquivo */}
      <Card className="bg-white p-4 shadow-md hover:shadow-lg rounded-2xl transition">
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
          <p className="text-sm text-slate-600">Nenhum registro encontrado</p>
        )}
      </Card>

      {/* Lista de erros */}
      <Card className="bg-white p-4 shadow-md hover:shadow-lg rounded-2xl transition">
        <h3 className="text-lg font-semibold mb-2">Por Tipo de Erro</h3>
        {errorData.length > 0 ? (
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {errorData.map((err, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200"
              >
                <span className="text-sm text-slate-700">{err.name}</span>
                <span className="text-sm font-semibold text-rose-600">
                  {err.value}
                </span>
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
