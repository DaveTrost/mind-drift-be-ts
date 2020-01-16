import mongoose from 'mongoose';

export const dropCollection = (name: string) => {
  return mongoose.connection.dropCollection(name)
    .catch( (err: mongoose.Error) => {
      if(err.codeName !== 'NamespaceNotFound') throw err;
    });
};

export const dropDatabase = () => mongoose.connection.dropDatabase();
