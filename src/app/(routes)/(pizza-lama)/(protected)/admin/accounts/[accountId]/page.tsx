import React from 'react'

import { checkAccess } from '@/utils/checkAccess';
import { UserRole } from '@/data/data';

import HeadingState from '@/components/global-ui/heading-state'
import { Separator } from '@/components/ui/separator'
import Client from './_modules/components/client'
import EmptyState from '@/components/global-ui/empty-state';

export default async function Page() {
    const access = await checkAccess({ allowedRoles: [UserRole.ADMIN] });
  
    if (!access.allowed) {
      return <EmptyState title="Unauthorized" subtitle={access.reason} />;
    }
  
  return (
    <div className='space-y-5'>
      <HeadingState 
      title="Register New Account" 
      subtitle="Create a new roles account for your application" 
      /> 

      <Separator />

      <Client />
    </div>
  )
}
