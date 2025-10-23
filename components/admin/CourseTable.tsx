"use client"
import React from 'react'

const mockCourses = [
  { id: 'c1', code: 'MAT101', name: 'Matemáticas I' },
  { id: 'c2', code: 'PROG201', name: 'Programación II' },
]

export default function CourseTable() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Cursos</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th>Código</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mockCourses.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="py-2">{c.code}</td>
              <td className="py-2">{c.name}</td>
              <td className="py-2"> <button className="text-blue-600">Editar</button> </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
