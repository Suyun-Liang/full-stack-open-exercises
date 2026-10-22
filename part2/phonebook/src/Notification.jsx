function Notification({ notification }) {
  if (!notification) return;
  return <div className={notification.type}>{notification.text}</div>;
}

export default Notification;
