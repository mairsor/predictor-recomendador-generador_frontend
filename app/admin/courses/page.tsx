"use client"
import React from 'react'
import CourseTable from '../../../components/admin/CourseTable'

export default function AdminCourses() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cursos</h1>
      <CourseTable />
    </div>
  )
}
