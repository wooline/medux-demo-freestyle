import React from 'react';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import styles from './index.m.less';

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView}) => {
  return (
    <div className={`${styles.root} g-doc-width`}>
      <span>aa3</span>
      <span>bb</span>
      <span>cc</span>
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
