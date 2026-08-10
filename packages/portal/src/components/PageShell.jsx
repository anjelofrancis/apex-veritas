import React from 'react';

export default function PageShell({ title, actions, children }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
