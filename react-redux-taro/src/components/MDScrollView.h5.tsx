/* eslint-disable no-nested-ternary */
import React, {ReactNode, RefObject, PureComponent, ComponentType} from 'react';
import {ScrollView, View} from '@tarojs/components';

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
  onTurning: (page: [number, number] | number, sid: number) => void;
  onUnmount: (page: [number, number] | number, scrollTop: number) => void;
  children: (list: any[]) => ReactNode;
  tools?: ComponentType<{curPage: number; totalPages: number; show: boolean; onRefresh: () => void}>;
  topArea?: (morePage: boolean, prevPage: number, loading: boolean) => ReactNode;
  bottomArea?: (morePage: boolean, nextPage: number, loading: boolean) => ReactNode;
}
interface State extends Required<DataSource> {
  datasource: DataSource | null;
  cacheDatasource: DataSource | null;
  sourceCache: {[page: number]: DataSource};
  lockState: State | null;
  loadingState: '' | 'next' | 'prev' | 'prev-reclaiming' | 'next-reclaiming';
  scrollState: '' | 'up' | 'down';
}

const defaultTopArea = (morePage: boolean, prevPage: number, loading: boolean) => {
  return morePage && <View className={`loading-tips${loading ? ' loading' : ''}`}>Loading</View>;
};

const defaultBottomArea = (morePage: boolean, nextPage: number, loading: boolean) => {
  return morePage ? <View className={`loading-tips${loading ? ' loading' : ''}`}>Loading</View> : <View className="loading-tips">没有更多</View>;
};

class Component extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const newState: Partial<State> = {};
    let datasource: DataSource | null = null;
    if (nextProps.datasource !== prevState.datasource) {
      newState.datasource = nextProps.datasource;
      datasource = nextProps.datasource;
    }
    if (prevState.cacheDatasource) {
      newState.cacheDatasource = null;
      datasource = prevState.cacheDatasource;
    }
    if (datasource) {
      if (datasource.sid > prevState.sid) {
        const sourceCache = {};
        if (typeof datasource.page === 'number') {
          sourceCache[datasource.page] = datasource;
        } else {
          const [firstPage, secondPage] = datasource.page;
          const firstList = datasource.list.slice(0, datasource.firstSize);
          const secondList = datasource.list.slice(datasource.firstSize);
          sourceCache[firstPage] = {sid: 0, list: firstList, page: firstPage};
          sourceCache[secondPage] = {sid: 0, list: secondList, page: secondPage};
        }
        Object.assign(newState, {
          sourceCache,
          lockState: null,
          loadingState: '',
          scrollState: '',
          sid: datasource.sid,
          list: datasource.list,
          page: datasource.page,
          scrollTop: datasource.scrollTop || 0,
          firstSize: datasource.firstSize || 0,
        });
      } else if (datasource.sid === prevState.sid) {
        const {list: curList, page, scrollState, sourceCache, sid} = prevState;
        const curPage = typeof page === 'number' ? page : 0;
        if (curPage && (datasource.page === curPage - 1 || datasource.page === curPage + 1)) {
          if (!sourceCache[datasource.page]) {
            sourceCache[datasource.page] = datasource;
          }
          let lockState: Partial<State>;
          if (datasource.page === curPage - 1) {
            lockState = {
              lockState: null,
              loadingState: 'prev-reclaiming',
              scrollState: '',
              list: [...datasource.list, ...curList],
              page: [datasource.page, curPage],
              firstSize: datasource.list.length,
            };
          } else {
            lockState = {
              lockState: null,
              loadingState: 'next-reclaiming',
              scrollState: '',
              list: [...curList, ...datasource.list],
              page: [curPage, datasource.page],
              firstSize: curList.length,
            };
          }
          if (scrollState === '') {
            console.log('lockState on getDerivedStateFromProps');
            Object.assign(newState, lockState);
          } else {
            Object.assign(newState, {lockState});
          }
        }
      }
    }
    return Object.keys(newState).length > 0 ? newState : null;
  }

  state: State = {
    datasource: null,
    cacheDatasource: null,
    sourceCache: {},
    lockState: null,
    loadingState: '',
    scrollState: '',
    sid: -1,
    list: [],
    page: 0,
    scrollTop: 0,
    firstSize: 0,
  };

  listRef: RefObject<any>;

  curScrollTop: number = 0;

  prevScrollTop: number = 0;

  scrollTimer: number = 0;

  reclaiming?: () => void;

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
    if (
      (curLoadingState === 'next-reclaiming' && prevLoadingState === 'next') ||
      (curLoadingState === 'prev-reclaiming' && prevLoadingState === 'prev')
    ) {
      const list = this.listRef.current;
      return [list.scrollTop, list.scrollHeight];
    }

    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: [number, number]) {
    const reclaiming = this.reclaiming;
    const list = this.listRef.current;
    if (reclaiming) {
      this.reclaiming = undefined;
      reclaiming();
    } else {
      const curLoadingState = this.state.loadingState;
      const prevLoadingState = prevState.loadingState;
      if (curLoadingState === 'next-reclaiming' && prevLoadingState === 'next') {
        setTimeout(() => this.setState({loadingState: ''}), 0);
      } else if (curLoadingState === 'prev-reclaiming' && prevLoadingState === 'prev') {
        // 如果慢速滚动，浏览器会根据内容变动自动重算list.scrollTop，所以不能使用list.scrollTop+；
        const [prevScrollTop, prevScrollHeight] = snapshot;
        const scrollTop = prevScrollTop + (list.scrollHeight - prevScrollHeight);
        list.scrollTop = scrollTop;
        setTimeout(() => this.setState({loadingState: ''}), 0);
      }
    }
  }

  componentWillUnmount() {
    this.props.onUnmount(this.state.page, this.curScrollTop);
  }

  onScrollToLower = () => {
    const {loadingState, page, list, firstSize, sourceCache} = this.state;
    if (loadingState === '' || loadingState === 'prev') {
      const secondPage = typeof page === 'object' ? page[1] : page;
      const secondList = typeof page === 'object' ? list.slice(firstSize) : list;
      if (secondPage < this.props.totalPages) {
        const sid = Date.now();
        const newState: Partial<State> = {
          sid,
          loadingState: 'next',
          lockState: null,
        };
        const nextPage = secondPage + 1;
        let cacheDatasource = sourceCache[nextPage];
        if (cacheDatasource) {
          cacheDatasource = {...cacheDatasource, sid};
        }
        if (loadingState === '') {
          Object.assign(newState, {list: secondList, page: secondPage});
          if (cacheDatasource) {
            this.reclaiming = () => this.setState({cacheDatasource});
          } else {
            this.reclaiming = () => this.props.onTurning(nextPage, sid);
          }
        } else if (cacheDatasource) {
          Object.assign(newState, {cacheDatasource});
        } else {
          this.props.onTurning(nextPage, sid);
        }
        this.setState(newState as State);
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
        const newState: Partial<State> = {
          sid,
          loadingState: 'prev',
          lockState: null,
        };
        const prevPage = firstPage - 1;
        let cacheDatasource = sourceCache[prevPage];
        if (cacheDatasource) {
          cacheDatasource = {...cacheDatasource, sid};
        }
        if (loadingState === '') {
          Object.assign(newState, {list: firstList, page: firstPage});
          if (cacheDatasource) {
            this.reclaiming = () => this.setState({cacheDatasource});
          } else {
            this.reclaiming = () => this.props.onTurning(prevPage, sid);
          }
        } else if (cacheDatasource) {
          Object.assign(newState, {cacheDatasource});
        } else {
          this.props.onTurning(prevPage, sid);
        }
        this.setState(newState as State);
      }
    }
  };

  checkScroll = () => {
    const lockState = this.state.lockState;
    const prevScrollTop = this.prevScrollTop;
    const curScrollTop = this.curScrollTop;
    const n = curScrollTop - prevScrollTop;
    const scrollState = n > 0 ? 'down' : n < 0 ? 'up' : '';
    if (this.state.scrollState !== scrollState) {
      if (scrollState === '' && lockState) {
        console.log('lockState on scroll');
        this.setState(lockState as State);
      } else {
        this.setState({scrollState});
      }
    }
    if (n === 0) {
      this.scrollTimer = 0;
    } else {
      this.prevScrollTop = curScrollTop;
      this.scrollTimer = setTimeout(this.checkScroll, 300);
    }
  };

  onScroll = (e) => {
    this.curScrollTop = e.detail.scrollTop;
    if (!this.scrollTimer) {
      this.checkScroll();
    }
  };

  onRefresh = () => this.props.onTurning(this.state.page, Date.now());

  render() {
    const {className = 'g-scroll-view', children, totalPages, tools, topArea = defaultTopArea, bottomArea = defaultBottomArea} = this.props;
    const {page, list, scrollTop, loadingState, scrollState} = this.state;
    const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
    const Tools = tools;
    return (
      <>
        {Tools && <Tools curPage={firstPage} totalPages={totalPages} show={!!scrollState} onRefresh={this.onRefresh} />}
        <ScrollView
          ref={this.listRef}
          style={{height: '100%'}}
          className={`${className} ${loadingState !== '' ? 'loading' : ''}`}
          scrollY
          scrollTop={scrollTop}
          onScroll={this.onScroll}
          onScrollToLower={this.onScrollToLower}
          onScrollToUpper={this.onScrollToUpper}
          upperThreshold={300}
          lowerThreshold={300}
        >
          {topArea(firstPage > 1, firstPage - 1, loadingState === 'prev' || loadingState === 'prev-reclaiming')}
          {children(list || [])}
          {bottomArea(secondPage < totalPages, secondPage + 1, loadingState === 'next' || loadingState === 'next-reclaiming')}
        </ScrollView>
      </>
    );
  }
}

export default Component;
