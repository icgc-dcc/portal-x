import Dictionary from '../schemas/dictionary';
import Draft, { draftStatus } from '../schemas/dictionaryDraft';

export const getDictionary = async () =>
  await Dictionary.findOne({}, {}, { sort: { created_at: -1 } });

export const getDictionaryDraft = async () =>
  await Draft.findOne({}, {}, { sort: { created_at: -1 } });

export const getDictionaryOptions = async () => {
  const result = await getDictionary();
  const dictionary = result.fields;

  const output = dictionary.reduce((acc, field) => {
    let { name, values } = field;
    acc[`${name}Options`] = values.map(i => i.value);
    return acc;
  }, {});
  const ctd = dictionary.find(i => i.name === 'clinicalTumorDiagnosis');

  const ctdDependentOptions = {};

  ctd.dependentValues.forEach(val => (ctdDependentOptions[val] = {}));

  ctd.values.forEach(val => {
    const valueName = val.value;

    val.dependents.forEach(dependent => {
      const dependentName = dependent.name;
      const dependentValues = dependent.values.map(val => val.value);

      ctdDependentOptions[dependentName][valueName.toLowerCase()] = dependentValues;
    });
  });
  output.clinicalTumorDiagnosisDependent = ctdDependentOptions;

  return output;
};

export const resetDraft = async () => {
  const dictionary = await Dictionary.findOne({}, {}, { sort: { created_at: -1 } });
  const draft = new Draft({ fields: dictionary.fields });
  await draft.save();
  return await Draft.findOne({}, {}, { sort: { created_at: -1 } });
};

export const publishDraft = async () => {
  const draft = await getDictionaryDraft();
  const dictionary = new Dictionary({ fields: draft.fields });

  await dictionary.save();
  return dictionary;
};

export const countDraftStats = draft => {
  const output = { edited: 0, new: 0 };

  const hasDependencies = draft.dependentValues && draft.dependentValues.length > 0;
  for (let value of draft.values) {
    if (value.status === draftStatus.edited) {
      output.edited += 1;
    }
    if (value.status === draftStatus.new) {
      output.new += 1;
    }

    if (hasDependencies) {
      for (let dependent of value.dependents) {
        // Ensure we are only looking for edits in dependcies that are listed in the draft.dependentValues list
        if (draft.dependentValues.includes(dependent.name)) {
          for (let dependentValue of dependent.values) {
            if (dependentValue.status == draftStatus.edited) {
              output.edited += 1;
            }
            if (dependentValue.status == draftStatus.new) {
              output.new += 1;
            }
          }
        }
      }
    }
  }
  return output;
};

export const valueExists = (valuesList, value) => {
  return !!valuesList.find(val => val.value === value);
};
