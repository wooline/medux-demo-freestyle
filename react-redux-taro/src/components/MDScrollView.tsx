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
  forceShowPrevMore: boolean;
  loadingState: '' | 'next' | 'prev' | 'prev-reclaiming';
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

let instanceId = Date.now();
class Component extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const datasource = nextProps.datasource;
    const {list, page, loadingState} = prevState;
    if (loadingState === 'prev-reclaiming') {
      return null;
    }
    if (datasource.sid > prevState.sid) {
      return {loadingState: '', ...datasource, sid: datasource.sid + 1, forceShowPrevMore: false};
    }
    if (datasource.sid === prevState.sid) {
      const curPage = page as number;
      const curList = list;
      if (datasource.page === curPage - 1) {
        return {
          sid: datasource.sid + 1,
          loadingState: 'prev-reclaiming',
          page: [datasource.page, curPage],
          list: [...curList, ...datasource.list],
          firstSize: datasource.list.length,
          forceShowPrevMore: true,
        };
      }
      if (datasource.page === curPage + 1) {
        return {
          sid: datasource.sid + 1,
          loadingState: '',
          page: [curPage, datasource.page],
          list: [...curList, ...datasource.list],
          firstSize: curList.length,
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
    forceShowPrevMore: false,
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
    if (curLoadingState === 'prev-reclaiming' && prevLoadingState === 'prev') {
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
    const {page, list, scrollTop = 0, forceShowPrevMore} = this.state;
    const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
    const iid = this.iid;
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
        <View id={iid}>
          {topArea(firstPage > 1 || forceShowPrevMore)}
          {children(list || [])}
          {bottomArea(secondPage < totalPages)}
        </View>
      </ScrollView>
    );
  }
}

export default Component;
