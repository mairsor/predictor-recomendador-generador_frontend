"use client"
import React from 'react'
import AdminStatsCard from '../../../components/admin/AdminStatsCard'
import CourseTable from '../../../components/admin/CourseTable'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Panel Administrador</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <AdminStatsCard title="Cursos" value={24} />
        <AdminStatsCard title="Docentes" value={12} />
        <AdminStatsCard title="Secciones publicadas" value={48} />
      </div>

      <CourseTable />
    </div>
  )
}
