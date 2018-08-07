import React from 'react';

import ModelSingleProvider, { ModelSingleContext } from './ModelSingleController';
import config from '../config';

import AdminModelNav from './AdminModelNav';
import ModelForm from './ModelForm';
import ModelImages from './ModelImages';
import ModelVariants from './ModelVariants';

import { AdminContainer, AdminHeader } from 'theme/adminStyles';
import { AdminModelContent } from 'theme/adminModelStyles';
import { Row } from 'theme/system';

const renderTab = tab => {
  switch (tab) {
    case 'edit':
      return <ModelForm />;
    case 'images':
      return <ModelImages />;
    case 'variants':
      return <ModelVariants />;
    default:
      return <ModelForm />;
  }
};

export default ({ match }) => (
  <ModelSingleProvider baseUrl={config.urls.modelBase} modelName={match.params.name}>
    <ModelSingleContext.Consumer>
      {({
        state: {
          ui: { activeTab },
        },
      }) => (
        <AdminContainer>
          <AdminHeader>
            <div>
              <h1>Header Content</h1>
            </div>
          </AdminHeader>
          <Row>
            <AdminModelNav />
            <AdminModelContent>{renderTab(activeTab)}</AdminModelContent>
          </Row>
        </AdminContainer>
      )}
    </ModelSingleContext.Consumer>
  </ModelSingleProvider>
);
