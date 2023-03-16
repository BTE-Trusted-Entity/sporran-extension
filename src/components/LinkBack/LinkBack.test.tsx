import { MemoryRouter, Route } from 'react-router-dom';

import { render } from '../../testing/testing';
import { generatePath, paths } from '../../views/paths';

import { LinkBack } from './LinkBack';

describe('LinkBack', () => {
  it('should render as button', async () => {
    const { container } = render(<LinkBack />);
    expect(container).toMatchSnapshot();
  });

  it('should render as link', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.remove, { address: 'FOO' }),
        ]}
      >
        <Route path={paths.identity.remove}>
          <LinkBack to={paths.identity.overview} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
