"use client"
import React from 'react'
import DemandChart from '../../../components/tutor/DemandChart'
import SatisfactionChart from '../../../components/tutor/SatisfactionChart'
import TutorTable from '../../../components/tutor/TutorTable'
import { Card } from '../../../components/ui/card'

export default function TutorDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Panel Tutor</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Cursos con mayor demanda: <strong>Programación</strong></div>
        <div className="bg-white p-4 rounded shadow">Estudiantes sin choques: <strong>85%</strong></div>
        <div className="bg-white p-4 rounded shadow">Satisfacción promedio: <strong>4.3</strong></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <DemandChart />
        <SatisfactionChart />
      </div>

      <TutorTable />
    </div>
  )
}
