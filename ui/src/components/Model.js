import React from 'react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import Spinner from 'react-spinkit';

import ModelQuery from 'components/queries/ModelQuery';
import ModelBar from 'components/ModelBar';
import ModelCarouselBar from 'components/ModelCarouselBar';
import VariantTables from 'components/VariantTables';

import CameraIcon from 'icons/CameraIcon';
import CheckmarkIcon from 'icons/CheckmarkIcon';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';
import ModelIcon from 'icons/ModelIcon';
import ShoppingCartIcon from 'icons/ShoppingCartIcon';
import CrossIcon from 'icons/CrossIcon';

import { VariantsProvider } from 'providers/Variants';

import { ExternalLinkPill } from 'theme/adminControlsStyles';
import { ModelSlider, ModelSlide, LeftArrow, RightArrow } from 'theme/carouselStyles';
import styles from 'theme/modelStyles';
import { Row, Col } from 'theme/system';
import base from 'theme';

import modelImageProcessor from 'utils/modelImageProcessor';
import apiDataProcessor from 'utils/apiDataProcessor';
import { imgPath } from 'utils/constants';

const {
  keyedPalette: { bombay, brandPrimary, pelorousapprox },
} = base;

const HorizontalTable = ({
  fieldNames,
  rawData,
  extended,
  css,
  customUnits = {},
  customValue = {},
  data = (extended || [])
    .slice()
    .sort((a, b) => (fieldNames || []).indexOf(a) - (fieldNames || []).indexOf(b))
    .reduce((acc, { field, type, displayName, unit }) => {
      const fieldHelper = ({ field, type, displayName, unit }) =>
        fieldNames.includes(field)
          ? {
              ...acc,
              [field]: {
                key: displayName,
                value: apiDataProcessor({ data: get(rawData, field), type, unit }),
              },
            }
          : acc;
      return !Object.keys(customUnits).includes(field)
        ? fieldHelper({ field, type, displayName, unit })
        : fieldHelper({ field: field, type, displayName, unit: customUnits[field] || unit });
    }, {}),
}) => {
  return (
    <table className="entity-horizontal-table" cellPadding="0" cellSpacing="0" css={css}>
      <tbody>
        {Object.keys(data).map(field => {
          const { key, value } = data[field];
          return (
            <tr key={key}>
              <td className="heading">{key}</td>
              <td className="content">
                {Object.keys(customValue).includes(field) ? (
                  customValue[field](value)
                ) : Array.isArray(value) ? (
                  <ul>
                    {value.map((val, idx) => (
                      <li key={idx}>{`• ${val}`}</li>
                    ))}
                  </ul>
                ) : (
                  value
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const MultipleModelContent = match => {
  return (
    <div className="multiple-models__model" key={match.name}>
      <div className="multiple-models__model-icon">
        <ModelIcon />
      </div>
      <div className="multiple-models__model-text">
        <Link
          className="model-text__name"
          to={{
            pathname: `/model/${match.name}`,
          }}
        >
          {match.name}
        </Link>
        <span className="model-text__type">
          Tissue Type: <strong>{match.tissue_type || 'N/A'}</strong>
        </span>
      </div>
    </div>
  );
};

const MultipleModelsList = ({ matches }) => {
  if (matches.length > 0) {
    return <div className="multiple-models">{matches.map(MultipleModelContent)}</div>;
  } else {
    return (
      <div className="model-details model-details--empty">
        <ModelIcon fill={bombay} />
        <p className="model-details__empty-message">There are no other models from this patient.</p>
      </div>
    );
  }
};

const MolecularCharacterizationsCell = ({ isAvailable }) => {
  return isAvailable ? (
    <CheckmarkIcon
      width={'18px'}
      height={'18px'}
      style={`
        background-color: ${pelorousapprox};
        border-radius: 100%;
        padding: 4px;
      `}
      title="Available"
    />
  ) : (
    <CrossIcon
      width={'18px'}
      height={'18px'}
      title="Not Available"
      style={`
        padding: 4px;
      `}
    />
  );
};

const MolecularCharacterizationsTable = ({ characterizations }) => {
  const CHARS = ['WGS', 'WXS', 'Targeted-seq', 'RNA-seq'];
  const TYPES = ['model', 'parent tumor', 'normal'];

  return (
    <table className="molecular-characterizations-table">
      <tbody>
        <tr>
          <th />
          <th>Model</th>
          <th>Tumor</th>
          <th>Normal</th>
        </tr>
        {CHARS.map(characterization => (
          <tr key={characterization}>
            <th>{characterization}</th>
            {TYPES.map(type => (
              <td key={`${characterization} of ${type}`}>
                <MolecularCharacterizationsCell
                  isAvailable={characterizations.includes(`${characterization} of ${type}`)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ExternalResourceLink = ({ url, children }) => (
  <ExternalLinkPill
    primary
    className={`external-resources__link ${!url && 'external-resources__link--disabled'}`}
    href={url}
    role={!url ? 'button' : null}
    disabled={!url}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </ExternalLinkPill>
);

const ExternalResourcesContent = ({
  distributorPartNumber,
  sourceModelUrl,
  sourceSequenceUrl,
  somaticMafUrl,
}) => {
  const sequencingFilesLink = sourceSequenceUrl !== 'N/A' ? sourceSequenceUrl : null;
  const modelSourceLink = sourceModelUrl !== 'N/A' ? sourceModelUrl : null;
  const somaticMafLink = somaticMafUrl !== 'N/A' ? somaticMafUrl : null;
  const purchaseLink =
    distributorPartNumber && `https://www.atcc.org/products/all/${distributorPartNumber}`;

  return (
    <div className="external-resources">
      <ExternalResourceLink url={sequencingFilesLink}>
        <ExternalLinkIcon />
        Sequencing Files
      </ExternalResourceLink>
      <ExternalResourceLink url={modelSourceLink}>
        <ExternalLinkIcon />
        Model Source
      </ExternalResourceLink>
      <ExternalResourceLink url={somaticMafLink}>
        <ExternalLinkIcon />
        Masked Somatic MAF
      </ExternalResourceLink>
      {purchaseLink && (
        <ExternalResourceLink url={purchaseLink}>
          <ShoppingCartIcon />
          Visit {distributorPartNumber} to Purchase
        </ExternalResourceLink>
      )}
    </div>
  );
};

export default ({ modelName }) => (
  <ModelQuery modelName={modelName}>
    {({
      state: queryState,
      modelImages = modelImageProcessor(
        queryState.model && queryState.model.files && queryState.model.files.hits
          ? queryState.model.files.hits.edges
          : [],
      ),
    }) => (
      <div css={styles}>
        <ModelBar
          name={modelName}
          id={(queryState.model || { id: '' }).id}
          isExpanded={queryState.model ? queryState.model.expanded : null}
        />
        <ModelCarouselBar name={modelName} className="model-carousel-bar--top" />
        {queryState.model ? (
          <>
            <section key="model-details" className="model-section">
              <Row className="row">
                <Col className="three-col">
                  <div className="model-section__card">
                    <h3 className="model-section__card-title">Model Details</h3>
                    <HorizontalTable
                      rawData={queryState.model}
                      extended={queryState.extended}
                      fieldNames={[
                        'type',
                        'split_ratio',
                        'time_to_split',
                        'growth_rate',
                        'tissue_type',
                      ]}
                      customUnits={{ growth_rate: ' days' }}
                    />
                  </div>

                  <div className="model-section__card">
                    <h3 className="model-section__card-title">
                      Multiple Models From This Patient (
                      {queryState.model.matched_models.hits.edges.length || '0'})
                    </h3>
                    <MultipleModelsList
                      matches={queryState.model.matched_models.hits.edges.map(match => match.node)}
                    />
                  </div>

                  <div className="model-section__card">
                    <h3 className="model-section__card-title">
                      Available Molecular Characterizations (
                      {get(queryState.model, 'molecular_characterizations').length || '0'})
                    </h3>
                    <MolecularCharacterizationsTable
                      characterizations={get(queryState.model, 'molecular_characterizations')}
                    />
                  </div>
                </Col>

                <Col className="three-col">
                  <div className="model-section__card">
                    <h3 className="model-section__card-title">Patient Details</h3>
                    <HorizontalTable
                      rawData={queryState.model}
                      extended={queryState.extended}
                      fieldNames={[
                        'gender',
                        'race',
                        'age_at_diagnosis',
                        'age_at_sample_acquisition',
                        'disease_status',
                        'vital_status',
                        'neoadjuvant_therapy',
                        'therapy',
                        'chemotherapeutic_drugs',
                        'clinical_diagnosis.clinical_tumor_diagnosis',
                        'clinical_diagnosis.histological_type',
                        'primary_site',
                        'clinical_diagnosis.site_of_sample_acquisition',
                        'tissue_type',
                        'tnm_stage',
                        'clinical_diagnosis.clinical_stage_grouping',
                        'clinical_diagnosis.tumor_histological_grade',
                      ]}
                    />
                  </div>
                </Col>

                <Col className="three-col">
                  <div className="model-section__card">
                    <h3 className="model-section__card-title">
                      Model Images ({(modelImages && modelImages.length) || '0'})
                    </h3>
                    {modelImages && modelImages.length ? (
                      <ModelSlider
                        LeftArrow={<LeftArrow />}
                        RightArrow={<RightArrow />}
                        autoSlide={false}
                        showDots={false}
                        cardsToShow={1}
                        // adding a key to force re-render of the slider
                        // ensures arrow buttons are present when needed
                        key={`model-slider-${modelImages.length}`}
                      >
                        {modelImages.map(
                          ({
                            file_id,
                            file_url,
                            file_name,
                            scale_bar_length,
                            magnification,
                            passage_number,
                          }) => (
                            <ModelSlide key={file_id}>
                              <img
                                src={file_url ? file_url : `${imgPath}/${file_id}`}
                                alt={`File name: ${file_name}`}
                              />
                              {(scale_bar_length || magnification || passage_number) && (
                                <div
                                  css={`
                                    text-align: center;
                                  `}
                                >
                                  {scale_bar_length && (
                                    <span className="image-caption">
                                      Scale-bar length: {scale_bar_length} μm
                                    </span>
                                  )}
                                  {magnification && (
                                    <span className="image-caption">
                                      Magnification: {magnification} x
                                    </span>
                                  )}
                                  {passage_number && (
                                    <span className="image-caption">
                                      Passage Number: {passage_number}
                                    </span>
                                  )}
                                </div>
                              )}
                            </ModelSlide>
                          ),
                        )}
                      </ModelSlider>
                    ) : (
                      <div className="model-details model-details--empty">
                        <CameraIcon fill={bombay} />
                        <p className="model-details__empty-message">No images available.</p>
                      </div>
                    )}
                  </div>

                  <div className="model-section__card">
                    <h3 className="model-section__card-title">Repository Status</h3>
                    <HorizontalTable
                      rawData={queryState.model}
                      extended={queryState.extended}
                      fieldNames={[
                        'updatedAt',
                        'date_of_availability',
                        'licensing_required',
                        'createdAt',
                      ]}
                    />
                  </div>

                  <div className="model-section__card">
                    <h3 className="model-section__card-title">External Resources</h3>
                    <ExternalResourcesContent
                      distributorPartNumber={get(queryState.model, 'distributor_part_number')}
                      sourceModelUrl={get(queryState.model, 'source_model_url')}
                      sourceSequenceUrl={get(queryState.model, 'source_sequence_url')}
                      somaticMafUrl={get(queryState.model, 'somatic_maf_url')}
                    />
                  </div>
                </Col>
              </Row>
            </section>

            <section key="variants" className="model-section">
              <Col>
                <div className="model-section__card">
                  <h3 className="model-section__card-title">Variants</h3>
                  <VariantsProvider>
                    <VariantTables modelName={modelName} />
                  </VariantsProvider>
                </div>
              </Col>
            </section>
          </>
        ) : (
          <Row justifyContent="center">
            <Spinner
              fadeIn="full"
              name="circle"
              style={{
                margin: 64,
                width: 48,
                height: 48,
                color: brandPrimary,
              }}
            />
          </Row>
        )}

        <ModelCarouselBar name={modelName} className="model-carousel-bar--bottom" />
      </div>
    )}
  </ModelQuery>
);
