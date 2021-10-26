const proxy = new Proxy(
  {},
  {
    get: (target, key) => Module[key] || key,
  },
);

const Module = {
  __esModule: true,
  default: proxy,
};

module.exports = proxy;
