export const getRoleOptions = (role: string) => {
  switch (role) {
    case "administrator":
      return [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
      ];
    case "admin":
      return [
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
      ];
    case "manager":
      return [{ value: "user", label: "User" }];
    default:
      return [];
  }
};
export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "paused", label: "Paused" },
  { value: "open", label: "Open" },
  { value: "part-demand", label: "Part Demand" },
  { value: "service-lifting", label: "Service Lifting" },
  { value: "party-lifting", label: "Party Lifting" },
  { value: "unit-in-service-center", label: "Unit in service center" },
  { value: "installation-pending", label: "Installation Pending" },
  { value: "in-progress", label: "In Process" },
  { value: "deliverd", label: "Deliverd" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "closed", label: "Closed" },
];
