import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import OrderFormPage from './components/OrderFormPage';

function App() {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">

      {/* Sidebar */}
      <aside className="w-72 bg-gray-50 border-r border-gray-200 p-6 flex flex-col gap-8 shrink-0">
        <div className="text-2xl font-bold flex items-center gap-3 tracking-tight text-gray-900">
          Eventz
        </div>

        <nav className="flex flex-col gap-2">
          {/* Home NavLink */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded font-medium ${isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600'
              }`
            }
          >
            Home
          </NavLink>

          {/* Dashboard NavLink */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded font-medium ${isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600'
              }`
            }
          >
            Dashboard
          </NavLink>

          {/* Orders NavLink */}
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded font-medium ${isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600'
              }`
            }
          >
            Orders
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<OrderFormPage />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/orders/:id/edit" element={<OrderFormPage editMode />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;