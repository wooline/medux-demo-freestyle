import React from 'react';
import {connect} from '@medux/react-web-router';

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView}) => {
  return (
    <div>
      <div>header</div>
      <div>main</div>
      <div>footer</div>
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

export default connect(mapStateToProps)(React.memo(Component));
