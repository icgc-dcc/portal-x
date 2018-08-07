import mongoose from 'mongoose';

export const ModelSchema = new mongoose.Schema(
  {
    model_name: String,
    model_type: String,
    growth_rate: Number,
    split_ratio: String,
    gender: String,
    race: String,
    age_at_diagnosis: Number,
    age_at_sample_acquisition: Number,
    date_of_availability: Date,
    sequence_source: String,
    source_model_uuid: String,
    source_sequence_uuid: String,
    primary_site: String,
    tnm_stage: String,
    neoadjuvant_therapy: String,
    chemotherapeutic_drugs: Boolean,
    disease_status: String,
    vital_status: String,
    therapy: String,
    molecular_characterizations: [String],
    clinical_tumor_diagnosis: String,
    histological_type: String,
    clinical_stage_grouping: String,
    site_of_sample_acquisition: String,
    tumor_histological_grade: String,
    licensing_required: Boolean,
    tmn_stage: String,
    source_model_url: String,
    source_sequence_url: String,
    status: {
      type: String,
      default: 'Unpublished',
    },
    updatedBy: String,
  },
  {
    timestamps: true,
    collection: process.env.MONGO_COLLECTION,
  },
);

export default mongoose.model('Model', ModelSchema);
