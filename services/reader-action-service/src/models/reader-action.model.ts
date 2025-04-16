import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';

// ActionType と ActionPayload を直接定義
export type ActionType = 'boost' | 'save' | 'comment' | 'reaction';

export interface ReactionPayload {
  emotion: 'cry' | 'wow' | 'heart' | 'smile' | 'angry';
}

export interface CommentPayload {
  commentText: string;
}

export type ActionPayload = ReactionPayload | CommentPayload | Record<string, any>;

export interface ReaderActionAttributes {
  actionId: string;
  userId: string;
  contentId: string;
  actionType: ActionType;
  payload: ActionPayload;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReaderActionCreationAttributes extends Omit<ReaderActionAttributes, 'actionId' | 'createdAt' | 'updatedAt'> {}

export class ReaderAction extends Model<ReaderActionAttributes, ReaderActionCreationAttributes> implements ReaderActionAttributes {
  public actionId!: string;
  public userId!: string;
  public contentId!: string;
  public actionType!: ActionType;
  public payload!: ActionPayload;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ReaderAction.init(
  {
    actionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['boost', 'save', 'comment', 'reaction']],
      },
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'reader_actions',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
); 