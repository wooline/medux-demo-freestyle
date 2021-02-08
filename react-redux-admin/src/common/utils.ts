import {message as antdMessage} from 'antd';
import {FormItemProps} from 'antd/lib/form/FormItem';
import {Rule} from 'antd/lib/form';
import moment from 'moment';
import {BaseListSearch} from './resource';

export function arrayToMap<T>(arr: T[], key = 'id'): {[key: string]: T} {
  return arr.reduce((pre, cur) => {
    pre[cur[key]] = cur;
    return pre;
  }, {});
}

export interface FormDecorator<D> {
  dependencies?: D[];
  rules?: Rule[];
  valuePropName?: string;
}

export function getFormDecorators<FormData extends {[key: string]: any}>(
  items: {[key in keyof FormData]: FormDecorator<keyof FormData>}
): {
  [key in keyof FormData]: FormDecorator<keyof FormData> & {
    name: string;
  };
} {
  Object.keys(items).forEach((key) => {
    const item: any = items[key]!;
    item.name = key;
  });

  return items as any;
}

export interface FromItem<D> {
  name: D;
  formItem: FormItemProps['children'];
  label: string;
  rules?: Rule[];
  col?: number;
  cite?: number;
  subscript?: any;
}

export type ListSearchFormData<F, E extends keyof F = never> = Required<Omit<F, E | keyof BaseListSearch>>;
export type FromItemList<FormData> = FromItem<Extract<keyof FormData, string>>[];

export const tips = {
  success: (content: string) => {
    antdMessage.success(content);
  },
  error: (content: string) => {
    const initLoading = document.getElementById('g-init-loading');
    antdMessage.error(content, initLoading ? 9999999 : 3);
  },
};
export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;

export function filterEmpty<T extends {[key: string]: any}>(params: T): T {
  return Object.keys(params).reduce((pre, cur) => {
    let value = params[cur];
    const ntype = typeof value;
    if (ntype === 'string') {
      value = value.trim();
    }
    if (Array.isArray(value) && value.length === 0) {
      pre[cur] = undefined;
      return pre;
    }
    if (ntype === 'number' || ntype === 'boolean' || value) {
      pre[cur] = value;
    } else {
      pre[cur] = undefined;
    }
    return pre;
  }, {}) as T;
}

export function enumOptions<T extends {[key: string]: any}>(data: T, lang?: (prop: string) => string) {
  const options: {value: string | number; label: string}[] = [];
  const labelToValue: Record<string, string | number> = {};
  const valueToLabel: Record<string | number, string> = {};
  const keyToValue: Record<string, string | number> = {};
  const selectSource: {value: string | number; text: string}[] = [];
  Object.keys(data).forEach((prop) => {
    const value: string = data[prop];
    const label = lang ? lang(prop) : prop;
    options.push({label, value});
    selectSource.push({text: label, value});
    (labelToValue as any)[label] = value;
    (valueToLabel as any)[value] = label;
    (keyToValue as any)[prop] = value;
  });
  return {
    labelToValue,
    valueToLabel,
    keyToValue,
    options,
    selectSource,
  };
}
export function reference(..._args: any) {
  // 引用资源防止被打包优化去除
  return true;
}
export function formatDateTime(date: string | number, dateFormat?: string): string {
  return date ? moment(date).format(dateFormat || 'YYYY-MM-DD HH:mm:ss') : '';
}
