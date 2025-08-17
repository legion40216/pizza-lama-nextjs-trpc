"use client";
import React, { Suspense } from 'react';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';

import EmptyState from '@/components/global-ui/empty-state';
import Client from '../components/client';
import { format } from 'date-fns';

export const AccountsSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
          title="Error loading accounts" 
          subtitle="Please try again later." 
        />
        }>
        <AccountsSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const AccountsSectionContent = () => {
  const [getCurrentUser] = trpc.users.getCurrentById.useSuspenseQuery();
  const currentUser = getCurrentUser.user

  if (!currentUser) {
  return (
    <EmptyState 
      title="Unable to identify current user" 
      subtitle="Please refresh or contact support."
    />
  );
}
  const [data] = trpc.users.getAll.useSuspenseQuery();
  const users = data.users

  if (users.length === 0) {
    return (
      <EmptyState 
        title="No accounts found" 
        subtitle="You have no accounts." 
      />
    );
  }

  const filterCurrentUser = users.filter((item) => {
    return item.id !== currentUser.id;
  });

  const formattedUsers = filterCurrentUser.map((item) => {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      image: item.image,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <Client 
      initialData={formattedUsers}
    />
  )
};
