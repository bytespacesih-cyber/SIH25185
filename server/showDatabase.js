import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Proposal from './models/Proposal.js';

dotenv.config();

async function showAllData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 CURRENT DATABASE CONTENTS:');
    console.log('=============================\n');
    
    // Show all users
    const users = await User.find({});
    console.log(`👥 USERS STORED (${users.length} total):`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🏷️  Role: ${user.role}`);
      console.log(`   🏢 Department: ${user.department || 'Not specified'}`);
      console.log(`   📅 Created: ${user.createdAt.toDateString()}\n`);
    });
    
    // Show all proposals
    const proposals = await Proposal.find({}).populate('author', 'name email');
    console.log(`📋 PROPOSALS STORED (${proposals.length} total):`);
    if (proposals.length === 0) {
      console.log('   No proposals yet - but system is ready to store them!\n');
    } else {
      proposals.forEach((proposal, index) => {
        console.log(`${index + 1}. "${proposal.title}"`);
        console.log(`   👤 Author: ${proposal.author?.name}`);
        console.log(`   💰 Budget: $${proposal.budget.toLocaleString()}`);
        console.log(`   📊 Status: ${proposal.status}`);
        console.log(`   🏷️  Domain: ${proposal.domain}`);
        console.log(`   📅 Created: ${proposal.createdAt.toDateString()}\n`);
      });
    }
    
    console.log('✅ Database is working and storing data successfully!');
    console.log(`🔗 Connection: ${process.env.MONGODB_URI}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

showAllData();