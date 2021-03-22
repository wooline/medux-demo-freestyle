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
  topArea?: (morePage: boolean, loading: boolean) => ReactNode;
  bottomArea?: (morePage: boolean, loading: boolean) => ReactNode;
}
interface State extends DataSource {
  datasource?: DataSource;
  forceShowPrevMore: boolean;
  loadingState: '' | 'next' | 'prev' | 'prev-reclaiming' | 'next-reclaiming';
  sourceCache: {[page: number]: any[]};
}

const defaultTopArea = (morePage: boolean, loading: boolean) => {
  return morePage && <View className="loading-tips">{loading ? 'loading...' : '上一页'}</View>;
};

const defaultBottomArea = (morePage: boolean, loading: boolean) => {
  return morePage ? <View className="loading-tips">{loading ? 'loading...' : '下一页'}</View> : <View className="loading-tips">没有更多</View>;
};

let instanceId = Date.now();
class Component extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const datasource = nextProps.datasource;
    const {list, page, loadingState, sourceCache} = prevState;
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
            loadingState: 'prev-reclaiming',
            page: [datasource.page, curPage],
            list: [...curList, ...datasource.list],
            firstSize: datasource.list.length,
            forceShowPrevMore: true,
          };
        }
        if (datasource.page === curPage + 1) {
          return {
            datasource,
            sid: -1,
            loadingState: 'next-reclaiming',
            page: [curPage, datasource.page],
            list: [...curList, ...datasource.list],
            firstSize: curList.length,
          };
        }
      }
      return {datasource, loadingState: '', ...datasource, scrollTop: datasource.scrollTop || 0, sourceCache: {}, forceShowPrevMore: false};
    }

    return null;
  }

  state: State = {
    sid: -1,
    list: [],
    page: 0,
    loadingState: '',
    forceShowPrevMore: false,
    sourceCache: {},
  };

  listRef: RefObject<any>;

  iid: string = `scroll-view${instanceId++}`;

  currentScrollTop?: number;

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const curLoadingState = this.state.loadingState;
    const prevLoadingState = prevState.loadingState;
    if (curLoadingState === 'next-reclaiming' && prevLoadingState === 'next') {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({loadingState: ''});
    } else if (curLoadingState === 'prev-reclaiming' && prevLoadingState === 'prev') {
      const iid = `#${this.iid}`;
      let prevScrollHeight: number;
      Taro.createSelectorQuery()
        .select(iid)
        .boundingClientRect()
        .exec(([rect]) => {
          prevScrollHeight = rect.height;
        });
      Taro.nextTick(() => {
        Taro.createSelectorQuery()
          .select(iid)
          .boundingClientRect()
          .exec(([rect]) => {
            let scrollTop = -rect.top + (rect.height - prevScrollHeight);
            if (scrollTop === this.state.scrollTop) {
              scrollTop++;
            }
            const {list, firstSize = 0} = this.state;
            const firstList = list.slice(list.length - firstSize);
            const secondList = list.slice(0, list.length - firstSize);
            this.setState({loadingState: '', scrollTop, list: [...firstList, ...secondList]});
            Taro.nextTick(() => {
              this.setState({forceShowPrevMore: false});
            });
          });
      });
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
          const newState: Partial<State> = {
            loadingState: 'next-reclaiming',
            page: [secondPage, nextPage],
            list: [...secondList, ...datasource],
            firstSize: secondList.length,
          };
          callback = () => this.setState(newState as State);
        } else {
          callback = () => this.props.onTurning(nextPage, sid);
        }
        // setTimeout(callback, 2000);
        Taro.nextTick(callback);
        this.setState({
          loadingState: 'next',
          list: secondList,
          page: secondPage,
          sid,
          forceShowPrevMore: false,
        });
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
          const newState: Partial<State> = {
            loadingState: 'prev-reclaiming',
            page: [prevPage, firstPage],
            list: [...firstList, ...datasource],
            firstSize: datasource.length,
            forceShowPrevMore: true,
          };
          callback = () => this.setState(newState as any);
        } else {
          callback = () => this.props.onTurning(prevPage, sid);
        }
        Taro.nextTick(callback);
        this.setState({
          loadingState: 'prev',
          list: firstList,
          page: firstPage,
          sid,
          forceShowPrevMore: false,
        });
      }
    }
  };

  onScroll = (e) => {
    this.currentScrollTop = e.detail.scrollTop;
    // console.log(this.currentScrollTop);
  };

  render() {
    const {className = 'g-scroll-view', children, totalPages, topArea = defaultTopArea, bottomArea = defaultBottomArea} = this.props;
    const {page, list, scrollTop = 0, forceShowPrevMore, loadingState} = this.state;
    const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
    const iid = this.iid;
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
        upperThreshold={300}
        lowerThreshold={300}
      >
        <View id={iid}>
          {topArea(firstPage > 1 || forceShowPrevMore, loadingState === 'prev' || loadingState === 'prev-reclaiming')}
          {children(list || [])}
          {bottomArea(secondPage < totalPages, loadingState === 'next' || loadingState === 'next-reclaiming')}
        </View>
      </ScrollView>
    );
  }
}

export default Component;
