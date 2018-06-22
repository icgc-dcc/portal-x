import React from 'react';
import ModelListModal from 'components/modals/ModelListModal';
import { SelectedModelsContext } from 'providers/SelectedModels';
import { ModalStateContext } from 'providers/ModalState';
import styles from 'theme/modelListStyles';
import modelListModalStyles from 'theme/modelListModalStyles';

export default ({ className }) => (
  <ModalStateContext.Consumer>
    {modalState => (
      <SelectedModelsContext.Consumer>
        {selected => {
          const selectedCount = selected.state.modelIds.length;
          const hasSelected = selectedCount > 0;
          return (
            <div css={styles}>
              <div
                className={`model-list-icon ${hasSelected ? 'not-empty' : ''} ${className}`}
                onClick={() =>
                  modalState.setModalState({
                    component: <ModelListModal />,
                    styles: modelListModalStyles,
                    shouldCloseOnOverlayClick: true,
                  })
                }
              >
                {hasSelected && <span className="count">{selectedCount}</span>}
              </div>
            </div>
          );
        }}
      </SelectedModelsContext.Consumer>
    )}
  </ModalStateContext.Consumer>
);
