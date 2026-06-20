import { useNavigate } from "react-router-dom";

// A general button: navigates to the given URL (`to`) and shows `text`.
export default function Button({ to, text }) {

  const navigate = useNavigate(); //gives us the navigate function

  return (
    <button type="button" className="button" onClick={() => navigate(to)}>
      {text}
    </button>
  );
}
