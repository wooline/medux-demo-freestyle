import React from 'react';
import {Switch} from '@medux/react-web-router';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import NotFound from 'components/NotFound';
import Navigation from '../Navigation';
import TabBar from '../TabBar';
import styles from './index.m.less';

const Photos = App.loadView('photos', 'main');

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView}) => {
  return (
    <>
      <Navigation />
      <div className={styles.root}>
        <Switch elseView={<NotFound />}>{subView.photos && <Photos />}</Switch>
      </div>
      <TabBar />
    </>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
