import React from 'react';
import {DocumentHead, Dispatch} from '@medux/react-web-router';

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({dispatch}) => {
  return (
    <div>
      <DocumentHead>
        <title>photos</title>
        <style>{`body{background:blue}`}</style>
      </DocumentHead>
      photos
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photos!;
  return {subView: appState.route.params};
}

export default connect(mapStateToProps)(React.memo(Component));
