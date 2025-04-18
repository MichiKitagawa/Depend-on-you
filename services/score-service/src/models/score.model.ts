import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../utils/database';
import { ContentId, ScoreId } from '../schema';

// スコア詳細の型定義
interface ScoreDetail {
  reReadRate: number;
  saveRate: number;
  commentDensity: number;
  userScoreFactor: number;
}

// スコアモデルの属性インターフェース
export interface ScoreAttributes {
  scoreId: ScoreId;
  contentId: ContentId;
  scoreValue: number;
  detail: ScoreDetail;
  updatedAt: Date;
}

// インスタンスの型定義（作成時の属性）
export interface ScoreCreationAttributes {
  contentId: ContentId;
  scoreValue: number;
  detail: ScoreDetail;
}

// スコアモデルクラス
class Score extends Model<ScoreAttributes, ScoreCreationAttributes> implements ScoreAttributes {
  public scoreId!: ScoreId;
  public contentId!: ContentId;
  public scoreValue!: number;
  public detail!: ScoreDetail;
  public updatedAt!: Date;
}

// モデル初期化
Score.init(
  {
    scoreId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    contentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    scoreValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    detail: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Score',
    tableName: 'scores',
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: false,
  }
);

export default Score; 