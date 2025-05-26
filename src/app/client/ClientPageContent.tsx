"use client";

import React, { useEffect, useState } from "react";
import Charts from "@/components/Charts";
import { Metrics } from "../lib/types";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_PAGE = 6;

type ClientPageContentProps = {
  userId: string;
};

export default function ClientPageContent({ userId }: ClientPageContentProps) {
  const [metrics, setMetrics] = useState<Metrics>({
    total_jobs: 0,
    success: 0,
    failures: 0,
    by_file_type: {},
    by_error_type: {},
    avg_processing_time_seconds: 0,
    total_jobs_prev_month: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    const res = await fetch(`${API_BASE}/clientes/${userId}/metrics`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await res.json();
    setMetrics(data);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Dashboard */}
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📊 Dashboard
        </h2>
        <Charts metrics={metrics} />
      </div>

      </div>
  );
}
