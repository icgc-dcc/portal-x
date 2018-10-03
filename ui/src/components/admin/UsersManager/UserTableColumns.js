import React from 'react';
import Moment from 'react-moment';
import Popup from 'reactjs-popup';
import withDeleteModal from '../DeleteModal';
import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import DeleteIcon from 'icons/TrashIcon';
import { ModalStateContext } from 'providers/ModalState';
import { schemaArr } from '../schema/user';
import { ActionPill, Actions, ToolbarText } from '../../../theme/adminTableStyles';
import UserForm from './UserForm';
import { AdminModalStyle } from 'theme/adminModalStyles';

const selectedColumns = ['name', 'email', 'status', 'createdAt', 'updatedAt'];

export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

const userManagerCustomColumns = ({ deleteUser, saveUser }) => [
  {
    Header: 'Created',
    accessor: 'createdAt',
    Cell: row => {
      const value = row.value;
      return (
        <Popup
          trigger={() => <Moment fromNow>{value}</Moment>}
          position="top"
          offset={0}
          on="hover"
          mouseLeaveDelay={30}
          mouseEnterDelay={10}
          contentStyle={{
            padding: '0px',
            border: 'none',
            width: 'max-content',
          }}
          arrow={true}
        >
          <ToolbarText>
            <Moment parse="YYYY-MM-DD HH:mm">{value}</Moment>
          </ToolbarText>
        </Popup>
      );
    },
  },
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    Cell: row => {
      const value = row.value;
      return (
        <Popup
          trigger={() => <Moment fromNow>{value}</Moment>}
          position="top"
          offset={0}
          on="hover"
          mouseLeaveDelay={30}
          mouseEnterDelay={10}
          contentStyle={{
            padding: '0px',
            border: 'none',
            width: 'max-content',
          }}
          arrow={true}
        >
          <ToolbarText>
            <Moment parse="YYYY-MM-DD HH:mm">{value}</Moment>
          </ToolbarText>
        </Popup>
      );
    },
  },
  {
    Header: 'Actions',
    accessor: 'name',
    Cell: ({ original: { _id, name, email, status } }) => {
      return (
        <Actions>
          <ModalStateContext.Consumer>
            {modalState => (
              <ActionPill
                secondary
                marginRight="6px"
                onClick={() =>
                  modalState.setModalState({
                    component: (
                      <UserForm
                        type={'edit'}
                        user={{ id: _id, name, email, status }}
                        saveUser={saveUser}
                      />
                    ),
                    shouldCloseOnOverlayClick: true,
                    styles: AdminModalStyle,
                  })
                }
              >
                <AdminEditPencilIcon
                  css={`
                    width: 12px;
                    height: 12px;
                  `}
                />Edit
              </ActionPill>
            )}
          </ModalStateContext.Consumer>
          {withDeleteModal({
            next: () => deleteUser({ id: _id }),
            target: `${name}(${email})`,
          })(
            <ActionPill secondary marginRight="6px">
              <DeleteIcon
                css={`
                  width: 12px;
                  height: 12px;
                  font-weight: normal;
                `}
              />
              Delete
            </ActionPill>,
          )}
        </Actions>
      );
    },
  },
];

export const getUserTableColumns = ({ deleteUser, saveUser }) =>
  columns
    .filter(col => ['name', 'email', 'status'].includes(col.accessor))
    .concat(userManagerCustomColumns({ deleteUser, saveUser }));
