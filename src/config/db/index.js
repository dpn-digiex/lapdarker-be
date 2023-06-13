// connect model with database
import mongoose from 'mongoose';
const URI = process.env.DATABASE_URL;

export default async function connectDB() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // useCreateIndex: true,
    });
    console.log('Access Database Success!');
  } catch (error) {
    console.log('Access Database FAIL!');
  }
}
