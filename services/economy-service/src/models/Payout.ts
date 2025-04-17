import { Model, DataTypes, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { PayoutReason, UserId, ContentId } from '../../../../shared/schema';

interface PayoutAttributes {
  payout_id: string;
  user_id: UserId;
  content_id: ContentId;
  points: number;
  payout_reason: PayoutReason;
  created_at: Date;
}

interface PayoutCreationAttributes {
  user_id: UserId;
  content_id: ContentId;
  points: number;
  payout_reason: PayoutReason;
}

class Payout extends Model<PayoutAttributes, PayoutCreationAttributes> implements PayoutAttributes {
  public payout_id!: string;
  public user_id!: UserId;
  public content_id!: ContentId;
  public points!: number;
  public payout_reason!: PayoutReason;
  public created_at!: Date;
}

export const initPayoutModel = (sequelize: Sequelize): typeof Payout => {
  Payout.init(
    {
      payout_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      payout_reason: {
        type: DataTypes.ENUM('rankingReward', 'contribution'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'payouts',
      timestamps: false,
    }
  );

  return Payout;
};

export default Payout; 