import React, { useState, useContext } from 'react';
import { get, uniqBy } from 'lodash';
import { stringify } from 'query-string';
import { Link } from 'react-router-dom';

import { api } from '@arranger/components';

import SparkMeter from 'components/SparkMeter';

import { NotificationsContext, NOTIFICATION_TYPES } from 'components/admin/Notifications';

import { VARIANT_TYPES } from 'utils/constants';
import globals from 'utils/globals';

export const VariantsContext = React.createContext([{}, () => {}]);

export const VariantsProvider = props => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [importNotifications, setImportNotifications] = useState([]);

  return (
    <VariantsContext.Provider
      value={[
        [data, setData],
        [filteredData, setFilteredData],
        [loading, setLoading],
        [page, setPage],
        [pageSize, setPageSize],
        [importNotifications, setImportNotifications],
      ]}
    >
      {props.children}
    </VariantsContext.Provider>
  );
};

export const useVariants = () => {
  const [
    [data, setData],
    [filteredData, setFilteredData],
    [loading, setLoading],
    [page, setPage],
    [pageSize, setPageSize],
    [importNotifications, setImportNotifications],
  ] = useContext(VariantsContext);
  const { appendNotification, clearNotification } = useContext(NotificationsContext);

  const getData = () => {
    if (!data) return [];
    return data;
  };

  const getFilteredData = () => {
    if (!filteredData) return [];
    return filteredData;
  };

  const getImportNotifications = () => {
    if (!importNotifications) return [];
    return importNotifications;
  };

  const getLoading = () => {
    if (!loading) return false;
    return loading;
  };

  const getPage = () => {
    if (!page) return 0;
    return page;
  };

  const getPageSize = () => {
    if (!pageSize) return 10;
    return pageSize;
  };

  const getGenomicVariants = async modelName => {
    const variantsData = await api({
      endpoint: `/${globals.VERSION}/graphql`,
      body: {
        query: `query($modelsSqon: JSON) {
                    models {
                      hits(filters: $modelsSqon, first: 1) {
                        edges {
                          node {
                          name
                            genomic_variants {
                              hits {
                                edges {
                                  node {
                                    gene
                                    aa_change
                                    transcript_id
                                    consequence_type
                                    class
                                    chromosome
                                    start_position
                                    end_position
                                    specific_change
                                    classification
                                    entrez_id
                                    variant_id
                                    name
                                    type
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `,
        variables: {
          modelsSqon: { op: 'in', content: { field: 'name', value: modelName } },
        },
      },
    });

    const data = get(
      variantsData,
      `data.models.hits.edges[0].node.genomic_variants.hits.edges`,
      [],
    ).map(({ node }) => node);

    return data.length && data.length > 0
      ? data
          .filter(variant => !!variant.gene)
          .map(variant => {
            const entrez_link = `https://www.ncbi.nlm.nih.gov/gene/${variant.entrez_id}`;
            const geneComponent = variant.entrez_id ? (
              <a href={entrez_link} target="_blank" rel="noopener noreferrer">
                {variant.gene}
              </a>
            ) : (
              variant.gene
            );

            return {
              ...variant,
              gene: {
                name: variant.gene,
                display: geneComponent,
              },
            };
          })
      : [];
  };

  const fetchData = async ({ modelName, type }) => {
    if (type === VARIANT_TYPES.genomic) {
      return getGenomicVariants(modelName);
    }

    const variantsData = await api({
      endpoint: `/${globals.VERSION}/graphql`,
      body: {
        query: `query($modelsSqon: JSON) {
                    models {
                      hits(filters: $modelsSqon, first: 1) {
                        edges {
                          node {
                          name
                            variants {
                              hits {
                                edges {
                                  node {
                                    name
                                    category
                                    assessment_type
                                    type
                                    expression_level
                                    genes
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `,
        variables: {
          modelsSqon: { op: 'in', content: { field: 'name', value: modelName } },
        },
      },
    });

    const data = get(variantsData, `data.models.hits.edges[0].node.variants.hits.edges`, [])
      .map(({ node }) => node)
      .filter(node => node.type && node.type.toLowerCase() === type.toLowerCase());

    const variantNames = uniqBy(
      data.map(({ name }) => ({ name, safe: name.replace(/ |-|\.|\(|\)/g, '') })),
      ({ name }) => name,
    );

    const freqsData = variantNames.length
      ? await api({
          endpoint: `/${globals.VERSION}/graphql`,
          body: {
            query: `query(${variantNames.map(({ safe }) => '$' + safe + ': JSON').join(',')}) {
                    models {
                    all: hits(first: 0) {
                      total
                    }
                    ${variantNames.map(
                      ({ safe }) => `${safe} : hits(filters: ${'$' + safe}, first: 0) {
                        total
                      }`,
                    )}
                    }
                  }
                `,
            variables: variantNames.reduce(
              (acc, { name, safe }) => ({
                ...acc,
                [safe]: {
                  op: 'in',
                  content: { field: 'variants.name', value: name },
                },
              }),
              {},
            ),
          },
        })
      : { data: { models: [] } };

    const freqs = Object.keys(freqsData.data.models).reduce(
      (acc, key) => ({
        ...acc,
        [variantNames.reduce(
          (found, { name, safe }) => (safe === key ? name : found),
          '',
        )]: freqsData.data.models[key].total,
      }),
      {},
    );

    const dataWithFreqs = data.map(d => ({
      ...d,
      genes: (d.genes || '').join(', '),
      frequency: {
        display: (
          <div
            css={`
              display: flex;
              flex-direction: row;
              align-items: center;
            `}
          >
            <Link
              style={{ display: 'inline-block', width: '23px' }}
              to={{
                pathname: '/',
                search: stringify({
                  sqon: JSON.stringify({
                    op: 'and',
                    content: [
                      {
                        op: 'in',
                        content: { field: 'variants.name', value: d.name },
                      },
                    ],
                  }),
                }),
              }}
            >
              {get(freqs, d.name, 0)}
            </Link>
            <SparkMeter
              width={47}
              percentage={get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0)}
            />
            {((get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0)) * 100).toFixed(
              2,
            )}
            %
          </div>
        ),
        export: `${(
          (get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0)) *
          100
        ).toFixed(2)}%`,
        raw: get(freqs, d.name, 0),
      },
    }));

    return dataWithFreqs;
  };

  const sortFilteredData = (a, b) => {
    if (!a || !a.frequency || !a.frequency.raw || !b || !b.frequency || !b.frequency.raw) {
      return false;
    }
    return b.frequency.raw - a.frequency.raw;
  };

  const addImportNotification = async modelName => {
    const existingNotification = getImportNotifications().find(x => x.modelName === modelName);

    if (!existingNotification) {
      const notification = await appendNotification({
        type: NOTIFICATION_TYPES.LOADING,
        message: `Importing: Research Variants for ${modelName} are currently importing.`,
        details:
          'You can continue to use the CMS, and will be notified when the import is complete.',
        timeout: false,
      });

      setImportNotifications(notifications => [
        ...notifications,
        {
          modelName: modelName,
          notificationId: notification.id,
        },
      ]);
    }
  };

  const removeImportNotification = modelName => {
    const existingNotification = getImportNotifications().find(x => x.modelName === modelName);

    if (existingNotification) {
      clearNotification(existingNotification.notificationId);
      setImportNotifications(notifications =>
        notifications.filter(notification => notification.modelName !== modelName),
      );
      appendNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Import Successful: Research Somatic Variants for ${modelName} have successfully imported, however are not yet published.`,
        link: `/admin/model/${modelName}`,
        linkText: 'View on model page to publish these variants.',
      });
    }
  };

  return {
    data: getData(),
    filteredData: getFilteredData(),
    importNotifications: getImportNotifications(),
    loading: getLoading(),
    page: getPage(),
    pageSize: getPageSize(),
    setData,
    setFilteredData,
    setImportNotifications,
    setLoading,
    setPage,
    setPageSize,
    addImportNotification,
    removeImportNotification,
    fetchData,
    sortFilteredData,
  };
};
