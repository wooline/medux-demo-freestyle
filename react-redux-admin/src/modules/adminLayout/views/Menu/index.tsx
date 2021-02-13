import React from 'react';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import {Menu} from 'antd';
import {DashboardOutlined, ProfileOutlined, TeamOutlined} from '@ant-design/icons';
import ListKeyLink from 'components/ListKeyLink';
import {MenuItem} from '../../entity';
import styles from './index.m.less';

const Icons = {
  dashboard: DashboardOutlined,
  user: TeamOutlined,
  post: ProfileOutlined,
};
const {SubMenu} = Menu;

function matchPagename(pagename: string, key: string): boolean {
  return pagename === key;
}
function getSelectedMenuKeys(leaves: {[key: string]: string[]}, pagename: string, alias: {[key: string]: string}, lastedOpenKeys: string[]) {
  const selectedKeys = Object.keys(leaves).filter((key) => matchPagename(pagename, key));
  if (selectedKeys.length) {
    const selected = alias[selectedKeys[0]] || selectedKeys[0];
    const openKeys = lastedOpenKeys.length ? Array.from(new Set([...lastedOpenKeys, ...leaves[selected]])) : leaves[selected];
    return {selectedKey: selected, openKeys};
  }
  return {selectedKey: '', openKeys: lastedOpenKeys};
}

function mapMenuData(menus: MenuItem[]): {leaves: {[key: string]: string[]}; folders: {[key: string]: string[]}; alias: {[key: string]: string}} {
  const maps: {[key: string]: string[]} = {};
  const leaves: string[] = [];
  const folders: string[] = [];
  const alias: {[key: string]: string} = {};
  const checkData = (item: MenuItem, parent?: string) => {
    const keys = typeof item.keys === 'string' ? [item.keys] : [...item.keys];
    const path = keys.shift() as string;
    if (!maps[path]) {
      maps[path] = [];
    }
    if (parent) {
      maps[path].push(parent, ...maps[parent]);
    }
    if (item.children && item.children.length) {
      item.children.forEach((subItem) => checkData(subItem, path));
      folders.push(path);
    } else {
      leaves.push(path);
      if (keys.length) {
        keys.forEach((key) => {
          alias[key] = path;
          maps[key] = maps[path];
          leaves.push(key);
        });
      }
    }
  };
  menus.forEach((menuItem) => checkData(menuItem));
  return {
    alias,
    leaves: leaves.reduce((pre, cur) => {
      pre[cur] = maps[cur].reverse();
      return pre;
    }, {}),
    folders: folders.reduce((pre, cur) => {
      pre[cur] = [cur, ...maps[cur]].reverse();
      return pre;
    }, {}),
  };
}
function getIcon(icon: string | undefined) {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className="icon sider-menu-item-img" />;
  }
  if (typeof icon === 'string') {
    const Icon = Icons[icon] || DashboardOutlined;
    return <Icon />;
  }
  return icon;
}
function filterDisable(data: MenuItem[]): MenuItem[] {
  return data
    .map((item) => {
      if (item.disable) {
        return null;
      }
      if (item.children) {
        const children = filterDisable(item.children);
        if (children.length) {
          return {...item, children};
        }
        return null;
      }
      return item;
    })
    .filter(Boolean) as any;
}

function generateMenu(menusData: MenuItem[], folderHandler: (item: {key: string}) => void) {
  return menusData.map((item) => {
    const keys = typeof item.keys === 'string' ? [item.keys] : [...item.keys];
    const path = keys.shift() as string;
    const link = item.link || path;
    const {icon, children, target, name} = item;
    if (children && children.length) {
      return (
        <SubMenu
          title={
            icon ? (
              <span>
                {getIcon(icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={path}
          onTitleClick={folderHandler}
        >
          {generateMenu(children, folderHandler)}
        </SubMenu>
      );
    }
    return (
      <Menu.Item key={path}>
        {target ? (
          <a href={link} target={target}>
            {getIcon(icon)} <span>{name}</span>
          </a>
        ) : (
          <ListKeyLink href={link}>
            {getIcon(icon)} <span>{name}</span>
          </ListKeyLink>
        )}
      </Menu.Item>
    );
  });
}
interface StoreProps {
  siderCollapsed: boolean;
  dataSource: MenuItem[];
  pagename: string;
}
interface OwnProps {
  singleOpen?: boolean;
}
interface State {
  menus: MenuItem[];
  dataSource: MenuItem[];
  selectedKey: string;
  openKeys: string[];
  pagename: string;
  alias: {[key: string]: string};
  leaves: {[key: string]: string[]}; // {path:[parent1,parent2]}
  folders: {[key: string]: string[]}; // {path:[parent1,parent2]}
}
class Component extends React.Component<StoreProps & OwnProps, State> {
  // public static defaultProps: PickOptional<StoreProps> = {
  //   match: (pagename: string, key: string) => {
  //     let reg: RegExp;
  //     if (matchCache[key]) {
  //       reg = matchCache[key];
  //     } else {
  //       const arr = key.split(/[?#]/);
  //       reg = pathToRegexp(arr[0]);
  //       matchCache[key] = pathToRegexp(arr[0]);
  //     }
  //     return reg.test(pagename);
  //   },
  // };

  static getDerivedStateFromProps(nextProps: StoreProps & OwnProps, prevState: State): State | null {
    if (nextProps.dataSource.length && nextProps.dataSource !== prevState.dataSource) {
      const menus = filterDisable(nextProps.dataSource);
      const {leaves, folders, alias} = mapMenuData(menus);
      const {dataSource, pagename} = nextProps;
      const {selectedKey, openKeys} = getSelectedMenuKeys(leaves, pagename, alias, []);
      return {
        dataSource,
        menus,
        pagename,
        alias,
        leaves,
        folders,
        selectedKey,
        openKeys,
      };
    }
    if (nextProps.pagename !== prevState.pagename) {
      const {pagename} = nextProps;
      const {leaves, alias, openKeys: lastedOpenKeys, dataSource, menus, folders} = prevState;
      const {selectedKey, openKeys} = getSelectedMenuKeys(leaves, pagename, alias, lastedOpenKeys);
      return {
        dataSource,
        menus,
        alias,
        leaves,
        folders,
        selectedKey,
        openKeys,
        pagename,
      };
    }
    return null;
  }

  constructor(props: StoreProps) {
    super(props);
    this.state = {
      menus: [],
      dataSource: [],
      pagename: '',
      alias: {},
      leaves: {},
      folders: {},
      selectedKey: '',
      openKeys: [],
    };
  }

  shouldComponentUpdate(nextProps: StoreProps, nextState: State) {
    return (
      nextProps.siderCollapsed !== this.props.siderCollapsed ||
      nextState.dataSource !== this.state.dataSource ||
      nextState.openKeys.join(' ') !== this.state.openKeys.join(' ') ||
      nextState.selectedKey !== this.state.selectedKey
    );
  }

  onOpenChange = (openKeys: string[]) => {
    if (!this.props.singleOpen) {
      this.setState({
        openKeys,
      });
    }
  };

  folderHandler = ({key}: {key: string}) => {
    if (this.props.singleOpen) {
      const curOpenKeys = this.state.openKeys;
      let openKeys = [...curOpenKeys];
      const n = openKeys.indexOf(key);
      if (n > -1) {
        openKeys = openKeys.slice(0, n);
      } else {
        openKeys = this.state.folders[key];
      }
      this.setState({
        openKeys,
      });
    }
  };

  public render() {
    const {siderCollapsed} = this.props;
    const {openKeys, selectedKey} = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = siderCollapsed ? {} : {openKeys};
    return (
      <Menu
        className={styles.root}
        key="SiderMenu"
        theme="dark"
        mode="inline"
        onOpenChange={this.onOpenChange as any}
        {...menuProps}
        selectedKeys={[selectedKey]}
      >
        {generateMenu(this.state.menus, this.folderHandler)}
      </Menu>
    );
  }
}

function mapStateToProps(state: APPState): StoreProps {
  return {
    dataSource: state.adminLayout!.menuData || [],
    siderCollapsed: !!state.adminLayout!.siderCollapsed,
    pagename: state.route.pagename,
  };
}

export default connectRedux(mapStateToProps)(Component);
