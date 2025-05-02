# Depend on you service.md – archive-service 1.0

# [service.md](http://service.md/) – archive-service

## サービス名

archive-service

## 概要

完結済み作品を一時保存し、過去作品への再評価（再浮上）を監視・管理するサービス。

再評価対象となった作品を feed-service に通知する役割を持つ。

## 主な責務

- 完結作品の登録と保存
- スコア・キュレーションによる再評価条件の監視
- 条件達成時に再配信トリガーを発行

## 管理対象データ（抽象）

- 作品ID、完結ステータス、登録日、最終再配信日

## 連携先サービス

- **content-service**：完結作品の取得元
- **ranking-service**：スコア再上昇の監視
- **curation-service**：プレイリスト経由の評価反映
- **feed-service**：再配信通知

## 備考

- スコアが下がれば再度非表示に戻す等のルール管理も可能。