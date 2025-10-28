import { Link, useLocation } from "react-router-dom"

export default function Sidebar() {
  const { pathname } = useLocation()

  const linkStyle = path =>
    `block px-4 py-3 rounded-md font-medium ${
      pathname === path
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-green-500 hover:text-white"
    }`

  return (
    <aside className="w-70 h-screen bg-gray-900 p-4">
      {/* <h2 className="text-xl font-bold text-green-400 mb-4">CARVIDRIOS</h2> */}
      <img src="./logo.png" alt="" />

      <nav className="space-y-2 mt-6">
        <Link to="/autos" className={linkStyle("/autos")}>
          🚗 VIDRIOS
        </Link>
        <Link to="/accesorios" className={linkStyle("/accesorios")}>
          🔧 ACCESORIOS
        </Link>
      </nav>
    </aside>
  )
}
