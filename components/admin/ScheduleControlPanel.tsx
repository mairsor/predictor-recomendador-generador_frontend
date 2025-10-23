"use client"
import React from 'react'

export default function ScheduleControlPanel() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Control de horario</h3>
      <p className="text-sm text-gray-500 mb-4">Publica el horario final para que esté visible a estudiantes y docentes.</p>
      <button className="btn-primary">Publicar horario final</button>
    </div>
  )
}
