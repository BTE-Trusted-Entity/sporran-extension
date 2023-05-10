import { JSX } from 'react';
import { Route, Switch } from 'react-router-dom';

interface Props {
  path: string | string[];
  children: JSX.Element;
}

export function RouteExcept({ path, children }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={path} />
      <Route>{children}</Route>
    </Switch>
  );
}
