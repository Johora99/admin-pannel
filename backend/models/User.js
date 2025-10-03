const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  normalizedEmail: { type: String, required: true },
  passwordHash: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['unverified','active','blocked', 'deleted'], 
    default: 'unverified' 
  },
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});


UserSchema.index({ normalizedEmail: 1 }, { unique: true });


UserSchema.methods.isBlocked = function() {
  return this.status === 'blocked';
};

UserSchema.methods.isActive = function() {
  return this.status === 'active' && !this.isDeleted;
};

module.exports = mongoose.model('User', UserSchema, 'myProjectUsers');
