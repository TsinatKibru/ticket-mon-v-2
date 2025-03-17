function TemplatePointers() {
  return (
    <>
      <h1 className="text-2xl mt-8 font-bold">Ticketing App - Manage Issues</h1>
      <ul className="mt-4 space-y-1">
        {[
          "Efficient Ticket Tracking",
          "Team Collaboration & Assignment",
          "Detailed Role-Based Access",
          "Comprehensive Comment Support",
          "Clear Status & Priority",
        ].map((item) => (
          <li key={item}>
            ✓ <span className="font-semibold">{item}</span>
          </li>
        ))}
      </ul>
      <h2 className="text-xl mt-4 font-semibold">User Roles:</h2>
      <p className="text-sm mt-1">
        <strong>Admin:</strong>{" "}
        <span className="font-mono">alex@gmail.com</span> (Pass:{" "}
        <span className="font-mono">1qaz2wsx</span>) •
        <strong> Support Agent:</strong>{" "}
        <span className="font-mono">alex2@gmail.com</span> (Can update tickets)
        •<strong> New Users:</strong> Default{" "}
        <span className="font-semibold">User</span> role.
      </p>
    </>
  );
}

export default TemplatePointers;
