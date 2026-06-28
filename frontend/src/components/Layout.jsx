import { Outlet } from 'react-router-dom'

import Footer from './Footer'
import Navbar from './Navbar'
import ToastContainer from './Toast'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ToastContainer />
      <main className="flex-1">{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}
