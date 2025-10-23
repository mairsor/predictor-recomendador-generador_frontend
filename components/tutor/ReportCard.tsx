"use client"
import React from 'react'

export default function ReportCard({ title = 'Reporte mensual', date = '2025-10-01' }: { title?: string; date?: string }) {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 flex items-center justify-between">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-500">Generado: {date}</p>
      </div>
      <div>
        <button className="btn-primary">Descargar</button>
      </div>
    </div>
  )
}
