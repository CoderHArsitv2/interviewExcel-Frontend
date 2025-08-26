"use client"
import { useAuthContext } from '@/providers/authProvider'
import React from 'react'

const StudentProfilePage = () => {
    const user = useAuthContext()
    console.log(user)
  return (
    <div>StudentProfilePage</div>
  )
}

export default StudentProfilePage