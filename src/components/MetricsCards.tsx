import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle, XCircle, Server, Clock } from "lucide-react";
import { Metrics } from "../app/lib/types";

type Props = {
  metrics: Metrics;
  totalClientes: number;
};

const MetricsCards = ({ metrics, totalClientes }: Props) => {
  const cards = [
    {
      title: "Total Jobs",
      value: metrics.total_jobs,
      color: "bg-indigo-100",
      textColor: "text-indigo-800",
      icon: <Briefcase size={22} className="text-indigo-600" />,
    },
    {
      title: "Sucessos",
      value: metrics.success,
      color: "bg-green-100",
      textColor: "text-green-800",
      icon: <CheckCircle size={22} className="text-green-600" />,
    },
    {
      title: "Falhas",
      value: metrics.failures,
      color: "bg-rose-100",
      textColor: "text-rose-800",
      icon: <XCircle size={22} className="text-rose-600" />,
    },
    {
      title: "Instâncias",
      value: totalClientes,
      color: "bg-sky-100",
      textColor: "text-sky-800",
      icon: <Server size={22} className="text-sky-600" />,
    },
    {
      title: "Tempo Médio (s)",
      value: metrics.avg_processing_time_seconds.toFixed(2),
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: <Clock size={22} className="text-yellow-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`${card.color} shadow-md hover:shadow-lg transition rounded-2xl`}
        >
          <CardContent className="flex items-center gap-2 p-3">
            {card.icon}
            <div>
              <h3 className={`text-base md:text-lg font-semibold ${card.textColor}`}>
                {card.title}
              </h3>
              <p className={`text-2xl md:text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
