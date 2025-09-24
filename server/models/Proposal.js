import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Proposal title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Proposal description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  domain: {
    type: String,
    required: [true, 'Technical domain is required'],
    trim: true,
    maxlength: [100, 'Domain cannot exceed 100 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: [
      'draft', 
      'submitted', 
      'under_review', 
      'assigned_to_staff',
      'staff_reviewing',
      'needs_revision', 
      'approved', 
      'rejected',
      'completed'
    ],
    default: 'draft'
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedStaff: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    }
  }],
  feedback: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [2000, 'Feedback cannot exceed 2000 characters']
    },
    type: {
      type: String,
      enum: ['reviewer_feedback', 'staff_report', 'revision_request', 'approval_note'],
      default: 'reviewer_feedback'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  documents: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeline: {
    submitted: Date,
    reviewStarted: Date,
    staffAssigned: Date,
    reviewCompleted: Date,
    decision: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
proposalSchema.index({ author: 1, status: 1 });
proposalSchema.index({ reviewer: 1, status: 1 });
proposalSchema.index({ 'assignedStaff.user': 1 });
proposalSchema.index({ createdAt: -1 });

// Virtual for proposal age
proposalSchema.virtual('age').get(function() {
  return Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to add feedback
proposalSchema.methods.addFeedback = function(from, message, type = 'reviewer_feedback') {
  this.feedback.push({
    from,
    message,
    type,
    createdAt: new Date()
  });
  return this.save();
};

// Method to assign staff
proposalSchema.methods.assignStaff = function(staffId, dueDate = null) {
  const existingAssignment = this.assignedStaff.find(
    assignment => assignment.user.toString() === staffId.toString()
  );
  
  if (!existingAssignment) {
    this.assignedStaff.push({
      user: staffId,
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days default
    });
    this.status = 'assigned_to_staff';
  }
  
  return this.save();
};

// Static method to get proposals by role
proposalSchema.statics.getProposalsByRole = function(userId, userRole) {
  const baseQuery = { status: { $ne: 'draft' } };
  
  switch(userRole) {
    case 'user':
      return this.find({ author: userId }).populate('reviewer assignedStaff.user', 'name email');
    case 'reviewer':
      return this.find(baseQuery).populate('author assignedStaff.user', 'name email');
    case 'staff':
      return this.find({ 
        'assignedStaff.user': userId,
        ...baseQuery 
      }).populate('author reviewer', 'name email');
    default:
      return this.find({});
  }
};

const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;
