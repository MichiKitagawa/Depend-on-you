import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RankingAttributes {
  ranking_id: string;
  content_id: string;
  rank_position: number;
  cluster_type: string;
  score_value: number;
  updated_at: Date;
}

interface RankingCreationAttributes extends Optional<RankingAttributes, 'ranking_id'> {}

class Ranking extends Model<RankingAttributes, RankingCreationAttributes> implements RankingAttributes {
  public ranking_id!: string;
  public content_id!: string;
  public rank_position!: number;
  public cluster_type!: string;
  public score_value!: number;
  public updated_at!: Date;
}

Ranking.init(
  {
    ranking_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rank_position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cluster_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize,
    modelName: 'Ranking',
    tableName: 'rankings',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: false,
  }
);

export default Ranking; 