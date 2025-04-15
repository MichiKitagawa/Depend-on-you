# Depend on you service.md – economy-service 1.0

# [service.md](http://service.md/) – economy-service

## サービス名

economy-service

## 概要

プラットフォームにおける経済処理を一手に担うサービス。

広告・課金・グッズなどの収益を集約し、読者や作者への報酬ポイントを算出・配分する。

## 主な責務

- 各種収益（広告視聴、課金、購入）の記録
- ユーザー・作品ごとの報酬ポイントの配分ロジック実装
- 報酬明細の表示、使用履歴管理（非現金型）

## 管理対象データ（抽象）

- ユーザーID、作品ID、収益種別、ポイント履歴、付与トリガー

## 連携先サービス

- **user-service**：報酬配分対象者の信用スコア参照
- **portfolio-service**：読者貢献度に基づく配分
- **ranking-service**：作品の人気指標反映
- **content-service**：作者への紐づけ

## 備考

- 実通貨連携は想定せず、プラットフォーム内エコノミーで完結。