export function reducer(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) {
  if (!key && !descriptor) {
    key = target.key;
    descriptor = target.descriptor;
  }
  const fun = descriptor.value;
  fun.__actionName__ = key;
  fun.__isReducer__ = true;
  descriptor.enumerable = true;
  return target.descriptor === descriptor ? target : descriptor;
}
const split = typeof window === 'undefined' ? '.' : ',';

export class Test {
  name: string;

  constructor() {
    this.name = 'jimmy';
  }

  @reducer
  getList() {
    return {};
  }

  @reducer
  ['get.List2']() {
    return {};
  }
}
