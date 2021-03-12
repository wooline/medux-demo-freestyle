import React, {useCallback} from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View, Text} from '@tarojs/components';
import {App, StaticServer} from '@/src/Global';
import {ListItem, ListSearch, ListSummary} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  listSearch?: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
}
interface DispatchProps {
  dispatch: Dispatch;
}
const Component: React.FC<StoreProps & DispatchProps> = ({list}) => {
  if (!list) {
    return null;
  }
  return (
    <View className={styles.root}>
      <View className="g-pic-list">
        {list.map((item) => (
          <View key={item.id} className="list-item" onClick={() => App.router.push({pagename: '/photo/item', params: {photo: {itemIdPre: item.id}}})}>
            <View className="list-pic" style={{backgroundImage: `url(${StaticServer + item.coverUrl})`}}>
              <View className="list-title">{item.title}</View>
              <View className="listImg" />
              <View className="props">
                <View className="at-icon at-icon-map-pin" /> {item.departure}
                <View className="at-icon at-icon-star" style={{marginLeft: '5px'}} /> {item.type}
              </View>
              <View className="desc">
                <View className="price">
                  <Text className="unit">￥</Text>
                  <Text className="num">{item.price}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photo!;
  const {listSearch, list, listSummary} = thisModule;
  return {listSearch, list, listSummary};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
