"use client"
import React from 'react'

const mockSections = [
  { id: 's1', name: 'Sección A', course: 'Matemáticas I' },
  { id: 's2', name: 'Sección B', course: 'Programación II' },
]

export default function SectionManager() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Secciones</h3>
      <ul className="space-y-2">
        {mockSections.map((s) => (
          <li key={s.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-500">{s.course}</div>
            </div>
            <div>
              <button className="text-blue-600 mr-2">Editar</button>
              <button className="text-red-600">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
