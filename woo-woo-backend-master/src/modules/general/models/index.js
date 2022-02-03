'use strict';

import dotenv from 'dotenv';
dotenv.config();

import { DataTypes } from 'sequelize';

import createUserModel from './user';
import createHealerProfileModel from './healer-profile';
import createLocationModel from './location';
import createReviewModel from './review';
import createServiceModel from './service';
import createTagModel from './tag';
import createReviewTagModel from './review-tag';
import createDiaryModel from './diary';
import createHealerTagModel from './healer-tag';
import createHealerScheduleModel from './healer-schedule';
import createAppointmentModel from './appointment';
import createCancelFeeModel from './cancel-fee';

// const Sequelize = require('sequelize');
import { Sequelize } from 'sequelize';
import databaseConfig from '../../../../database-config';
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../../../../database-config.json')[env];

const config = databaseConfig[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// register user model
const db = {};
db.User = createUserModel(sequelize, DataTypes);
db.HealerProfile = createHealerProfileModel(sequelize, DataTypes);
db.Location = createLocationModel(sequelize, DataTypes);
db.Review = createReviewModel(sequelize, DataTypes);
db.Tag = createTagModel(sequelize, DataTypes);
db.ReviewTag = createReviewTagModel(sequelize, DataTypes);
db.Service = createServiceModel(sequelize, DataTypes);
db.Diary = createDiaryModel(sequelize, DataTypes);
db.HealerTag = createHealerTagModel(sequelize, DataTypes);
db.HealerSchedule = createHealerScheduleModel(sequelize, DataTypes);
db.CancelFee = createCancelFeeModel(sequelize, DataTypes);
db.Appointment = createAppointmentModel(sequelize, DataTypes);

// register models' relationship
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
