const createDiaryModel = (sequelize, DataTypes) => {
  const Diary = sequelize.define(
    'Diary',
    {
      userId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      date: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/,
        },
      },
      //defaultPrice: DataTypes.FLOAT,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['userId'],
        },
        {
          unique: false,
          fields: ['date'],
        },
      ],
    }
  );

  Diary.associate = (models) => {
    Diary.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });
  };
  return Diary;
};

export default createDiaryModel;
