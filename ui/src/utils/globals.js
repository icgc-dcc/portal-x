let globals = ['VERSION', 'API_URL', 'ES_URL'];

export default globals.reduce(
  (acc, val) => ({
    ...acc,
    [val]: localStorage[val] || process.env[`REACT_APP_${val}`],
  }),
  { SETS_KEY: 'hcmiSets' },
);
