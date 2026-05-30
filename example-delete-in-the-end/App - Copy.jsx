import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import UseEffect from "./examples/UseEffect";
import UseEffectCleanup from "./examples/UseEffectCleanup";
import DataFetching from "./examples/DataFetching";
import Forms from "./examples/Forms";
import Routing, { Home, About, Users, UserDetails } from "./examples/Routing";
import LayoutExample from "./examples/Layout";
import LiftingState from "./examples/LiftingState";
import Context from "./examples/Context";

const nav = [
  { path: "/",              label: "useEffect", end: true },
  { path: "/cleanup",       label: "useEffect Cleanup" },
  { path: "/data-fetching", label: "Data Fetching" },
  { path: "/forms",         label: "Forms" },
  { path: "/routing",       label: "Routing" },
  { path: "/layout",        label: "Layout" },
  { path: "/lifting-state", label: "Lifting State Up" },
  { path: "/context",       label: "React Context" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">Lecture 7</div>
        <div className="sidebar__subtitle">React Deep Dive</div>
      </div>
      <nav className="sidebar__nav">
        <ul>
          {nav.map(item => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.end ?? false}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"              element={<UseEffect />} />
            <Route path="/cleanup"       element={<UseEffectCleanup />} />
            <Route path="/data-fetching" element={<DataFetching />} />
            <Route path="/forms"         element={<Forms />} />
            <Route path="/routing"       element={<Routing />} />
            <Route path="/about"         element={<About />} />
            <Route path="/users"         element={<Users />} />
            <Route path="/users/:id"     element={<UserDetails />} />
            <Route path="/layout"        element={<LayoutExample />} />
            <Route path="/lifting-state" element={<LiftingState />} />
            <Route path="/context"       element={<Context />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
