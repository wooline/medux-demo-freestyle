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
  children: (list: any[]) => ReactNode;
  topArea?: (morePage: boolean) => ReactNode;
  bottomArea?: (morePage: boolean) => ReactNode;
}
interface State extends DataSource {
  loadingState: '' | 'next' | 'prev';
}

const defaultTopArea = (morePage: boolean) => {
  return (
    morePage && (
      <View style={{fontSize: '12px', textAlign: 'center'}} className="loading">
        loading...
      </View>
    )
  );
};

const defaultBottomArea = (morePage: boolean) => {
  return morePage ? (
    <View style={{fontSize: '12px', textAlign: 'center'}} className="loading">
      loading...
    </View>
  ) : (
    <View style={{fontSize: '12px', textAlign: 'center'}} className="loading">
      没有更多
    </View>
  );
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
    const {list, page} = prevState;

    if (datasource.sid > prevState.sid) {
      return {loadingState: '', ...datasource, sid: datasource.sid + 1};
    }
    if (datasource.sid === prevState.sid) {
      const curPage = page as number;
      const curList = list;
      if (datasource.page === curPage - 1) {
        return {
          sid: datasource.sid + 1,
          loadingState: '',
          page: [datasource.page, curPage],
          list: [...datasource.list, ...curList],
          firstSize: datasource.list.length,
        };
      }
      if (datasource.page === curPage + 1) {
        return {
          sid: datasource.sid + 1,
          loadingState: '',
          page: [curPage, datasource.page],
          list: [...list, ...datasource.list],
          firstSize: list.length,
        };
      }
    }

    return null;
  }

  state: State = {
    sid: -1,
    list: [],
    page: 0,
    loadingState: '',
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

  onScrollToLower = () => {
    const {loadingState, page, list, firstSize} = this.state;
    if (loadingState === '' || loadingState === 'prev') {
      const secondPage = typeof page === 'object' ? page[1] : page;
      const secondList = typeof page === 'object' ? list.slice(firstSize) : list;
      if (secondPage < this.props.totalPages) {
        const sid = Date.now();
        this.setState({
          loadingState: 'next',
          list: secondList,
          page: secondPage,
          sid,
        });
        this.props.onTurning(secondPage + 1, sid);
      }
    }
  };

  onScrollToUpper = () => {
    const {loadingState, page, list, firstSize} = this.state;
    if (loadingState === '' || loadingState === 'next') {
      const firstPage = typeof page === 'object' ? page[0] : page;
      const firstList = typeof page === 'object' ? list.slice(0, firstSize) : list;
      if (firstPage > 1) {
        const sid = Date.now();
        this.setState({
          loadingState: 'prev',
          list: firstList,
          page: firstPage,
          sid,
        });
        this.props.onTurning(firstPage - 1, sid);
      }
    }
  };

  onScroll = (e) => {
    this.currentScrollTop = e.detail.scrollTop;
    console.log(this.currentScrollTop);
  };

  render() {
    const {className, children, totalPages, topArea = defaultTopArea, bottomArea = defaultTopArea} = this.props;
    const {page, list, scrollTop = 0} = this.state;
    const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
    return (
      <ScrollView
        ref={this.listRef}
        className={`g-scroll-view ${className}`}
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
