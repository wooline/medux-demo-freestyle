import React, {useCallback} from 'react';
import Taro from '@tarojs/taro';
import {LoadingState, Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View} from '@tarojs/components';
import {AtNavBar} from 'taro-ui';
import {App} from '@/src/Global';

interface StoreProps {
  globalLoading?: LoadingState;
  hasHistory: boolean;
}
interface OwnerProps {
  title: string;
}
interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({globalLoading, title, hasHistory, children, dispatch}) => {
  const onNavBack = useCallback(() => App.router.back(1), []);
  return (
    <>
      {process.env.TARO_ENV === 'h5' && (
        <AtNavBar color="#555" border={false} onClickLeftIcon={onNavBack} title={title} leftIconType={hasHistory ? 'chevron-left' : ''} />
      )}
      {(globalLoading === LoadingState.Start || globalLoading === LoadingState.Depth) && (
        <View className={`g-global-loading ${globalLoading}`}>
          <View className="loadingIcon at-icon at-icon-loading" />
        </View>
      )}
      <View className="g-page-content">{children}</View>
    </>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const app = appState.app!;
  return {globalLoading: app.loading?.global, hasHistory: App.router.history.getActionsLength() > 1};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
