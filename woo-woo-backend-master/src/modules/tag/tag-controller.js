import db from '../general/models';

const getTagList = async (req, res, next) => {
  try {
    const result = await db.Tag.findAll({
      attributes: ['id', 'name'],
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default {
  getTagList,
};
