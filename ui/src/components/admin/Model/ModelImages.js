import React from 'react';
import Dropzone from 'react-dropzone';
import Component from 'react-component-component';

import { ModelSingleContext } from './ModelSingleController';
import { Pill as NavPill } from 'theme/adminNavStyles';
import { HoverPill } from 'theme/adminControlsStyles';
import base from 'theme';
import { Row, Col } from 'theme/system';
import { brandPrimaryHighlightHover } from 'theme/hoverStyles';
import { FormContainer } from 'theme/adminFormStyles';
import { Field, Formik } from 'formik';
import { FormInput } from 'components/FormComponents';

import DragNDropIcon from 'icons/DragNDrop';
import PlusIcon from 'icons/PlusIcon';
import TrashIcon from 'icons/TrashIcon';
import EditIcon from 'icons/EditIcon';
import SaveIcon from 'icons/SaveIcon';
import config from '../config';
import TabHeader from './TabHeader';
const {
  keyedPalette: { crimson, frenchGrey, lightPorcelain, mineShaft, mischka, silver, white },
  fonts: { libreFranklin, openSans },
} = base;

const ImageMetaDataForm = ({ file, editing, setPreviewState, onMetaDataSave }) => (
  <Formik
    initialValues={{
      file_name: file.file_name || '',
      scale_bar_length: file.scale_bar_length || 0,
      magnification: file.magnification || 0,
      passage_number: file.passage_number || 0,
    }}
    onSubmit={values => {
      onMetaDataSave({ fileId: file.file_id, metaData: values });
      setPreviewState({ editing: !editing });
    }}
    render={({ handleSubmit }) => (
      <FormContainer
        css={`
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        `}
      >
        <ul>
          <li>
            {!editing ? <b>{file.file_name}</b> : 'Description:'}
            {editing && <Field name="file_name" component={FormInput} />}
          </li>
          <li>
            Scale-bar length: {!editing && file.scale_bar_length}
            {editing && (
              <Field name="scale_bar_length" type="number" step={1} component={FormInput} />
            )}
          </li>
          <li>
            Magnification: {!editing && file.magnification}
            {editing && <Field name="magnification" type="number" step={1} component={FormInput} />}
          </li>
          <li>
            Passage Number: {!editing && file.passage_number}
            {editing && (
              <Field name="passage_number" type="number" step={1} component={FormInput} />
            )}
          </li>
        </ul>
        {editing && (
          <HoverPill
            primary
            css={`
              margin-right: 10px;
            `}
            onClick={handleSubmit}
          >
            <SaveIcon width={11} height={11} fill={white} />
            Save
          </HoverPill>
        )}
      </FormContainer>
    )}
  />
);
const ImagePreview = ({ file, queuedForDelete, onDelete, onMetaDataSave }) => (
  <Component initialState={{ editing: false, showControls: false }}>
    {({ state: { editing, showControls }, setState }) => (
      <Col
        css={`
          font: ${openSans};
          font-size: 12px;
          border: 1px solid ${mischka};
          width: 225px;
          align-items: center;
          padding: 5px;
          margin-right: 15px;
          margin-bottom: 15px;
          position: relative;
          opacity: ${queuedForDelete ? 0.5 : 1};
        `}
        onMouseOver={() => setState({ showControls: true })}
        onFocus={() => setState({ showControls: true })}
        onMouseOut={() => setState({ showControls: false })}
        onBlur={() => setState({ showControls: false })}
      >
        <img
          src={file.preview ? file.preview : `${config.urls.cmsBase}/images/${file.file_id}`}
          alt={`File: ${file.file_name}`}
          height="163"
          width="215"
        />
        <Row
          css={`
            position: absolute;
            right: 10px;
            top: 10px;
            opacity: ${showControls && !editing ? 1 : 0};
            width: 100%;
            justify-content: flex-end;
          `}
        >
          {!queuedForDelete && (
            <HoverPill
              secondary
              css={`
                margin-right: 10px;
                padding: 5px 10px;
              `}
            >
              <EditIcon
                width={14}
                height={14}
                style={`margin: 0;`}
                onClick={() => setState({ editing: !editing })}
              />
            </HoverPill>
          )}
          <HoverPill
            secondary
            css={`
              padding: 5px 10px;
            `}
            onClick={() => onDelete(file.file_id)}
          >
            {queuedForDelete ? (
              <PlusIcon fill={crimson} width={14} height={14} style={`margin: 0;`} />
            ) : (
              <TrashIcon width={14} height={14} style={`margin: 0;`} />
            )}
          </HoverPill>
        </Row>
        <Col
          css={`
            align-self: start;
            ul {
              list-style: none;
              margin: 0;
              padding: 10px;
            }
          `}
        >
          <ImageMetaDataForm
            file={file}
            editing={editing}
            setPreviewState={setState}
            onMetaDataSave={onMetaDataSave}
          />
          <div
            css={`
              color: ${crimson};
              padding-left: 10px;
            `}
          >
            {queuedForDelete && 'Will delete on publish'}
          </div>
        </Col>
      </Col>
    )}
  </Component>
);

const ImageGallery = ({ acceptedFiles, toDeleteFiles, onDelete, onMetaDataSave }) => (
  <>
    {acceptedFiles.map(file => (
      <ImagePreview
        queuedForDelete={toDeleteFiles.map(({ file_id }) => file_id).includes(file.file_id)}
        key={file.file_id}
        file={file}
        onDelete={onDelete}
        onMetaDataSave={onMetaDataSave}
      />
    ))}
  </>
);

let dropzoneRef;
const ImageDropper = ({ onDrop, display }) => (
  <Dropzone
    inputProps={{ 'aria-label': `Drop images here` }}
    ref={node => {
      dropzoneRef = node;
    }}
    css={`
      display: ${display ? 'block' : 'none'};
      border: 2px dashed ${frenchGrey};
      border-radius: 3px;
      width: 100%;
      height: 250px;
      padding: 5px;
    `}
    accept="image/jpg, image/jpeg, image/tiff, image/png, image/svg"
    onDrop={onDrop}
  >
    <Col
      css={`
        background: ${lightPorcelain};
        height: 100%;
        font-family: ${libreFranklin};
        font-weight: 500;
        color: ${mineShaft};
        font-size: 20px;
        align-items: center;
        justify-content: center;
      `}
    >
      <DragNDropIcon
        css={`
          height: 53px;
          padding-bottom: 10px;
        `}
      />
      Drag and drop your image(s) here
      <span
        css={`
          font-size: 14px;
          padding: 10px 0;
        `}
      >
        or
      </span>
      <NavPill>Browse Your Files</NavPill>
    </Col>
  </Dropzone>
);

export default ({ data: { updatedAt } }) => (
  <>
    <TabHeader title={`Model Images`} updatedAt={updatedAt} />
    <ModelSingleContext.Consumer>
      {({
        state: {
          form: { values },
          data: {
            response: { files = [] },
          },
        },
        uploadImages,
        saveForm,
      }) => (
        <>
          <Row
            p={'24px 10px 22px'}
            css={`
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
            `}
          >
            <div>Upload images in jpeg, tiff, png or svg formats.</div>
            {!!files.length && (
              <HoverPill
                css={`
                  align-self: right;
                `}
                primary
                onClick={() => {
                  dropzoneRef.open();
                }}
              >
                <PlusIcon width={11} height={11} />
                Add Images
              </HoverPill>
            )}
          </Row>
          <Row
            p={'0 10px'}
            css={`
              flex-wrap: wrap;
            `}
          >
            {!!files.length && (
              <ImageGallery
                acceptedFiles={files}
                toDeleteFiles={files.filter(file => file.marked_for_deletion)}
                onMetaDataSave={({ fileId, metaData }) => {
                  saveForm({
                    values,
                    images: files.map(f => (f.file_id === fileId ? { ...f, ...metaData } : f)),
                    successNotification: {
                      type: 'success',
                      message: `Image Metadata Saved!`,
                      details:
                        'Image metadata has been successfully saved, however not yet published.',
                    },
                  });
                }}
                onDelete={toDeleteFileId => {
                  const toDeleteFile = files.find(f => f.file_id === toDeleteFileId);
                  saveForm({
                    values,
                    images: [
                      ...files.filter(f => f.file_id !== toDeleteFileId),
                      {
                        ...toDeleteFile,
                        marked_for_deletion: !toDeleteFile.marked_for_deletion,
                      },
                    ],
                    successNotification: null,
                  });
                }}
              />
            )}
            <ImageDropper
              onDrop={async (acceptedFiles, rejectedFiles) => {
                console.log('todo notify rejectedFiles');
                console.log(rejectedFiles);
                const uploaded = await uploadImages(acceptedFiles);
                saveForm({
                  values,
                  images: [...files, ...uploaded],
                  successNotification: {
                    type: 'success',
                    message: `${Object.keys(uploaded).length} image(s) uploaded!`,
                    details:
                      'Image(s) have been successfully saved to the model, however not yet published.',
                  },
                });
              }}
              display={!files.length}
            />
          </Row>
        </>
      )}
    </ModelSingleContext.Consumer>
  </>
);
