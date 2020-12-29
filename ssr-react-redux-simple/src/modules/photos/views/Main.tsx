import React from 'react';
import {connect, DocumentHead, Dispatch} from '@medux/react-web-router';
import Loading from 'assets/imgs/loading48x48.gif';

interface StoreProps {
  count: number;
  age: number;
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({dispatch, count, age}) => {
  return (
    <div>
      <DocumentHead>
        <title>photos</title>
        <style>{`body{background:blue}`}</style>
      </DocumentHead>
      <div onClick={() => dispatch(Modules.photos.actions.add())}>
        photos{count}, {age}
      </div>
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photos!;
  return {subView: appState.route.params, count: thisModule.count, age: thisModule.age};
}

export default connect(mapStateToProps)(React.memo(Component));
