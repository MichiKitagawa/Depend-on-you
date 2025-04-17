import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { v4 as uuidv4 } from 'uuid';

// Feedモデルのインターフェース
export interface FeedAttributes {
  feed_id: string;
  user_id: string;
  content_list: {
    contentId: string;
    scoreValue: number;
  }[];
  generated_at: Date;
}

// Feedモデルの作成オプション
export interface FeedCreationAttributes {
  user_id: string;
  content_list: {
    contentId: string;
    scoreValue: number;
  }[];
}

// Feedモデルクラスを定義
class Feed extends Model<FeedAttributes, FeedCreationAttributes> implements FeedAttributes {
  public feed_id!: string;
  public user_id!: string;
  public content_list!: {
    contentId: string;
    scoreValue: number;
  }[];
  public generated_at!: Date;

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Feedモデルの初期化
Feed.init(
  {
    feed_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4()
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content_list: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'feeds',
    timestamps: true
  }
);

export default Feed; 