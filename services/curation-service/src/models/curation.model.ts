import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { CurationId, UserId } from '../../../../shared/schema';

// Curation model interface
export interface CurationAttributes {
  curation_id: CurationId;
  user_id: UserId;
  title: string;
  items: string[]; // Array of contentIds
  review_body?: string; // Optional review text
  created_at: Date;
  updated_at: Date;
}

// Sequelize Model
class Curation extends Model<CurationAttributes> implements CurationAttributes {
  public curation_id!: CurationId;
  public user_id!: UserId;
  public title!: string;
  public items!: string[];
  public review_body?: string;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize Curation model
Curation.init(
  {
    curation_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    review_body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'curation',
    tableName: 'curations',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Curation; 