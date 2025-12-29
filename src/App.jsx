import { Routes, Route, Link } from "react-router-dom";
import Delivery from "./Delivery";
import Customer from "./Customer";

export default function App() {
  return (
    <>
      <nav style={{ padding: 10 }}>
        <Link to="/delivery">Delivery</Link> |{" "}
        <Link to="/customer">Customer</Link>
      </nav>

      <Routes>
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/customer" element={<Customer />} />
      </Routes>
    </>
  );
}
