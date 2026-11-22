import { TextField, Button } from "@mui/material";
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
        <TextField
          label="username"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <TextField
          label="password"
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
