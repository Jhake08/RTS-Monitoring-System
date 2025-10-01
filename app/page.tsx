"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { PerformanceReport } from "@/components/performance-report"
import { AnalyticalReport } from "@/components/analytical-report"
import { FinancialReport } from "@/components/financial-report"
import { UploadModal } from "@/components/upload-modal"
import type { ProcessedData } from "@/lib/types"

export default function Home() {
  const [data, setData] = useState<ProcessedData | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [currentView, setCurrentView] = useState<string>("dashboard")

  // New filter state for status filter
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [appliedFilterStatus, setAppliedFilterStatus] = useState<string>("all")

  const handleApplyFilter = () => {
    setAppliedFilterStatus(filterStatus)
  }

  const handleClearFilter = () => {
    setFilterStatus("all")
    setAppliedFilterStatus("all")
  }

  const renderView = () => {
    switch (currentView) {
      case "performance":
        return <PerformanceReport data={data} statusFilter={appliedFilterStatus} />
      case "analytical":
        return <AnalyticalReport data={data} statusFilter={appliedFilterStatus} />
      case "financial":
        return <FinancialReport data={data} statusFilter={appliedFilterStatus} />
      default:
        return (
          <DashboardContent
            data={data}
            onDataChange={setData}
            onUploadClick={() => setIsUploadModalOpen(true)}
            statusFilter={appliedFilterStatus}
          />
        )
    }
  }

  return (
    <>
      <DashboardLayout
        onUploadClick={() => setIsUploadModalOpen(true)}
        hasData={!!data}
        currentView={currentView}
        onViewChange={setCurrentView}
      >
        <div className="flex justify-between items-center mb-4 w-full">
          <div>
            <h2 className="text-4xl font-bold text-foreground tracking-tight uppercase">RTS Monitoring Dashboard</h2>
            <p className="text-muted-foreground text-lg">
              Enterprise-grade parcel tracking and analytics across Philippine regions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm font-semibold text-foreground">
              Filter:
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 rounded border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All</option>
              {data &&
                Object.keys(data.all.stats).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </select>
            <button onClick={handleApplyFilter} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 rounded">
              Apply
            </button>
            <button onClick={handleClearFilter} className="bg-black hover:bg-gray-800 text-white px-4 py-1 rounded">
              Clear
            </button>
          </div>
        </div>

        {renderView()}
      </DashboardLayout>

      <UploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} onDataUpload={setData} />
    </>
  )
}
