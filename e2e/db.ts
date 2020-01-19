import mongoose from 'mongoose';

interface CodenameError extends Error {
  codeName?: string;
}

export const dropCollection = async (name: string) => {
  mongoose.connection.dropCollection(name)
    .catch( (err: CodenameError) => {
      if(err.codeName !== 'NamespaceNotFound') throw err;
    });
};

export const dropDatabase = async () => {
  return mongoose.connection.dropDatabase();
}

export const closeConnection = async () => {
  return mongoose.connection.close();
}
