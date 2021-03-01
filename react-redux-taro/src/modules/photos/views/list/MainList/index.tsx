import React from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View, Text} from '@tarojs/components';
import {StaticServer} from '~/Global';
import {api, ListItem, ListSearch, ListSummary, RouteParams} from '~/modules/photos/entity';

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
    <View>
      {list.map((item) => (
        <View key={item.id} className="g-pre-img">
          <View style={{backgroundImage: `url(${StaticServer + item.coverUrl})`}}>
            <Text className="title">{item.title}666</Text>
            <View className="listImg" />
            <View className="props">
              {item.departure}
              {item.type}
            </View>
            <View className="desc">
              <View className="hot">
                人气6(<Text>{item.hot}</Text>)
              </View>
              <View className="price">
                <View className="unit">￥</View>
                {item.price}
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photos!;
  const {listSearch, list, listSummary} = thisModule;
  return {listSearch, list, listSummary};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
