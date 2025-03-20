function NotificationBodyRightDrawer({ notifications }) {
  return (
    <div>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notification, i) => (
          <div
            key={i}
            className={`mt-3 card bg-base-200 rounded-box p-3 ${
              i % 2 === 0 && "bg-blue-100 text-black "
            } `}
            dangerouslySetInnerHTML={{ __html: notification.message }}
          />
        ))
      )}
    </div>
  );
}

export default NotificationBodyRightDrawer;
