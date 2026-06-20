import { useNavigate } from "react-router-dom";

// A button that returns to the previous page in the browser history.
export default function BackButton({ label = "← Back" }) {

  const navigate = useNavigate();

  return (
    <button type="button" className="back-button" onClick={() => navigate(-1)}>
      {label}
    </button>
  );
}
