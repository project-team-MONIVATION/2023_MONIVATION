import React from 'react'
import { Outlet } from 'react-router-dom'

import NavComp from '../components/NavComp'

export default function Layout() {
  return (
    <div>
      <NavComp/>
      <Outlet/>
    </div>
  )
}
