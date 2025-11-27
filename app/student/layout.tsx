"use client"
import React from 'react'
import MainLayout from '../../components/common/MainLayout'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
