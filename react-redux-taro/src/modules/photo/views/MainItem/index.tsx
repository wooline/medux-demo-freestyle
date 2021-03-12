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
  const [moreDetail, setMoreDetail] = useState(false);
  const toggleDetail = useCallback(() => {
    setMoreDetail(!moreDetail);
  }, [moreDetail]);
  const onNavToComment = useCallback(
    () => App.router.push({pagename: '/comment/list', params: {comment: {listSearchPre: {articleId: itemDetail!.id}}}}),
    [itemDetail]
  );
  if (!itemDetail) {
    return null;
  }

  return (
    <View className={styles.root}>
      <View className="article">
        <View className="subject">{itemDetail.title}</View>
        <View className={`remark${moreDetail ? ' on' : ''}`} onClick={toggleDetail}>
          {itemDetail.remark}
        </View>
      </View>
      <View className="commentBar" onClick={onNavToComment}>
        <View className="at-icon at-icon-heart" />
        <View>{itemDetail.hot}</View>
        <View className="split" />
        <View className="at-icon at-icon-message" />
        <View>{itemDetail.comments}</View>
      </View>
      <View className="content">
        <Swiper className="test-h" indicatorColor="#999" indicatorActiveColor="#333" style={{height: '100%'}} indicatorDots>
          {itemDetail.picList.map((url) => (
            <SwiperItem key={url}>
              <View className="picItem" style={{backgroundImage: `url(${StaticServer + url})`}} />
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photo!;
  const {itemDetail} = thisModule;
  return {itemDetail};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
