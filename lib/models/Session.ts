import { Schema, model } from 'mongoose';

const schema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true
  }, 
  userId: {
    type: String,
    required: true
  }
});

schema.static('averageSessionTime', function(userId) {
  const pipeline = 
  [{
    $match: {
      userId: userId
    }
  }, {
    $group: {
      _id: null,
      averageTime: {
        $avg: '$duration'
      }
    }
  }];
  return this.aggregate(pipeline);
});

schema.static('totalSessionTime', function(userId) {
  const pipeline = 
  [{
    $match: {
      userId: userId
    }
  }, {
    $group: {
      _id: null,
      totalTime: {
        $sum: '$duration'
      }
    }
  }];
  return this.aggregate(pipeline);
});


export default model('Sessions', schema);
