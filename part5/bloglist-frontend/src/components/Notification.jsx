function Notification({ notification }) {
  if (!notification.message) return;
  return (
    <div className={`${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
}

export default Notification;
