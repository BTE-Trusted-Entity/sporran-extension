import { Route, Routes } from 'react-router-dom';

interface Props {
  path: string;
  children: JSX.Element;
}

export function RouteExcept({ path, children }: Props): JSX.Element {
  return (
    <Routes>
      <Route path={path} />
      <Route element={children} />
    </Routes>
  );
}
