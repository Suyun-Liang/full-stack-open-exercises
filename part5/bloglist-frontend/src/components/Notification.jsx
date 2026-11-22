import { Alert } from "@mui/material";

function Notification({ notification }) {
  if (!notification.message) return;
  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={`${notification.type}`}
    >
      {notification.message}
    </Alert>
  );
}

export default Notification;
