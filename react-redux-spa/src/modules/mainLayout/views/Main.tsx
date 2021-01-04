import React from 'react';
import {Switch, connectRedux} from '@medux/react-web-router';
import NotFound from 'components/NotFound';

const Photos = App.loadView('photos', 'main');

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
        <Switch elseView={<NotFound />}>{subView.photos && <Photos />}</Switch>
      </div>
      <div>footer</div>
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
