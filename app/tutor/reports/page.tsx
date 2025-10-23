"use client"
import React from 'react'
import ReportCard from '../../../components/tutor/ReportCard'

export default function TutorReports() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      <div className="space-y-3">
        <ReportCard title="Reporte mensual" date="2025-10-01" />
        <ReportCard title="Reporte semestral" date="2025-06-30" />
      </div>
    </div>
  )
}
