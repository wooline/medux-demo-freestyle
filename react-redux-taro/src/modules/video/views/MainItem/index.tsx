import React, {useCallback, useState} from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View, Swiper, SwiperItem} from '@tarojs/components';
import {App, StaticServer} from '@/src/Global';
import {ItemDetail} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  itemDetail?: ItemDetail;
}
interface DispatchProps {
  dispatch: Dispatch;
}
const Component: React.FC<StoreProps & DispatchProps> = ({itemDetail}) => {
  const onNavToComment = useCallback(
    () => App.router.push({pagename: '/comment/list', params: {comment: {listSearchPre: {articleId: itemDetail!.id}}}}),
    [itemDetail]
  );
  if (!itemDetail) {
    return null;
  }

  return <View className={styles.root}>sssss</View>;
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.video!;
  const {itemDetail} = thisModule;
  return {itemDetail};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
