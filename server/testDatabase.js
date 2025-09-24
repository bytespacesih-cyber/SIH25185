import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Proposal from './models/Proposal.js';

dotenv.config();

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check users in database
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`   👤 ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check proposals in database
    const proposals = await Proposal.find({}).populate('author', 'name email');
    console.log(`\n📋 Found ${proposals.length} proposals in database:`);
    proposals.forEach(proposal => {
      console.log(`   📄 "${proposal.title}" by ${proposal.author?.name} - Status: ${proposal.status}`);
    });

    // Test creating a sample proposal
    if (users.length > 0) {
      const sampleUser = users.find(u => u.role === 'user');
      if (sampleUser) {
        const testProposal = new Proposal({
          title: "AI-Powered Healthcare Diagnosis System",
          description: "Developing an AI system to assist doctors in medical diagnosis using machine learning algorithms and medical imaging.",
          domain: "Artificial Intelligence & Healthcare",
          budget: 150000,
          author: sampleUser._id,
          tags: ["AI", "Healthcare", "Machine Learning"],
          status: "submitted"
        });

        await testProposal.save();
        console.log('\n✅ Successfully created test proposal');
        console.log(`   📄 Title: ${testProposal.title}`);
        console.log(`   💰 Budget: $${testProposal.budget}`);
        console.log(`   👤 Author: ${sampleUser.name}`);
      }
    }

    console.log('\n🎉 Database is working perfectly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

testDatabase();