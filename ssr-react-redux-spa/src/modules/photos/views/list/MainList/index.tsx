import React from 'react';
import {DocumentHead, Dispatch} from '@medux/react-web-router';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import {api, ListItem, ListSearch, ListSummary, RouteParams} from 'modules/photos/entity';

interface StoreProps {
  listSearch?: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
}
interface DispatchProps {
  dispatch: Dispatch;
}
const Component: React.FC<StoreProps & DispatchProps> = ({list = []}) => {
  return (
    <div>
      <DocumentHead>
        <title>photos</title>
      </DocumentHead>
      {list.map((item) => (
        <div key={item.id} className="g-pre-img">
          <div style={{backgroundImage: `url(${item.coverUrl})`}}>
            <h5 className="title">{item.title}</h5>
            <div className="listImg" />
            <div className="props">
              {item.departure}
              {item.type}
            </div>
            <div className="desc">
              <span className="hot">
                人气1(<strong>{item.hot}</strong>)
              </span>
              <em className="price">
                <span className="unit">￥</span>
                {item.price}
              </em>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photos!;
  const {listSearch, list, listSummary} = thisModule;
  return {listSearch, list, listSummary};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
