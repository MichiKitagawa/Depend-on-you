import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../utils/database';
import { ArchiveId, ContentId } from '../../../../shared/schema';

// アーカイブのインターフェース定義
interface ArchiveAttributes {
  archiveId: ArchiveId;
  contentId: ContentId; 
  archivedAt: Date;
  lastTrigger?: Date;
}

// 作成時のオプショナル属性
interface ArchiveCreationAttributes extends Optional<ArchiveAttributes, 'archiveId' | 'archivedAt' | 'lastTrigger'> {}

// アーカイブモデルクラス
class Archive extends Model<ArchiveAttributes, ArchiveCreationAttributes> implements ArchiveAttributes {
  public archiveId!: ArchiveId;
  public contentId!: ContentId;
  public archivedAt!: Date;
  public lastTrigger?: Date;

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // モデルメソッド
  static async findByContentId(contentId: ContentId): Promise<Archive | null> {
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