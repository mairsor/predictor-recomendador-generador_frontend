"use client"
import React from 'react'
import ScheduleControlPanel from '../../../components/admin/ScheduleControlPanel'

export default function AdminScheduleControl() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Control de Horario</h1>
      <ScheduleControlPanel />
    </div>
  )
}
