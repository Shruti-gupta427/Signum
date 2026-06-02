const mongoose = require('mongoose'); 
const notificationSchema = new mongoose.Schema ({
    userId: {
    type: String,
    required: true,
  },
  channel:{
    type : String,
    enum : ["sms","ws","email","sse"],
    required: true
  },
  message :{
     type: mongoose.Schema.Types.Mixed,
     required: true

  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'delivered', 'pending', 'failed', 'rate_limited', 'read'],
    default: 'queued'
  },
  priority: {
    type: Number,
    default: 2
  },
  attempts :{
    type : Number,
    default :0
  },
  maxAttempts:{
    type: Number,
    default: 3
  },
  phone :{
    type : String,
  },
  email :{
    type : String ,
    },
  createdAt: {
    type :Date,
    default :Date.now
  },
  error :{
    type :String
  },
  deliveredAt :{
    type :Date,
  },
  readAt: {
    type: Date
  },
})

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);