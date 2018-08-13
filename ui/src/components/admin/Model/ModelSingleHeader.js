import React from 'react';
import Popup from 'reactjs-popup';

import { ModelSingleContext } from './ModelSingleController';
import { manageModelsUrlBase } from '../AdminNav';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import AdminModelPublishIcon from 'icons/AdminModelPublishIcon';
import AdminModelSaveIcon from 'icons/AdminModelSaveIcon';
import AdminModelMoreOptionsIcon from 'icons/AdminModelMoreOptionsIcon';

import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { ModelHeaderH1, ModelHeaderBackLink } from 'theme/adminModelStyles';
import { SmallPill, Pill, ActionsMenu, ActionsMenuItem } from 'theme/adminControlsStyles';

const headerText = (modelName = null, error = null) => {
  // Default is the create state text
  let text = 'Create a Model';

  // Error text
  if (error) {
    switch (error.response.status) {
      case '404':
        text = 'Model {modelName} not found';
        break;
      default:
        text = 'Error loading {modelName}';
    }
  }

  // If a model name is provided, and no error is present ...
  if (modelName) {
    text = modelName;
  }

  return <ModelHeaderH1>{text}</ModelHeaderH1>;
};

const modelStatus = (data = null) => {
  if (!data) {
    return <SmallPill warning>Unsaved Changes</SmallPill>;
  }

  // Additional statuses here

  // Temp
  return <SmallPill warning>Unsaved Changes</SmallPill>;
};

const modelMoreOptions = (data = null) =>
  data && (
    <Popup
      trigger={
        <Pill secondary marginLeft="10px">
          <AdminModelMoreOptionsIcon css={'margin: 0;'} width={15} height={3} />
        </Pill>
      }
      position="bottom right"
      offset={0}
      on="click"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{
        padding: '0px',
        border: 'none',
        borderRadius: '10px',
        width: 'max-content',
      }}
      arrow={false}
    >
      <ActionsMenu>
        <ActionsMenuItem>Publish</ActionsMenuItem>
        <ActionsMenuItem>Delete</ActionsMenuItem>
      </ActionsMenu>
    </Popup>
  );

const isFormReady = errors => Object.keys(errors).length === 0;

export default ({ modelName }) => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        data: { response, error },
        form: { isReadyToSave, isReadyToPublish },
      },
    }) => (
      <AdminHeader>
        <AdminHeaderBlock>
          {headerText(modelName, error)}
          {modelStatus(response || null)}
        </AdminHeaderBlock>
        <AdminHeaderBlock>
          <ModelHeaderBackLink to={manageModelsUrlBase}>
            <ArrowLeftIcon height={9} width={5} /> Back to List
          </ModelHeaderBackLink>
          <Pill disabled={!isReadyToPublish} marginLeft="21px" marginRight="10px">
            <AdminModelPublishIcon css={'margin-right: 10px;'} height={16} width={15} />Publish
          </Pill>
          <Pill primary disabled={!isReadyToSave}>
            <AdminModelSaveIcon css={'margin-right: 8px;'} height={14} width={14} />Save
          </Pill>
          {modelMoreOptions(response || null)}
        </AdminHeaderBlock>
      </AdminHeader>
    )}
  </ModelSingleContext.Consumer>
);
