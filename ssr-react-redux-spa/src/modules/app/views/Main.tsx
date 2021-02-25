import React from 'react';
import {Switch} from '@medux/react-web-router';
import {connectRedux, Provider} from '@medux/react-web-router/lib/conect-redux';
import GlobalLoading from 'components/GlobalLoading';
import NotFound from 'components/NotFound';

const MainLayout = App.loadView('mainLayout', 'main');

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView}) => {
  return (
    <>
      <Switch elseView={<NotFound />}>{subView.mainLayout && <MainLayout />}</Switch>
      <GlobalLoading />
    </>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

const APP = connectRedux(mapStateToProps)(React.memo(Component));

export default function Root({store}) {
  return (
    <Provider store={store}>
      <APP />
    </Provider>
  );
}
