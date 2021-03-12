import React from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View, Text} from '@tarojs/components';
import {StaticServer} from '@/src/Global';
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
const Component: React.FC<StoreProps & DispatchProps> = ({listSearch, list}) => {
  if (!list || !listSearch) {
    return null;
  }
  return (
    <View className={styles.root}>
      <View className="list-header">
        <View className={`item ${listSearch.sorterField === 'createdTime' ? '' : ' on'}`}>最热</View>
        <View className={`item ${listSearch.sorterField === 'createdTime' ? ' on' : ''}`}>最新</View>
      </View>
      <View className="list-body">
        {list.map((item) => (
          <View key={item.id} className="list-item">
            <View className="avatar" style={{backgroundImage: `url(${StaticServer + item.avatarUrl})`}} />
            <View className="user">
              {item.username}
              <Text className="date">{item.createdTime}</Text>
            </View>
            <View className="content">{item.content}</View>
          </View>
        ))}
      </View>
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.comment!;
  const {listSearch, list, listSummary} = thisModule;
  return {listSearch, list, listSummary};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
