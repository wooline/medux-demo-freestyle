import React from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {ListView} from '../entity';
import MainList from './list/MainList';

interface StoreProps {
  listView: ListView;
}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({listView}) => {
  return <>{listView === 'list' && <MainList />}</>;
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.videos!;
  return {listView: thisModule.listView};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
