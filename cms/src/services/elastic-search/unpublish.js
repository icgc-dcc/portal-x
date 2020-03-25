// @ts-check

import elasticClient from './common/client';
import indexEsUpdate from './update';
import Model from '../../schemas/model';
import { indexMatchedModelsToES } from './publish';
import { modelStatus } from '../../helpers/modelStatus';

const index = process.env.ES_INDEX;

export const unpublishModel = async name => {
  await unpublishOneFromES(name);
  await indexMatchedModelsToES({ name });
};

export const unpublishOneFromES = async name => {
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  indexEsUpdate();
  await elasticClient.deleteByQuery({
    index,
    body: {
      query: {
        term: { name },
      },
    },
  });
  await Model.updateOne(
    {
      name,
    },
    { status: modelStatus.unpublished },
  );
};

export const unpublishManyFromES = nameArr => {
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  indexEsUpdate();
  return elasticClient.deleteByQuery({
    index,
    body: {
      query: {
        terms: { name: nameArr },
      },
    },
  });
};
