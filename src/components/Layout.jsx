import React from 'react'
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import { SidebarProvider } from '../contexts/SidebarContext'

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 font-bauhaus">
        <Navigation />
        <Sidebar />
        <main className="pt-16 transition-all duration-300">
          <div className="p-4 animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Layout