import React from 'react';
import {DocumentHead, Dispatch} from '@medux/react-web-router';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';

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
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
      <p>photos</p>
    </div>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.photos!;
  return {subView: appState.route.params};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
