import React from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View, Text} from '@tarojs/components';
import {StaticServer, App} from '~/Global';
import {api, ListItem, ListSearch, ListSummary, RouteParams} from '~/modules/videos/entity';
import styles from './index.module.less';

interface StoreProps {
  listSearch?: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
}
interface DispatchProps {
  dispatch: Dispatch;
}
const Component: React.FC<StoreProps & DispatchProps> = ({list = []}) => {
  return (
    <View className={styles.root}>
      <View className="g-pic-list">
        {list.map((item) => (
          <View key={item.id} className="list-item">
            <View className="list-pic" style={{backgroundImage: `url(${StaticServer + item.coverUrl})`}}>
              <View className="list-title">{item.title}</View>
              <View className="listImg" />
              <View className="props">
                <View className="at-icon at-icon-heart-2" /> {item.hot}
              </View>
              <View className="player">
                <View className="at-icon at-icon-play" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.videos!;
  const {listSearch, list, listSummary} = thisModule;
  return {listSearch, list, listSummary};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
