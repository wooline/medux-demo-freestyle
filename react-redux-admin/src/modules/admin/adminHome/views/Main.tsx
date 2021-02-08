import React from 'react';

interface StoreProps {}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = () => {
  return (
    <div>
      <div>adminHome</div>
    </div>
  );
};

export default Component;
