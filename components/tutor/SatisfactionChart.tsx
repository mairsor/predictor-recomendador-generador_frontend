"use client"
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Ene', score: 4.1 },
  { name: 'Feb', score: 4.3 },
  { name: 'Mar', score: 4.0 },
  { name: 'Abr', score: 4.5 },
]

export default function SatisfactionChart() {
  return (
    <div className="w-full h-64 bg-white rounded-md p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Satisfacción promedio</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
