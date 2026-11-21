import { useState } from "react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      window.alert("username and password must be provided");
      return;
    }

    await onLogin({ username, password });
    setUsername("");
    setPassword("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );
}

export default LoginForm;
