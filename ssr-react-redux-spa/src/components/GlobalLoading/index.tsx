import React from 'react';
import {LoadingState, connectRedux} from '@medux/react-web-router';
import Loading from 'assets/imgs/loading48x48.gif';
import styles from './index.m.less';

interface StoreProps {
  globalLoading?: LoadingState;
}

const Component: React.FC<StoreProps> = ({globalLoading}) => {
  return globalLoading === LoadingState.Start || globalLoading === LoadingState.Depth ? (
    <div className={`${styles.root} ${globalLoading}`}>
      <img className="loadingIcon" src={Loading} alt="loading" />
    </div>
  ) : null;
};

function mapStateToProps(state: APPState): StoreProps {
  return {
    globalLoading: state.app!.loading?.global,
  };
}
export default connectRedux(mapStateToProps)(React.memo(Component));
