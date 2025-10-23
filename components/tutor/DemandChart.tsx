"use client"
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Matemáticas', demand: 120 },
  { name: 'Física', demand: 95 },
  { name: 'Programación', demand: 200 },
  { name: 'Química', demand: 60 },
]

export default function DemandChart() {
  return (
    <div className="w-full h-64 bg-white rounded-md p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Demanda proyectada por curso</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="demand" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
