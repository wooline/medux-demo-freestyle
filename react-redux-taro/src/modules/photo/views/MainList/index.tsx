import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View, Text} from '@tarojs/components';
import LoadingPanel from '@/src/components/LoadingPanel';
import PPScroll, {DataSource} from 'pp-scroll/taro';
import {App, Modules, StaticServer} from '@/src/Global';
import {ListItem, ListSearch, ListSummary} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  listVer?: number;
  listSearch?: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  routeKey: string;
  routeAction: string;
}

interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps> = ({listSearch, list, listSummary, listVer = 0, routeKey, routeAction, dispatch}) => {
  const curDatasource = useRef<DataSource>();

  const onDatasourceChange = useCallback((datasource: DataSource) => {
    curDatasource.current = datasource;
    console.log(datasource);
  }, []);

  useEffect(() => {
    return App.router.addListener((data) => {
      console.log(data, curDatasource.current);
    });
  }, []);

  const onTurning = useCallback((page: [number, number] | number, sid: number) => {
    App.router.replace(
      {pagename: '/photo/list', params: {photo: {listSearchPre: {pageCurrent: page}, listVerPre: sid}}, extendParams: 'current'},
      true
    );
  }, []);

  const datasource: DataSource | null = useMemo(() => {
    if (!listSearch || !list || !listSummary) {
      return null;
    }
    const {pageCurrent, firstSize, totalPages, totalItems} = listSummary;
    return {list, page: pageCurrent, firstSize, sid: listVer, totalPages, totalItems};
  }, [listSearch, list, listSummary, listVer]);

  const children = useCallback((realList: ListItem[]) => {
    return (
      <View className={`g-pic-list ${styles.root}`}>
        {realList.map((item) => (
          <View key={item.id} className="list-item" onClick={() => App.router.push({pagename: '/photo/item', params: {photo: {itemIdPre: item.id}}})}>
            <View className="list-pic" style={{backgroundImage: `url(${StaticServer + item.coverUrl})`}}>
              <View className="list-title">
                {item.id}
                {item.title}
              </View>
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
    );
  }, []);
  if (!listSearch || !list || !listSummary || !datasource) {
    return <LoadingPanel />;
  }
  return (
    <PPScroll datasource={datasource} onTurning={onTurning} onDatasourceChange={onDatasourceChange}>
      {children}
    </PPScroll>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photo!;
  const {listSearch, list, listSummary, listVer} = thisModule;
  return {listSearch, list, listSummary, listVer, routeKey: appState.route.key, routeAction: appState.route.action};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
