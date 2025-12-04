import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

hospitalSchema.pre('validate', async function() {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    // check unique slug
    let exists = await mongoose.model('Hospital').exists({ slug: this.slug });
    let counter = 1;

    while (exists) {
      this.slug = `${this.slug}-${counter++}`;
      exists = await mongoose.model('Hospital').exists({ slug: this.slug });
    }
  }
});

hospitalSchema.index({ city: 1, state: 1, country: 1 });

export const Hospital = mongoose.model('Hospital', hospitalSchema);