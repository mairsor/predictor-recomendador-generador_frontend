"use client"
import React from 'react'

export default function AdminStatsCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white rounded-md p-4 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
