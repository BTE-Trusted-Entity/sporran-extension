import { renderHook } from '@testing-library/react-hooks';

import { useInterval } from './useInterval';

const mockCallback = jest.fn();

jest.useFakeTimers();

describe('useInterval', () => {
  it('callback should be called after each interval', () => {
    renderHook(() => useInterval(mockCallback, 1 * 60 * 1000));
    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5 * 60 * 1000);

    expect(mockCallback).toHaveBeenCalledTimes(5);
  });

  it('should not be called after unmounting', () => {
    mockCallback.mockReset();
    const { unmount } = renderHook(() =>
      useInterval(mockCallback, 1 * 60 * 1000),
    );
    jest.advanceTimersByTime(5 * 60 * 1000);

    expect(mockCallback).toHaveBeenCalledTimes(5);

    unmount();
    jest.advanceTimersByTime(10 * 60 * 1000);

    expect(mockCallback).toHaveBeenCalledTimes(5);
  });
});
