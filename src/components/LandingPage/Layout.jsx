import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow pt-0">
                {/* pt-20 added if Navbar is fixed, but landing page might want to control its own padding/hero */}
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout