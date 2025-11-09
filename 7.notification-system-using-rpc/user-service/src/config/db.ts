import mongoose from 'mongoose';
export const dbConnect = async()=>{
  try {    
    const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/rpcuser'
     await mongoose.connect(dbUrl);
     console.log('Database connected successfully')
} catch (error) {
    console.error('Database connection failed ',error)
    throw error
  }
}