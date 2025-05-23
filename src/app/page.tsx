<div className="max-w-7xl mx-auto p-6 flex flex-col gap-8 h-screen">
  {/* Header + filtros */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    <h1 className="text-3xl font-bold">Salus Admin</h1>
    <div className="flex flex-col md:flex-row gap-2">
      {/* ... Filtros e botões ... */}
    </div>
  </div>

  {/* Dashboard fixo */}
  <div className="flex flex-col gap-4">
    <h2 className="text-2xl font-semibold flex items-center gap-2">
      📊 Dashboard
    </h2>
    <MetricsCards metrics={metrics} totalClientes={clientes.length} />
    <Charts metrics={metrics} />
  </div>
    <h2 className="text-2xl font-semibold flex items-center gap-2">
      🗂️ Instâncias
    </h2>
  {/* Instâncias scrolláveis */}
  <div className="flex flex-col gap-4 flex-1 overflow-hidden">

    <div className=" border rounded-xl p-4 bg-background">
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
    </div>

    {/* Paginação */}
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
      <span>Página {currentPage} de {totalPages}</span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        Próximo
      </Button>
    </div>
  </div>
</div>
