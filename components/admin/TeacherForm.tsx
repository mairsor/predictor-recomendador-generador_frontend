"use client"
import React from 'react'

export default function TeacherForm() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Agregar docente</h3>
      <form className="space-y-2">
        <input className="w-full p-2 border rounded" placeholder="Nombre" />
        <input className="w-full p-2 border rounded" placeholder="Email" />
        <button className="btn-primary">Guardar</button>
      </form>
    </div>
  )
}
