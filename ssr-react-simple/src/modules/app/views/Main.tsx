import React from 'react';
import {connect, Switch, DocumentHead} from '@medux/react-web-router';
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
    <div>
      <DocumentHead>
        <title>bbbb</title>
        <style>{`body{background:green}`}</style>
      </DocumentHead>
      <Switch elseView={<NotFound />}>{subView.mainLayout && <MainLayout />}</Switch>
      <GlobalLoading />
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

export default connect(mapStateToProps)(React.memo(Component));
