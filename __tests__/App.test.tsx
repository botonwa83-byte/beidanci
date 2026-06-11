/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shiped with jest.
import {it, beforeEach, afterEach, jest} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer, {act} from 'react-test-renderer';

// App 挂载后有异步认证加载与开屏动画/定时器。用 fake timers 避免定时器在
// 测试结束、Jest 环境拆除后才触发（否则会报 "import after environment torn down"）。
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

it('renders correctly', async () => {
  let tree: renderer.ReactTestRenderer | undefined;
  // await act(async) 会 flush 挂起的 effect 与 promise（如认证加载），避免竞态。
  await act(async () => {
    tree = renderer.create(<App />);
  });
  act(() => {
    tree?.unmount();
  });
});
