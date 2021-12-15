import { render, screen } from '../../testing/testing';
import {
  getCredential,
  getCredentialDownload,
} from '../../utilities/credentials/credentials';
import {
  credentialsMock,
  mockAttestation,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

jest.mock('../../utilities/credentials/credentials');

describe('SaveCredential', () => {
  it('should render', async () => {
    (getCredential as jest.Mock).mockReturnValue(credentialsMock[0]);
    (getCredentialDownload as jest.Mock).mockReturnValue({
      name: 'Email-Trusted Entity attester.json',
      url: 'data:text/json;base64,eyJyZXF1ZXN0Ijp7ImNsYWltIjp7ImNUeXBlSGFzaCI6IjB4MzI5MWJiMTI2ZTMzYjQ4NjJkNDIxYmZhYTFkMmYyNzJlNmNkZmM0Zjk2NjU4OTg4ZmJjZmZlYTg5MTRiZDlhYyIsImNvbnRlbnRzIjp7IkVtYWlsIjoibW9ja0VtYWlsQG1vY2subW9jayJ9LCJvd25lciI6ImRpZDpraWx0OmxpZ2h0OjAwNHJya2lSVFpnc2d4akpERmtMc2l2cXFLVHFkVVR1eEtrM0ZYM21LRkFlTXhzUjUxIn0sImNsYWltSGFzaGVzIjpbIjB4MTQ0NTk3ZDI4NDVlMzI1ZGZmZDRlNTFhOTRlM2U5YzA0YjUyZGMxNTczZTY2YWZjNjkzODQ2ZDkxZjMxYTcxMyIsIjB4MzE3N2VhNDFmNzZkMDY2ZDE5MTIzYzJjYjBkZTEzYTM3ZDYzOTA2ZDJjNTE5ZTM2ZmJmZDc3NzNmYWMxYjcxOCIsIjB4OWQyZGNhZjUyMzhkNmJjNGJjZjAzMjhhZWRiMTY4OTQzNmUwNzdlYmY2MTk4YjZjNGU5NjE2NjQ4MDdlYWVkZiIsIjB4Y2VlMTkzZmZkZmE2MzQ4NzkwN2RmZTA4NDhhZTE1MGQ0YTcxOTZjYzFlM2Q1YmQyYzg5YmVjYjU0MDJlZmMwNyJdLCJjbGFpbU5vbmNlTWFwIjp7IjB4NTc0NThhNjk3MmU3ODIyM2NkNGY3ZjRjNTkyMzZlYTc2ZjM4N2FlNTcxYWI3ZTc5NDYwZjU2ZjJhYTk3NjIzZiI6ImQwYzlkNjQ3LTQyZWYtNGQ0NC1iNjAzLTNiNzc2MjYwYTZkZCIsIjB4Y2VmZTJiODhkMTA4MzQ4NjlkYWQzZThkNzMwNmY1YWE5OWExZjA3ODIxNGFkZWFlNzljYmVlZDMwM2U2MzhhZiI6IjZiNjIzMDhjLTg1NTctNGI2MS1hYzAyLThmOTA1NTU1ZDY3YiIsIjB4OGJlMzJkN2U5Y2M1MDE1YmY3MWI1YzQ1NTUwYTg3OTBjNDNiOWEyNmRiZmE5YTg1MjM4NzEyMTE3NDVkMzNhMyI6IjI0NzM5NGMwLWQ0NmItNDgyYS1iMGM1LTQ5M2FlYjUwNmQ2MSIsIjB4MTM2MWE3YmE3NTEyNTZlOWFjNmIzZTNlMjQ5MTJlNTBlNjhiZWY2NzhjNTEzMmMxMWM5NTY3ODIyMGUzYmY1ZSI6IjA3Yjk1ZjE3LTNmMjMtNGE5ZS04ZjQzLTMzODgxMjczNjgyYyJ9LCJsZWdpdGltYXRpb25zIjpbXSwiZGVsZWdhdGlvbklkIjpudWxsLCJyb290SGFzaCI6IjB4YmU3ZmNjN2FhMDE4NmIwNWZkMTE2YzEwMGUyZDY3M2ZiOTUxMTYzNjkzNzg4NjQwY2U2MDMyYWQyZjcwMGRhZSJ9LCJuYW1lIjoiRW1haWwgQ3JlZGVudGlhbEJsYWgiLCJjVHlwZVRpdGxlIjoiRW1haWwiLCJhdHRlc3RlciI6IlRydXN0ZWQgRW50aXR5IGF0dGVzdGVyIiwiaXNBdHRlc3RlZCI6dHJ1ZX0=',
    });

    const { container } = render(
      <PopupTestProvider path={paths.popup.save} data={mockAttestation}>
        <SaveCredential />
      </PopupTestProvider>,
    );

    await screen.findByText('Trusted Entity attester');

    expect(container).toMatchSnapshot();
  });
});
