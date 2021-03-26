import React, {useCallback, useState} from 'react';
import {View, Text} from '@tarojs/components';
import styles from './index.module.less';

interface Props {
  show: boolean;
  loading: boolean;
  curPage: [number, number] | number;
  totalPages: number;
  onTurning: (page?: number) => void;
}

const Component: React.FC<Props> = ({show, loading, curPage, totalPages, onTurning}) => {
  const [active, setActive] = useState(false);

  const switchActive = useCallback(() => {
    setActive(!active);
  }, [active]);

  const onTurningToStart = useCallback(() => {
    onTurning(1);
  }, [onTurning]);

  const onTurningToEnd = useCallback(() => {
    onTurning(totalPages);
  }, [onTurning, totalPages]);

  const onRefresh = useCallback(() => {
    onTurning();
  }, [onTurning]);

  // eslint-disable-next-line no-nested-ternary
  const state = active ? 'on' : show ? 'show' : 'hide';
  const curPageStr = typeof curPage === 'number' ? curPage : curPage.join('-');
  return (
    <View className={`${styles.root} ${state} ${loading ? 'loading' : ''}`}>
      <View className="wrap">
        <View className="panel">
          <View className="refresh at-icon at-icon-reload" onClick={onRefresh} />
          <View className="pagination at-icon at-icon-prev" onClick={onTurningToStart} />
          <View className="goto">
            <Text className="cur">{curPageStr}</Text> / {totalPages}
          </View>
          <View className="pagination at-icon at-icon-next" onClick={onTurningToEnd} />
        </View>
      </View>
      <View className="trigger at-icon at-icon-menu" onClick={switchActive} />
    </View>
  );
};

export default React.memo(Component);
