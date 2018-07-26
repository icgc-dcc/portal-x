import React from 'react';
import { Route } from 'react-router-dom';

import AdminNav from './AdminNav';
import ModelsManager from './ModelsManager';
import ModelUploadSingle from './ModelUploadSingle';
import UsersManage from './UsersManage';
import { Col } from 'theme/system';
import { AdminMain } from 'theme/adminStyles';

export default ({ location }) => (
  <Col>
    <AdminNav location={location} />
    <AdminMain>
      <Route path="/admin/manage-users" render={() => <UsersManage />} />
      <Route path="/admin/manage-models" render={() => <ModelsManager />} />
      <Route path="/admin/model-upload-single" render={() => <ModelUploadSingle />} />
    </AdminMain>
  </Col>
);
