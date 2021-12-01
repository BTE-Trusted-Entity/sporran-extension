import { Route, Routes } from 'react-router-dom';

import { AuthorizeDApp } from '../AuthorizeDApp/AuthorizeDApp';
import { SaveCredential } from '../SaveCredential/SaveCredential';
import { ShareCredential } from '../ShareCredential/ShareCredential';
import { SignDApp } from '../SignDApp/SignDApp';
import { paths } from '../paths';

export function PopupsRouter(): JSX.Element {
  return (
    <Routes>
      <Route path={paths.popup.authorize} element={<AuthorizeDApp />} />
      <Route path={paths.popup.save} element={<SaveCredential />} />
      <Route path={paths.popup.share} element={<ShareCredential />} />
      <Route path={paths.popup.sign} element={<SignDApp />} />
    </Routes>
  );
}
