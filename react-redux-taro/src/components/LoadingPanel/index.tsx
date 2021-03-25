import React from 'react';
import {View} from '@tarojs/components';
import styles from './index.module.less';

const Component: React.FC = () => {
  return (
    <View className={styles.root}>
      <View className="loadingIcon at-icon at-icon-loading" />
    </View>
  );
};

export default React.memo(Component);
