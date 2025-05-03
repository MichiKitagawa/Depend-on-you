import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../utils/database';
// ArchiveId, ContentId を削除
import { } from '../schema';

// アーカイブのインターフェース定義
interface ArchiveAttributes {
  archiveId: string; // string に変更
  contentId: string; // string に変更
  archivedAt: Date;
  lastTrigger?: Date;
}

// 作成時のオプショナル属性
interface ArchiveCreationAttributes extends Optional<ArchiveAttributes, 'archiveId' | 'archivedAt' | 'lastTrigger'> {}

// アーカイブモデルクラス
class Archive extends Model<ArchiveAttributes, ArchiveCreationAttributes> implements ArchiveAttributes {
  public archiveId!: string; // string に変更
  public contentId!: string; // string に変更
  public archivedAt!: Date;
  public lastTrigger?: Date;

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // モデルメソッド
  // contentId の型を string に変更
  static async findByContentId(contentId: string): Promise<Archive | null> {
    return Archive.findOne({
      where: {
        contentId
      }
    });
  }
}

// モデル初期化
Archive.init(
  {
    archiveId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    contentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    archivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastTrigger: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Archive',
    tableName: 'archives',
    timestamps: true,
  }
);

export default Archive; 