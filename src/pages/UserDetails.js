import { useParams } from "react-router-dom";

// GET /users/:id — admin view of a single user.
export default function UserDetails() {
  const { id } = useParams();
  return (
    <section>
      <h1>User #{id}</h1>
      <p>Backend: <code>GET /users/{id}</code>, <code>PUT /users/{id}</code></p>
    </section>
  );
}
