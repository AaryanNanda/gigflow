import { Schema, model, Document } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: { 
    type: String, 
    required: [true, 'Lead name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Lead email is required'], 
    trim: true, 
    lowercase: true 
  },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Lost'],
    default: 'New'
  },
  source: { 
    type: String, 
    enum: ['Website', 'Instagram', 'Referral'],
    required: [true, 'Lead source is required'] 
  }
}, { 
  timestamps: true 
});

LeadSchema.index({ name: 'text', email: 'text' }); 
LeadSchema.index({ status: 1, source: 1 });

export const Lead = model<ILead>('Lead', LeadSchema);