import React, {useMemo, useCallback} from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {ScrollView, View} from '@tarojs/components';
import {StaticServer, App} from '@/src/Global';
import {api, ListItem, ListSearch, ListSummary, RouteParams} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  listVer?: number;
  listSearch?: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
}
interface DispatchProps {
  dispatch: Dispatch;
}
const Component: React.FC<StoreProps & DispatchProps> = ({listSearch, list, listSummary, listVer = 0, dispatch}) => {
  const datasource: {list: any[]; page: [number, number] | number; firstSize?: number; sid: number} | null = useMemo(() => {
    if (!listSearch || !list || !listSummary) {
      return null;
    }
    return {list, page: listSummary.pageCurrent, firstSize: listSummary.firstSize, sid: listVer};
  }, [listSearch, list, listSummary, listVer]);
  const children = useCallback(() => {
    return (
      <View className={`g-pic-list ${styles.root}`}>
        {list!.map((item) => (
          <View key={item.id} className="list-item" onClick={() => App.router.push({pagename: '/video/item', params: {video: {itemIdPre: item.id}}})}>
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
    );
  }, [list]);
  if (!listSearch || !list || !listSummary || !datasource) {
    return null;
  }
  return <View>{children}</View>;
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.video!;
  const {listSearch, list, listSummary, listVer} = thisModule;
  return {listSearch, list, listSummary, listVer};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
