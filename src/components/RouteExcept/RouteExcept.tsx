import { Route, Routes, Switch } from 'react-router-dom';

interface Props {
  path: string | string[];
  children: JSX.Element;
}

export function RouteExcept({ path, children }: Props): JSX.Element {
  return (
    <Routes>
      <Route path={path} />
      <Route>{children}</Route>
    </Routes>
  );
}
