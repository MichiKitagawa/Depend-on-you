import { Model, DataTypes, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { RevenueType } from '../../../../shared/schema';

interface RevenueAttributes {
  revenue_id: string;
  revenue_type: RevenueType;
  amount: number;
  created_at: Date;
}

interface RevenueCreationAttributes {
  revenue_type: RevenueType;
  amount: number;
}

class Revenue extends Model<RevenueAttributes, RevenueCreationAttributes> implements RevenueAttributes {
  public revenue_id!: string;
  public revenue_type!: RevenueType;
  public amount!: number;
  public created_at!: Date;
}

export const initRevenueModel = (sequelize: Sequelize): typeof Revenue => {
  Revenue.init(
    {
      revenue_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      revenue_type: {
        type: DataTypes.ENUM('ad', 'subscription', 'goods'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'revenues',
      timestamps: false,
    }
  );

  return Revenue;
};

export default Revenue; 