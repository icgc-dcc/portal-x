import React from 'react';
import { Link } from 'react-router-dom';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import searchStyles from 'theme/searchStyles';
import Url from 'components/Url';
import moment from 'moment';
import { Row, Col } from 'theme/system';

export default props => (
  <Url
    render={url => {
      return (
        <Arranger
          {...props}
          projectId={props.version}
          render={props => {
            return (
              <Row css={searchStyles}>
                <Aggregations {...props} {...url} index={props.index} graphqlField={props.index} />
                <Col
                  p={1}
                  flex={1}
                  css={`
                    height: calc(100vh - 50px);
                  `}
                >
                  <Col p={30} bg="#f4f5f7" flex={1}>
                    <Row>
                      {!url.sqon && (
                        <Row
                          css={`
                            line-height: 50px;
                            padding: 0 14px;
                            background-color: white;
                            flex: 1;
                          `}
                        >
                          <span
                            className="sqon-field"
                            css={`
                              font-size: 12px;
                            `}
                          >
                            No filters selected
                          </span>
                        </Row>
                      )}
                      <CurrentSQON
                        {...props}
                        {...url}
                        index={props.index}
                        graphqlField={props.index}
                      />
                    </Row>
                    <Table
                      {...props}
                      {...url}
                      customTypes={{
                        entity: ({ value }) => <Link to={`/model/${value}`}>{value}</Link>,
                      }}
                      index={props.index}
                      graphqlField={props.index}
                      columnDropdownText="Columns"
                      fieldTypesForFilter={['text', 'keyword', 'id']}
                      exportTSVFilename={`${props.index}-table-${moment().format(
                        'YYYY-MM-DD',
                      )}.tsv`}
                    />
                  </Col>
                </Col>
              </Row>
            );
          }}
        />
      );
    }}
  />
);
