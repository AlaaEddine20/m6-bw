module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "like",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false }
  );
  Like.associate = (models) => {
    Like.belongsTo(models.User);
    Like.belongsTo(models.Post);
  };
  return Like;
};
