import React, {ReactNode, RefObject, PureComponent} from 'react';
import {ScrollView, View} from '@tarojs/components';
import Taro from '@tarojs/taro';

interface DataSource {
  sid: number;
  list: any[];
  page: [number, number] | number;
  scrollTop?: number;
  firstSize?: number;
}
interface Props {
  className?: string;
  totalPages: number;
  datasource: DataSource;
  onTurning: (page: number, sid: number) => void;
  onUnmount: (page: [number, number] | number, scrollTop: number) => void;
  children: (list: any[]) => ReactNode;
  topArea?: (morePage: boolean) => ReactNode;
  bottomArea?: (morePage: boolean) => ReactNode;
}
interface State extends DataSource {
  datasource?: DataSource;
  loadingState: '' | 'next' | 'prev';
  sourceCache: {[page: number]: any[]};
}

const defaultTopArea = (morePage: boolean) => {
  return morePage && <View className="loading-tips">loading...</View>;
};

const defaultBottomArea = (morePage: boolean) => {
  return morePage ? <View className="loading-tips">loading...</View> : <View className="loading-tips">没有更多</View>;
};

class Component extends PureComponent<Props, State> {
  // static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
  //   const datasource = nextProps.datasource;
  //   const {list, page, firstSize, loadingState} = prevState;
  //   if (loadingState === 'next-reclaiming' || loadingState === 'prev-reclaiming') {
  //     return null;
  //   }
  //   if (datasource.sid > prevState.sid) {
  //     return {loadingState: '', reclaiming: 0, ...datasource, sid: datasource.sid + 1};
  //   }
  //   if (datasource.sid === prevState.sid) {
  //     const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
  //     const [firstList, secondList] = typeof page === 'object' ? [list.slice(0, firstSize), list.slice(firstSize)] : [list, list];
  //     if (datasource.page === firstPage - 1) {
  //       return {
  //         sid: datasource.sid + 1,
  //         loadingState: '',
  //         page: [datasource.page, firstPage],
  //         list: [...datasource.list, ...firstList],
  //         firstSize: datasource.list.length,
  //       };
  //     }
  //     if (datasource.page === secondPage + 1) {
  //       return {
  //         sid: datasource.sid + 1,
  //         loadingState: '',
  //         page: [secondPage, datasource.page],
  //         list: [...secondList, ...datasource.list],
  //         firstSize: secondList.length,
  //       };
  //     }
  //   }

  //   return null;
  // }
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const datasource = nextProps.datasource;
    const {list, page, sourceCache} = prevState;
    if (datasource !== prevState.datasource) {
      if (prevState.sid > 0 && datasource.sid === prevState.sid) {
        const curPage = page as number;
        const curList = list;
        sourceCache[curPage] = list;
        sourceCache[datasource.page as number] = datasource.list;
        if (datasource.page === curPage - 1) {
          return {
            datasource,
            sid: -1,
            loadingState: '',
            page: [datasource.page, curPage],
            list: [...datasource.list, ...curList],
            firstSize: datasource.list.length,
          };
        }
        if (datasource.page === curPage + 1) {
          return {
            datasource,
            sid: -1,
            loadingState: '',
            page: [curPage, datasource.page],
            list: [...list, ...datasource.list],
            firstSize: list.length,
          };
        }
      }
      return {datasource, loadingState: '', ...datasource, scrollTop: datasource.scrollTop || 0, sourceCache: {}};
    }

    return null;
  }

  state: State = {
    sid: -1,
    list: [],
    page: 0,
    loadingState: '',
    sourceCache: {},
  };

  listRef: RefObject<any>;

  currentScrollTop?: number;

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  // 回收视口上方的项目会自动调整scrollTop
  // getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
  //   const curLoadingState = this.state.loadingState;
  //   const prevLoadingState = prevState.loadingState;
  //   if ((curLoadingState === 'next' && prevLoadingState === '') || (curLoadingState === '' && prevLoadingState === 'prev')) {
  //     const list = this.listRef.current;
  //     return [list.scrollHeight, list.scrollTop];
  //   }
  //   return null;
  // }

  // 回收视口上方的项目会自动调整scrollTop
  // componentDidUpdate(prevProps: Props, prevState: State, snapshot: [number, number]) {
  //   const curLoadingState = this.state.loadingState;
  //   const prevLoadingState = prevState.loadingState;
  //   if (snapshot) {
  //     const [prevScrollHeight, prevScrollTop] = snapshot;
  //     const ul = this.listRef.current;
  //     if (curLoadingState === 'next') {
  //       // ul.scrollTop = prevScrollTop - (prevScrollHeight - ul.scrollHeight);
  //     } else if (prevLoadingState === 'prev') {
  //       ul.scrollTop = prevScrollTop + (ul.scrollHeight - prevScrollHeight);
  //     }
  //   }
  // }

  getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
    const curLoadingState = this.state.loadingState;
    const prevLoadingState = prevState.loadingState;
    if (curLoadingState === '' && prevLoadingState === 'prev') {
      const list = this.listRef.current;
      return [list.scrollHeight, list.scrollTop];
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: [number, number]) {
    if (snapshot) {
      const [prevScrollHeight, prevScrollTop] = snapshot;
      const ul = this.listRef.current;
      ul.scrollTop = prevScrollTop + (ul.scrollHeight - prevScrollHeight);
    }
  }

  componentWillUnmount() {
    this.props.onUnmount(this.state.page, this.currentScrollTop || 0);
  }

  onScrollToLower = () => {
    const {loadingState, page, list, firstSize, sourceCache} = this.state;
    if (loadingState === '' || loadingState === 'prev') {
      const secondPage = typeof page === 'object' ? page[1] : page;
      const secondList = typeof page === 'object' ? list.slice(firstSize) : list;
      if (secondPage < this.props.totalPages) {
        const sid = Date.now();
        const nextPage = secondPage + 1;
        const datasource = sourceCache[nextPage];
        let callback: () => void;
        if (datasource) {
          const newState = {
            sid: -1,
            loadingState: '',
            page: [secondPage, nextPage],
            list: [...secondList, ...datasource],
            firstSize: secondList.length,
          };
          callback = () => this.setState(newState as State);
        } else {
          callback = () => this.props.onTurning(nextPage, sid);
        }
        this.setState(
          {
            sid,
            loadingState: 'next',
            list: secondList,
            page: secondPage,
          },
          callback
        );
      }
    }
  };

  onScrollToUpper = () => {
    const {loadingState, page, list, firstSize, sourceCache} = this.state;
    if (loadingState === '' || loadingState === 'next') {
      const firstPage = typeof page === 'object' ? page[0] : page;
      const firstList = typeof page === 'object' ? list.slice(0, firstSize) : list;
      if (firstPage > 1) {
        const sid = Date.now();
        const prevPage = firstPage - 1;
        const datasource = sourceCache[prevPage];
        let callback: () => void;
        if (datasource) {
          const newState = {
            sid: -1,
            loadingState: '',
            page: [prevPage, firstPage],
            list: [...datasource, ...firstList],
            firstSize: datasource.length,
          };
          callback = () => this.setState(newState as State);
        } else {
          callback = () => this.props.onTurning(prevPage, sid);
        }

        this.setState(
          {
            loadingState: 'prev',
            list: firstList,
            page: firstPage,
            sid,
          },
          callback
        );
      }
    }
  };

  onScroll = (e) => {
    this.currentScrollTop = e.detail.scrollTop;
  };

  render() {
    const {className = 'g-scroll-view', children, totalPages, topArea = defaultTopArea, bottomArea = defaultBottomArea} = this.props;
    const {page, list, scrollTop = 0, loadingState} = this.state;
    const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
    return (
      <ScrollView
        ref={this.listRef}
        style={{height: '100%'}}
        className={`${className} ${loadingState}`}
        scrollY
        scrollTop={scrollTop}
        onScroll={this.onScroll}
        onScrollToLower={this.onScrollToLower}
        onScrollToUpper={this.onScrollToUpper}
      >
        {topArea(firstPage > 1)}
        {children(list || [])}
        {bottomArea(secondPage < totalPages)}
      </ScrollView>
    );
  }
}

export default Component;
