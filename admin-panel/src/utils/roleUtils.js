// Role mapping based on numeric values
export const ROLES = {
  WORKER: 0,
  STORAGE_ADMIN: 1,
  DISTRICT_ADMIN: 2,
  CITY_ADMIN: 3,
  REGION_ADMIN: 4,
  CREATOR: 5
};

// Get role name from numeric value
export const getRoleName = (roleValue) => {
  switch (parseInt(roleValue)) {
    case ROLES.CREATOR:
      return 'Creator';
    case ROLES.REGION_ADMIN:
      return 'Region Admin';
    case ROLES.CITY_ADMIN:
      return 'City Admin';
    case ROLES.DISTRICT_ADMIN:
      return 'District Admin';
    case ROLES.STORAGE_ADMIN:
      return 'Storage Admin';
    case ROLES.WORKER:
      return 'Worker';
    default:
      return 'Unknown Role';
  }
};

// Get role color for UI elements
export const getRoleColor = (roleValue) => {
  switch (parseInt(roleValue)) {
    case ROLES.CREATOR:
      return 'error'; // Red
    case ROLES.REGION_ADMIN:
      return 'secondary'; // Purple
    case ROLES.CITY_ADMIN:
      return 'primary'; // Blue
    case ROLES.DISTRICT_ADMIN:
      return 'warning'; // Orange
    case ROLES.STORAGE_ADMIN:
      return 'success'; // Green
    case ROLES.WORKER:
      return 'info'; // Light Blue
    default:
      return 'default'; // Grey
  }
};

// Check if user has at least the specified role level
export const hasRole = (userRole, requiredRole) => {
  return parseInt(userRole) >= requiredRole;
}; 