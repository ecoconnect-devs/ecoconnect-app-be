import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface SupplierDocument {
  name: string;
  type?: string;
  expiry?: string;
  attachment?: File;
}

export interface Supplier {
  id: number;
  company?: string;
  country?: string;
  product_categories?: string;
  countryregion?: string;
  product_spec?: string;
  brandnames?: string;
  isPreferred?: boolean;
  documents?: SupplierDocument[];
}

interface IUser extends Document {
  companyName: string;
  password: string;
  type: string;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  userCity?: string;
  userRegion?: string;
  userZip?: string;
  userCountry?: string;
  preferredCommunicationMethod?: string;
  overview?: string;
  mission?: string;
  industry?: string;
  productsOffered?: string;
  practiceDescription?: string;
  certifications?: string;
  supportingDocs?: SupplierDocument[]
  logoBlobString?: string;
  headquartersLocation?: string;
  address?: string;
  companyZip?: string;
  companySize?: string;
  website?: string;
  socials?: string;
  profileCompleted?: boolean;
  profileApproved?: boolean;
  firstLogin?: boolean;
  settings?: {
    general: {
      language?: string;
      currency?: string;
      timeZone?: string;
      dateFormat?: string;
      unit?: string;
    },
    notifications: {
      email: {
        newMessages: 'enabled' | 'disabled';
        rfq: 'enabled' | 'disabled';
        invitations: 'enabled' | 'disabled';
      }
    }
  }
  token?: string;
}

const userSchema: Schema<IUser> = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  companyName: { type: String, required: true },
  type: { type: String, required: true },
  phone: { type: String, required: false },
  userCity: { type: String, required: false },
  userRegion: { type: String, required: false },
  userZip: { type: String, required: false },
  userCountry: { type: String, required: false },
  preferredCommunicationMethod: { type: String, required: false },
  overview: { type: String, required: false },
  mission: { type: String, required: false },
  industry: { type: String, required: false },
  productsOffered: { type: String, required: false },
  practiceDescription: { type: String, required: false },
  certifications: { type: String, required: false },
  supportingDocs: { type: Array, required: false },
  logoBlobString: { type: String, required: false },
  headquartersLocation: { type: String, required: false },
  address: { type: String, required: false },
  companyZip: { type: String, required: false },
  companySize: { type: String, required: false },
  website: { type: String, required: false },
  socials: { type: String, required: false },
  profileCompleted: { type: Boolean, required: false },
  profileApproved: { type: Boolean, required: false },
  firstLogin: { type: Boolean, required: false },
  settings: {
    general: {
      language: { type: String, required: false },
      currency: { type: String, required: false },
      timeZone: { type: String, required: false },
      dateFormat: { type: String, required: false },
      unit: { type: String, required: false },
    },
    notifications: {
      email: {
        newMessages: { type: String, required: false },
        rfq: { type: String, required: false },
        invitations: { type: String, required: false },
      }
    }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;