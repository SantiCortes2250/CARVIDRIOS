import { HashRouter, Routes, Route } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Dashboard from "@/pages/Dashboard"
import Autos from "@/pages/Autos"
import Accesorios from "@/pages/Accesorios"

function App() {
  return (
    <HashRouter>
      <div className="flex">
        <Sidebar />
        <main className="w-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/autos" element={<Autos />} />
            <Route path="/accesorios" element={<Accesorios />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
