import { Schema, Model, model, Aggregate } from 'mongoose';
import { ISettingDocument } from '../interfaces/ISettingDocument';

interface ISetting extends ISettingDocument {};

interface ISettingModel extends Model<ISetting> {};

export const settingSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  }, 
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  }, 
  inhale: {
    type: Number,
    required: true,
  },
  holdIn: {
    type: Number,
    required: true,
    default: 0,
  },
  exhale: {
    type: Number,
    required: true,
  },
  holdOut: {
    type: Number,
    required: true,
    default: 0,
  },
  endTime: {
    type: Number,
    required: true,
  },
});

export const Setting: ISettingModel = model<ISetting, ISettingModel>('Settings', settingSchema);
export default Setting;
