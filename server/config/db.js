import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MongoDB URI not found! Please set MONGO_URI or MONGODB_URI in server/.env')
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
