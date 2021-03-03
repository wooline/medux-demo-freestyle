import * as React from 'react';

export enum IconClass {
  LIVE = 'icon-live',
  MESSAGE = 'icon-message',
  PICTURE = 'icon-picture',
  PLAY_CIRCLE = 'icon-play-circle',
  RELOAD = 'icon-reload',
  LOCATION = 'icon-location',
  HEART = 'icon-heart',
}

interface Props {
  type: IconClass;
  className?: string;
  text?: string;
  textPosition?: 'left' | 'right';
}

export default class Component extends React.PureComponent<Props> {
  public render() {
    const {type, text, textPosition, className, ...restProps} = this.props;
    if (text) {
      if (textPosition === 'left') {
        return (
          <div className={`iconfont-with-text-on-left ${className || ''}`} {...restProps}>
            <span>{text}</span>
            <i className={`iconfont ${type}`} {...restProps} />
          </div>
        );
      }
      return (
        <div className={`iconfont-with-text-on-right ${className || ''}`} {...restProps}>
          <i className={`iconfont ${type}`} {...restProps} />
          <span>{text}</span>
        </div>
      );
    }
    return <i className={`iconfont ${type} ${className || ''}`} {...restProps} />;
  }
}
