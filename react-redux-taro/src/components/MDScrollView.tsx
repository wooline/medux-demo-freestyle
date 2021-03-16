import React, {ReactNode, RefObject, PureComponent} from 'react';
import {ScrollView, View} from '@tarojs/components';

interface DataSource {
  sid: number;
  list: any[];
  page: [number, number] | number;
  firstSize?: number;
}
interface Props {
  className?: string;
  totalPages: number;
  datasource: DataSource;
  onTurning: (page: number, sid: number) => void;
  children: (list: any[]) => ReactNode;
}
interface State extends DataSource {
  reclaiming?: number;
  loadingState: '' | 'next' | 'prev' | 'next-reclaiming' | 'prev-reclaiming';
}

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
    const {list, page, firstSize, loadingState} = prevState;
    if (loadingState === 'next-reclaiming' || loadingState === 'prev-reclaiming') {
      return null;
    }
    if (datasource.sid > prevState.sid) {
      return {loadingState: '', reclaiming: 0, ...datasource, sid: datasource.sid + 1};
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

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  // getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
  //   const curLoadingState = this.state.loadingState;
  //   const prevLoadingState = prevState.loadingState;
  //   if (
  //     curLoadingState === 'prev-reclaiming' ||
  //     curLoadingState === 'next-reclaiming' ||
  //     prevLoadingState === 'prev-reclaiming' ||
  //     prevLoadingState === 'next-reclaiming'
  //   ) {
  //     const list = this.listRef.current;
  //     return [list.scrollHeight, list.scrollTop];
  //   }
  //   return null;
  // }

  // componentDidUpdate(prevProps: Props, prevState: State, snapshot: [number, number]) {
  //   const curLoadingState = this.state.loadingState;
  //   const prevLoadingState = prevState.loadingState;
  //   const {list, reclaiming} = this.state;
  //   if (
  //     curLoadingState === 'prev-reclaiming' ||
  //     curLoadingState === 'next-reclaiming' ||
  //     prevLoadingState === 'prev-reclaiming' ||
  //     prevLoadingState === 'next-reclaiming'
  //   ) {
  //     const [prevScrollHeight, prevScrollTop] = snapshot;
  //     const ul = this.listRef.current;
  //     if (curLoadingState === 'prev-reclaiming') {
  //       ul.scrollTop = prevScrollTop + (ul.scrollHeight - prevScrollHeight);
  //       // eslint-disable-next-line react/no-did-update-set-state
  //       this.setState({loadingState: '', list: list.slice(0, reclaiming), reclaiming: undefined});
  //     } else if (curLoadingState === 'next-reclaiming') {
  //       // eslint-disable-next-line react/no-did-update-set-state
  //       this.setState({loadingState: '', list: list.slice(list.length - (reclaiming || 0)), reclaiming: undefined});
  //     } else if (prevLoadingState === 'next-reclaiming') {
  //       ul.scrollTop = prevScrollTop - (prevScrollHeight - ul.scrollHeight);
  //     }
  //   }
  // }

  getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
    const curLoadingState = this.state.loadingState;
    const prevLoadingState = prevState.loadingState;
    if (curLoadingState === 'next' || prevLoadingState === 'prev') {
      const list = this.listRef.current;
      return [list.scrollHeight, list.scrollTop];
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: [number, number]) {
    const curLoadingState = this.state.loadingState;
    const prevLoadingState = prevState.loadingState;
    if (curLoadingState === 'next' || prevLoadingState === 'prev') {
      const [prevScrollHeight, prevScrollTop] = snapshot;
      const ul = this.listRef.current;
      if (curLoadingState === 'next') {
        ul.scrollTop = prevScrollTop - (prevScrollHeight - ul.scrollHeight);
      } else if (prevLoadingState === 'prev') {
        ul.scrollTop = prevScrollTop + (ul.scrollHeight - prevScrollHeight);
      }
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

  render() {
    const {className, children, totalPages} = this.props;
    const {page, list} = this.state;
    const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
    return (
      <ScrollView
        ref={this.listRef}
        className={`g-scroll-view ${className}`}
        style={{height: '100%'}}
        scrollY
        onScrollToLower={this.onScrollToLower}
        onScrollToUpper={this.onScrollToUpper}
      >
        {firstPage > 1 && (
          <View style={{fontSize: '12px', textAlign: 'center'}} className="loading">
            loading...
          </View>
        )}
        {children(list || [])}
        {secondPage < totalPages ? (
          <View style={{fontSize: '12px', textAlign: 'center'}} className="loading">
            loading...
          </View>
        ) : (
          <View style={{fontSize: '12px', textAlign: 'center'}} className="loading">
            没有更多
          </View>
        )}
      </ScrollView>
    );
  }
}

export default Component;
