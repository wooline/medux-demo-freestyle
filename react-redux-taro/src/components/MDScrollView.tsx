import React, {ReactNode, RefObject, PureComponent} from 'react';
import {ScrollView, View} from '@tarojs/components';

interface DataSource {
  list: any[];
  page: [number, number] | number;
  firstSize?: number;
}
interface Props {
  className?: string;
  totalPages: number;
  datasource: DataSource | null;
  onTurning: (page: number, sid: number) => void;
  children: (list: any[]) => ReactNode;
}
interface State extends DataSource {
  datasource?: DataSource;
  reclaiming?: number;
  loadingState: '' | 'next' | 'prev' | 'next-reclaiming' | 'prev-reclaiming';
}

let sid = 0;

class Component extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    if (nextProps.datasource && nextProps.datasource !== prevState.datasource) {
      const datasource = nextProps.datasource;
      const {list, page, firstSize, loadingState} = prevState;
      if (loadingState === 'next-reclaiming' || loadingState === 'prev-reclaiming') {
        return null;
      }
      if (!prevState.datasource || typeof datasource.page === 'object') {
        return {datasource, loadingState: '', reclaiming: 0, ...datasource};
      }
      const [firstPage, secondPage] = typeof page === 'object' ? page : [page, page];
      const [firstList, secondList] = typeof page === 'object' ? [list.slice(0, firstSize), list.slice(firstSize)] : [list, list];
      if (datasource.page === firstPage - 1) {
        return {
          datasource,
          loadingState: 'prev-reclaiming',
          page: [datasource.page, firstPage],
          list: [...datasource.list, ...list],
          firstSize: datasource.list.length,
          reclaiming: datasource.list.length + firstList.length,
        };
      }
      if (datasource.page === secondPage + 1) {
        return {
          datasource,
          loadingState: 'next-reclaiming',
          page: [secondPage, datasource.page],
          list: [...list, ...datasource.list],
          firstSize: secondList.length,
          reclaiming: datasource.list.length + secondList.length,
        };
      }
      return {datasource, loadingState: '', reclaiming: 0, ...datasource};
    }
    return null;
  }

  state: State = {
    list: [],
    page: 0,
    loadingState: '',
  };

  listRef: RefObject<any>;

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
    const curLoadingState = this.state.loadingState;
    const prevLoadingState = prevState.loadingState;
    if (
      curLoadingState === 'prev-reclaiming' ||
      curLoadingState === 'next-reclaiming' ||
      prevLoadingState === 'prev-reclaiming' ||
      prevLoadingState === 'next-reclaiming'
    ) {
      const list = this.listRef.current;
      return [list.scrollHeight, list.scrollTop];
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: [number, number]) {
    const curLoadingState = this.state.loadingState;
    const prevLoadingState = prevState.loadingState;
    const {list, reclaiming} = this.state;
    if (
      curLoadingState === 'prev-reclaiming' ||
      curLoadingState === 'next-reclaiming' ||
      prevLoadingState === 'prev-reclaiming' ||
      prevLoadingState === 'next-reclaiming'
    ) {
      const [prevScrollHeight, prevScrollTop] = snapshot;
      const ul = this.listRef.current;
      if (curLoadingState === 'prev-reclaiming') {
        ul.scrollTop = prevScrollTop + (ul.scrollHeight - prevScrollHeight);
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({loadingState: '', list: list.slice(0, reclaiming), reclaiming: undefined});
      } else if (curLoadingState === 'next-reclaiming') {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({loadingState: '', list: list.slice(list.length - (reclaiming || 0)), reclaiming: undefined});
      } else if (prevLoadingState === 'next-reclaiming') {
        ul.scrollTop = prevScrollTop - (prevScrollHeight - ul.scrollHeight);
      }
    }
  }

  onScrollToLower = () => {
    const {loadingState, page} = this.state;
    if (loadingState === '' || loadingState === 'prev') {
      const [, secondPage] = typeof page === 'object' ? page : [page, page];
      if (secondPage < this.props.totalPages) {
        this.setState({loadingState: 'next'});
        sid = Date.now();
        this.props.onTurning(secondPage + 1, sid);
      }
    }
  };

  onScrollToUpper = () => {
    const {loadingState, page} = this.state;
    if (loadingState === '' || loadingState === 'next') {
      const [firstPage] = typeof page === 'object' ? page : [page, page];
      if (firstPage > 1) {
        this.setState({loadingState: 'prev'});
        sid = Date.now();
        this.props.onTurning(firstPage - 1, sid);
      }
    }
  };

  render() {
    const {className, children} = this.props;
    const {loadingState, list} = this.state;
    return (
      <ScrollView
        ref={this.listRef}
        className={`g-scroll-view ${className}`}
        style={{height: '100%'}}
        scrollY
        onScrollToLower={this.onScrollToLower}
        onScrollToUpper={this.onScrollToUpper}
      >
        {loadingState === 'prev' && (
          <View style={{fontSize: '24px'}} className="loading">
            loading...
          </View>
        )}
        {children(list || [])}
        {loadingState === 'next' && (
          <View style={{fontSize: '24px'}} className="loading">
            loading...
          </View>
        )}
      </ScrollView>
    );
  }
}

// const Component: React.FC<Props> = ({children, datasource, totalPages, onTurning, className = ''}) => {
//   const [loadingState, setLoadingState] = useState<'' | 'next' | 'prev'>('');
//   const [realDatasource, setRealDatasource] = useState(datasource);

//   useMemo(() => {
//     if (realDatasource === datasource) {
//       return;
//     }
//     setLoadingState('');
//     if (typeof datasource.page === 'object') {
//       setRealDatasource(datasource);
//       return;
//     }
//     const [firstPage, secondPage] = typeof realDatasource.page === 'object' ? realDatasource.page : [realDatasource.page, realDatasource.page];
//     const [firstList, secondList] =
//       typeof realDatasource.page === 'object'
//         ? [realDatasource.list.slice(0, realDatasource.firstSize), realDatasource.list.slice(realDatasource.firstSize)]
//         : [realDatasource.list, realDatasource.list];

//     if (datasource.page === firstPage - 1) {
//       setRealDatasource({
//         page: [datasource.page, firstPage],
//         list: [...datasource.list, ...firstList],
//         firstSize: datasource.list.length,
//       });
//       return;
//     }
//     if (datasource.page === secondPage + 1) {
//       setRealDatasource({
//         page: [secondPage, datasource.page],
//         list: [...secondList, ...datasource.list],
//         firstSize: secondList.length,
//       });
//       return;
//     }
//     setRealDatasource(datasource);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [datasource]);

//   const onScrollToLower = useCallback(() => {
//     if (loadingState !== 'next') {
//       const [, secondPage] = typeof realDatasource.page === 'object' ? realDatasource.page : [realDatasource.page, realDatasource.page];
//       if (secondPage < totalPages) {
//         setLoadingState('next');
//         onTurning(secondPage + 1);
//       }
//     }
//   }, [loadingState, realDatasource.page, totalPages, onTurning]);
//   const onScrollToUpper = useCallback(() => {
//     if (loadingState !== 'prev') {
//       const [firstPage] = typeof realDatasource.page === 'object' ? realDatasource.page : [realDatasource.page, realDatasource.page];
//       if (firstPage > 1) {
//         setLoadingState('prev');
//         onTurning(firstPage - 1);
//       }
//     }
//   }, [loadingState, realDatasource.page, onTurning]);
//   return (
//     <ScrollView
//       className={`g-scroll-view ${className}`}
//       style={{height: '100%'}}
//       scrollY
//       onScrollToLower={onScrollToLower}
//       onScrollToUpper={onScrollToUpper}
//     >
//       {loadingState === 'prev' && (
//         <View style={{fontSize: '24px'}} className="loading">
//           loading...
//         </View>
//       )}
//       {children(realDatasource.list)}
//       {loadingState === 'next' && (
//         <View style={{fontSize: '24px'}} className="loading">
//           loading...
//         </View>
//       )}
//     </ScrollView>
//   );
// };

export default Component;
