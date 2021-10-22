import { NotFound } from '../general/middlewares/error-handle-middleware/error-code';
import db from '../general/models';
import jwtHelper from '../general/utils/jwt-helper';

/**
 * Get current user diary by date.
 * The date format must be YYYY-MM-DD
 */
const getDiaryByDate = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id } = jwtHelper.getJWTInfo(token);
    const { date } = req.query;

    // find diary based on userId and date
    const diary = await db.Diary.findOne({
      attributes: ['userId', 'description', 'date'],
      where: {
        date,
      },
      includes: {
        model: db.User,
        where: {
          uid: user_id,
        },
      },
    });
    if (diary == null) {
      res.status(200).json({});
    } else {
      res.status(200).json(diary);
    }
  } catch (err) {
    next(err);
  }
};

const createOrUpdateDiary = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id } = jwtHelper.getJWTInfo(token);
    // date is mandatory for diary info, date format is YYYY-MM-DD
    const diaryInfo = req.body;
    const user = await db.User.findOne({
      attributes: ['id'],
      where: {
        uid: user_id,
      },
    });
    // find diary by user and date to check if it has saved in the database before
    const saveDiary = await db.Diary.findOne({
      where: {
        userId: user.dataValues.id,
        date: diaryInfo.date,
      },
    });
    if (saveDiary == null) {
      // create a new diary
      const newDiary = await db.Diary.create({
        ...diaryInfo,
        userId: user.dataValues.id,
      });
      res.status(201).json(newDiary);
    } else {
      // update the diary
      await db.Diary.update(diaryInfo, {
        where: {
          userId: user.dataValues.id,
          date: diaryInfo.date,
        },
      });
      res.status(200).send('The diary has been updated successfully');
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getDiaryByDate,
  createOrUpdateDiary,
};
