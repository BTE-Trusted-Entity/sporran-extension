import { debounceAsync } from './debounceAsync';

const callback = jest.fn().mockImplementation(async (i: number) => i * 2);
const debounced = debounceAsync<typeof callback>(callback);

describe('debounceAsync', () => {
  it('should return results normally', async () => {
    callback.mockClear();
    expect(await debounced(1)).toEqual(2);
  });

  it('should prevent parallel requests', async () => {
    callback.mockClear();

    debounced(1);
    debounced(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow sequential calls', async () => {
    callback.mockClear();
    expect(await debounced(1)).toEqual(2);
    expect(await debounced(2)).toEqual(4);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
