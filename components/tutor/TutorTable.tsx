"use client"
import React from 'react'

type Row = { id: string; student: string; course: string; status: string }

const rows: Row[] = [
  { id: '1', student: 'Ana Pérez', course: 'Programación', status: 'Sin choques' },
  { id: '2', student: 'Luis Gómez', course: 'Matemáticas', status: 'Choque' },
]

export default function TutorTable() {
  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-sm font-semibold mb-2">Estudiantes / Horarios</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="pb-2">Estudiante</th>
            <th className="pb-2">Curso</th>
            <th className="pb-2">Estado</th>
            <th className="pb-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{r.student}</td>
              <td className="py-2">{r.course}</td>
              <td className="py-2">{r.status}</td>
              <td className="py-2">
                <button className="text-sm text-blue-600 hover:underline">Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
