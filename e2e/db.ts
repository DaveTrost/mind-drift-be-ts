import mongoose from 'mongoose';

interface CodenameError extends Error {
  codeName?: string;
}

export const dropCollection = (name: string) => {
  return mongoose.connection.dropCollection(name)
    .catch( (err: CodenameError) => {
      if(err.codeName !== 'NamespaceNotFound') throw err;
    });
};

export const dropDatabase = () => mongoose.connection.dropDatabase();
