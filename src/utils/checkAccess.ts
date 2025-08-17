import { currentUser } from '@/hooks/server-auth-utils'
import { UserRole } from '@/data/data'

interface AccessOptions {
  allowedRoles?: UserRole[];
}

export async function checkAccess(options?: AccessOptions) {
  const user = await currentUser();

  if (!user) {
    return {
      allowed: false,
      reason: "Please login",
    };
  }

  if (options?.allowedRoles && !options.allowedRoles.includes(user.role as UserRole)) {
    return {
      allowed: false,
      reason: "You are not allowed to access this page",
    };
  }

  return {
    allowed: true,
    user,
  };
}
