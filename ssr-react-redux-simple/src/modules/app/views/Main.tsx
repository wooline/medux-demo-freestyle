import React from 'react';
import {Switch} from '@medux/react-web-router';
import GlobalLoading from 'components/GlobalLoading';
import NotFound from 'components/NotFound';
import {Provider} from 'react-redux';

const MainLayout = App.loadView('mainLayout', 'main');

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView}) => {
  return (
    <div>
      <Switch elseView={<NotFound />}>{subView.mainLayout && <MainLayout />}</Switch>
      <GlobalLoading />
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

const APP = connect(mapStateToProps)(React.memo(Component));

export default function Root({store}) {
  return (
    <Provider store={store}>
      <APP />
    </Provider>
  );
}
