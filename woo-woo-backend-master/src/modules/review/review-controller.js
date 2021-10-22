import {
  NotFound,
  Unauthorized,
  Forbidden,
} from '../general/middlewares/error-handle-middleware/error-code';
import jwtHelper from '../general/utils/jwt-helper';
import db from '../general/models';
import { Op, fn, col, literal, Sequelize } from 'sequelize';

/**
 * Get a list of review based on healer id or user id, etc
 */
const getReviewList = async (req, res, next) => {
  try {
    const {
      reviewer: reviewerId,
      healer: healerProfileId,
      limit,
      start,
    } = req.query;
    let reviewList = [];
    if (reviewerId) {
      reviewList = await db.Review.findAll({
        where: {
          reviewerId: reviewerId ? reviewerId : null,
        },
        include: [
          {
            model: db.Tag,
            as: 'tags',
            attributes: ['id', 'name'],
          },
          {
            model: db.Appointment,
            as: 'appointment',
            attributes: ['serviceName'],
          },
          {
            model: db.User,
            as: 'reviewer',
            attributes: [
              [Sequelize.literal('"firstName" || " " || "lastName"'), 'name'], // this is for development
              // [fn('concat', col('firstName'), ' ', col('lastName')), 'name'], // this is for deployment, works for PostgreQL
              'photo',
            ],
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit: limit ? limit : 10,
        offset: start ? start : 0,
      });
    } else if (healerProfileId) {
      reviewList = await db.Review.findAll({
        include: [
          {
            model: db.Tag,
            as: 'tags',
            attributes: ['id', 'name'],
          },
          {
            model: db.Appointment,
            as: 'appointment',
            where: {
              healerProfileId,
            },
            attributes: ['id', 'serviceName'],
          },
          {
            model: db.User,
            as: 'reviewer',
            attributes: [
              [Sequelize.literal('"firstName" || " " || "lastName"'), 'name'], // this is for development
              // [fn('concat', col('firstName'), ' ', col('lastName')), 'name'], // this is for deployment, works for PostgreQL
              'photo',
            ],
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit: limit ? limit : 10,
        offset: start ? start : 0,
      });
    } else {
      reviewList = await db.Review.findAll({
        include: [
          {
            model: db.Tag,
            as: 'tags',
            attributes: ['id', 'name'],
          },
          {
            model: db.Appointment,
            as: 'appointment',
            attributes: ['serviceName'],
          },
          {
            model: db.User,
            as: 'reviewer',
            attributes: [
              [Sequelize.literal('"firstName" || " " || "lastName"'), 'name'], // this is for development
              // [fn('concat', col('firstName'), ' ', col('lastName')), 'name'], // this is for deployment, works for PostgreQL
              'photo',
            ],
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit: limit ? limit : 5,
        offset: start ? start : 0,
      });
    }

    const result = reviewList.map((review) => {
      console.log(review.reviewer.dataValues.photo);
      return {
        ...review.dataValues,
        reviewer: {
          ...review.reviewer.dataValues,
          photo: review.reviewer.dataValues.photo
            ? process.env.PHOTO_STORAGE_DOMAIN +
              review.reviewer.dataValues.photo
            : '',
        },
        appointment: undefined,
        photo: review.photo
          ? process.env.PHOTO_STORAGE_DOMAIN + review.photo
          : '',
        serviceName: review.dataValues.appointment.serviceName, // assume one review must have appointment
      };
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a review based on reviewId
 */
const getReview = async (req, res, next) => {
  try {
    const id = req.params.reviewId;
    const review = await db.Review.findByPk(id, {
      include: [
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['id', 'name'],
        },
        {
          model: db.Appointment,
          as: 'appointment',
          attributes: ['healerProfileId', 'serviceName'],
        },
        {
          model: db.User,
          as: 'reviewer',
          attributes: [
             [Sequelize.literal('"firstName" || " " || "lastName"'), 'name'], // this is for development
            //  [fn('concat', col('firstName'), ' ', col('lastName')), 'name'], // this is for deployment, works for PostgreQL
            'photo',
          ],
        },
      ],
    });
    if (review) {
      review.photo = review.photo
        ? process.env.PHOTO_STORAGE_DOMAIN + review.photo
        : '';

      const result = {
        ...review.dataValues,
        serviceName: review.dataValues.appointment.serviceName,
        appointment: undefined,
        reviewer: {
          photo: review.reviewer.photo
            ? process.env.PHOTO_STORAGE_DOMAIN + review.reviewer.photo
            : '',
          ...review.reviewer.dataValues,
        },
      };
      res.status(200).json(result);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Create a review
 * @note need to use data-form
 */
const createReview = async (req, res, next) => {
  try {
    const { description, rating, appointmentId, tags } = req.body;
    const token = req.headers['authorization'];

    const { user_id } = jwtHelper.getJWTInfo(token);
    // get user id
    const user = await db.User.findOne({
      attributes: ['id'],
      where: {
        uid: user_id,
      },
    });
    if (user === null) {
      throw new Unauthorized();
    }

    // check if this is client's appointment
    const appointment = await db.Appointment.findByPk(appointmentId, {
      attributes: ['id', 'clientId'],
    });
    if (appointment == null) {
      throw new NotFound('Healer is not found');
    }

    if (appointment.dataValues.clientId != user.dataValues.id) {
      throw new Forbidden('You can not leave review other appointment.');
    }
    // get uploading photo
    const photo = req.file ? req.file.filename : '';
    const result = await db.Review.create(
      {
        reviewerId: user.dataValues.id,
        appointmentId,
        description,
        rating,
        photo,
      },
      {
        returning: true,
      }
    );
    if (result.dataValues.photo) {
      result.dataValues.photo =
        process.env.PHOTO_STORAGE_DOMAIN + result.dataValues.photo;
    }
    // save review tag
    let tagList = [];
    if (tags && Array.isArray(tags)) {
      for (let i of tags) {
        await result.addTag(i);
        const tag = await db.Tag.findByPk(i, {
          attributes: ['id', 'name'],
        });
        tagList.push(tag.dataValues);
      }
    }
    const newReview = {
      ...result.dataValues,
      tags: tagList,
    };
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a review based on reviewId
 */
const updateReview = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id } = jwtHelper.getJWTInfo(token);
    const user = await db.User.findOne({
      attributes: ['id'],
      where: {
        uid: user_id,
      },
    });
    const reviewId = req.params.reviewId;
    if (user == null) {
      throw Unauthorized();
    }
    const { description, rating, tags } = req.body;
    const updatedValue = {};
    if (rating) {
      updatedValue.rating = rating;
    }
    if (description) {
      updatedValue.description = description;
    }
    if (req.file) {
      updatedValue.photo = req.file.filename;
    }
    const [rowCount] = await db.Review.update(updatedValue, {
      where: {
        reviewerId: user.dataValues.id,
        id: reviewId,
      },
      include: {
        model: db.Appointment,
        as: 'appointment',
        where: {
          clientId: user.dataValues.id,
        },
      },
      returning: true,
    });
    if (rowCount <= 0) {
      throw new NotFound();
    }

    // check and updating tags
    if (tags && Array.isArray(tags)) {
      const review = await db.Review.findByPk(reviewId);
      review.setTags(tags);
    }

    res.status(204).send('Review has been updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a review based on review id (user has to creator of this review to delete it)
 */
const deleteReview = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id } = jwtHelper.getJWTInfo(token);
    const user = await db.User.findOne({
      attributes: ['id'],
      where: {
        uid: user_id,
      },
    });

    if (!user) {
      throw new Unauthorized();
    }
    const { reviewId } = req.params;
    const rowCount = await db.Review.destroy({
      where: {
        reviewerId: user.dataValues.id,
        id: reviewId,
      },
      returning: true,
    });
    if (rowCount == 0) {
      throw new NotFound();
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default {
  getReviewList,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
