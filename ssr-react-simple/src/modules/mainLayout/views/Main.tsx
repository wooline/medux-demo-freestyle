import React from 'react';
import {connect} from '@medux/react-web-router';
import Loading from 'assets/imgs/loading48x48.gif';

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView}) => {
  return (
    <div>
      <div>header</div>
      <div>
        {Project.clientPublicPath}
        <img src={Loading} alt="loading" />
      </div>
      <div>footer</div>
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

export default connect(mapStateToProps)(React.memo(Component));
