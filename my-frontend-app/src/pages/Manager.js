import { useEffect, useState } from "react";
import Table from "../components/Table";
import { getAllUsers } from "../services/usersService";
import { getAllOrders } from "../services/ordersService";
import { getAllProducts } from "../services/galleryService";

export default function ManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
    getAllOrders().then(setOrders);
    getAllProducts().then(setProducts);
  }, []);

  return (
    <section>
      <h1>Manager Dashboard</h1>

      <h2>Users</h2>
      <Table
        data={users}
        columns={["firstName", "lastName", "email","phone_number", "userRole"]}
        renderActions={() => (
          <>
            <button>Edit</button>
          </>
        )}
      />

      <h2>Orders</h2>
      <Table
        data={orders}
        columns={["orderId", "status", "createDate"]}
        renderActions={() => (
          <>
            <button>View</button>
            <button>Edit</button>
          </>
        )}
      />

      <h2>Products</h2>
      <Table
        data={products}
        columns={["name", "price"]}
        renderActions={() => (
          <>
            <button>Edit</button>
          </>
        )}
      />
    </section>
  );
}