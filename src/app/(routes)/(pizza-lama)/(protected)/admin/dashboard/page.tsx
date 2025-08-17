import React from 'react'

import { checkAccess } from '@/utils/checkAccess';
import { UserRole } from '@/data/data'

import EmptyState from '@/components/global-ui/empty-state'

export default async function Page() {
  const access = await checkAccess({ allowedRoles: [UserRole.ADMIN, UserRole.MODERATOR] });

  if (!access.allowed) {
    return <EmptyState title="Unauthorized" subtitle={access.reason} />;
  }
  
  return (
    <div>Page</div>
  )
}
