"use client"
import React from 'react'

const mockSchedules = [
  { id: 's1', name: 'Horario propuesto A', status: 'Pendiente' },
  { id: 's2', name: 'Horario propuesto B', status: 'Pendiente' },
]

export default function TutorSchedules() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Horarios propuestos</h1>
      <div className="space-y-3">
        {mockSchedules.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-500">Estado: {s.status}</div>
            </div>
            <div>
              <button className="btn-primary">Aprobar horario</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
