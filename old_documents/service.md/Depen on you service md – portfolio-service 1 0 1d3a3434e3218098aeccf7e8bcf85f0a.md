# Depen on you service.md – portfolio-service 1.0

# [service.md](http://service.md/) – portfolio-service

## サービス名

portfolio-service

## 概要

読者がどの作品をどのタイミングでどのように応援・評価したかという行動履歴をポートフォリオとして保存・表示するサービス。

キュレーター評価、信用スコアの証明、特典付与の基礎データとなる。

## 主な責務

- 読者行動の時系列表示（ブースト履歴、再読、保存など）
- 先行者・熱心なファンの証明
- 他ユーザーへの公開範囲設定（任意）

## 管理対象データ（抽象）

- ユーザーID、作品ID、アクション種別・時系列データ

## 連携先サービス

- **reader-action-service**：行動データの取得元
- **user-service**：ユーザー識別
- **curation-service**：プレイリストやレビュー作成時の参照
- **economy-service**：読者報酬評価に活用

## 備考

- ポートフォリオを通じて読者の貢献度を可視化し、キュレーター機能と連動。