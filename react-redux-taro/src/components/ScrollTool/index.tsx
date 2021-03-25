import React, {useCallback, useState} from 'react';
import {View, Text} from '@tarojs/components';
import styles from './index.module.less';

interface Props {
  show: boolean;
  curPage: number;
  totalPages: number;
  onRefresh: () => void;
}

const Component: React.FC<Props> = ({show, curPage, totalPages, onRefresh}) => {
  const [active, setActive] = useState(false);

  const switchActive = useCallback(() => {
    setActive(!active);
  }, [active]);

  // eslint-disable-next-line no-nested-ternary
  const state = active ? 'on' : show ? 'show' : 'hide';
  return (
    <View className={`${styles.root} ${state}`}>
      <View className="wrap">
        <View className="panel">
          <View className="refresh at-icon at-icon-reload" onClick={onRefresh} />
          <View className="pagination at-icon at-icon-prev" />
          <View className="goto">
            <Text className="cur">{curPage}</Text> / {totalPages}
          </View>
          <View className="pagination at-icon at-icon-next" />
        </View>
      </View>
      <View className="trigger at-icon at-icon-menu" onClick={switchActive} />
    </View>
  );
};

export default React.memo(Component);
