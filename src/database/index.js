import Sequelize from 'sequelize';

import mongoose from 'mongoose';
import User from '../app/models/User';
import File from '../app/models/file';
import Appointment from '../app/models/appointment';

import databaseconfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseconfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // sudo docker run --name mongobarber -p 27017:27017 -d -t mongo

  mongo() {
    this.mogoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database(databaseconfig);