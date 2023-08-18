import { PropsWithChildren } from 'react';
import { Route, Switch } from 'react-router-dom';

interface Props {
  path: string | string[];
}

export function RouteExcept({ path, children }: PropsWithChildren<Props>) {
  return (
    <Switch>
      <Route path={path} />
      <Route>{children}</Route>
    </Switch>
  );
}
