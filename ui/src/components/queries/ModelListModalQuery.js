import React from 'react';
import { get } from 'lodash';
import globals from 'utils/globals';
import { api } from '@arranger/components';
import Component from 'react-component-component';

const fetchData = async ({ setState, modelIds }) => {
  const { data } = await api({
    endpoint: `${globals.VERSION}/graphql/ModelDataQuery`,
    body: {
      query: `query ModelListModal($filters: JSON) {
            models {
              extended
              hits(first: ${modelIds.length} filters: $filters) {
                edges {
                  node {
                    id
                    source_model_url
                    source_sequence_url
                    name
                    type
                    split_ratio
                    growth_rate
                    primary_site
                    neoadjuvant_therapy
                    tnm_stage
                    molecular_characterizations
                    age_at_diagnosis
                    vital_status
                    gender
                    race
                    chemotherapeutic_drug_list_available
                    age_at_aquisition
                    disease_status
                    files {
                      hits{
                        edges {
                          node {
                            file_name
                            file_type
                          }
                        }
                      }
                    }
                    therapy
                    licensing_required
                    date_of_availability
                    clinical_diagnosis {
                      clinical_tumor_diagnosis
                      aquisition_site
                      histological_type
                      histologcal_grade
                      clinical_stage_grouping
                    }
                  }
                }
              }
            }
          }`,
      variables: {
        filters: { op: 'in', content: { field: '_id', value: modelIds } },
      },
    },
  });
  setState({
    models: get(data, `models.hits.edges`, []).map(edge => edge.node),
    loading: false,
  });
};

export default ({ selected, ...props }) => (
  <Component
    {...props}
    initialState={{ models: [], loading: true }}
    selected={selected}
    didMount={async ({ setState }) => {
      await fetchData({ setState, modelIds: selected.state.modelIds });
    }}
    didUpdate={async ({ setState, props, prevProps, state }) => {
      // Currently we can only remove items from this component so
      // no need to query everytime we remove items from the list
      const newModelId = props.selected.state.modelIds;
      if (newModelId.length < prevProps.selected.state.modelIds.length && !state.loading) {
        setState({
          ...state,
          models: state.models.filter(model => newModelId.indexOf(model.id) !== -1),
        });
      }
    }}
  />
);
