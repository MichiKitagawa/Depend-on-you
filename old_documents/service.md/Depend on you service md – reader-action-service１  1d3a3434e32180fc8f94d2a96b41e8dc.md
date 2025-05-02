# Depend on you service.md – reader-action-service１.0

# [service.md](http://service.md/) – reader-action-service

## サービス名

reader-action-service

## 概要

読者によるあらゆるアクション（ブースト、保存、再読、感情リアクション、コメントなど）を記録・保持するサービス。

これらのログは、スコア計算・ポートフォリオ表示・信用スコア更新など、多くの下流処理の基礎データとなる。

## 主な責務

- 各種アクションの受付と記録（idempotent 処理）
- ブースト、保存、感情リアクション、コメント投稿の保存
- アクション履歴の取得（ユーザー・作品単位）
- 各アクションの種別分類・タイムスタンプ管理

## 管理対象データ（抽象）

- ユーザーID、作品ID
- アクション種別（boost, save, re-read, comment, reaction）
- コメント本文、リアクション種別（泣いた、鳥肌など）
- 実行日時

## 連携先サービス

- **user-service**：信用スコア更新のための通知
- **score-service**：スコア算出用のアクションログ提供
- **portfolio-service**：読者の行動履歴参照元
- **content-service**：対象作品のID検証

## 備考

- 高頻度な記録処理を想定し、ストリーミング型設計や非同期処理の導入も検討対象。