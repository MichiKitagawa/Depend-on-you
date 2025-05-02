# Depen on you service.md – curation-service 1.0

# [service.md](http://service.md/) – curation-service

## サービス名

curation-service

## 概要

読者が作成するプレイリストやレビュー、作品推薦を管理するサービス。

任意の読者がキュレーターとして作品を広めるための機能を支える。

## 主な責務

- プレイリストの作成・編集・公開
- レビュー（短文・長文）の投稿と管理
- 推薦経由のクリック計測（任意）

## 管理対象データ（抽象）

- プレイリストID、作品IDリスト、レビューID、本文、作成者ID

## 連携先サービス

- **portfolio-service**：ユーザーの過去行動との関連付け
- **feed-service**：推薦経由の作品表示
- **archive-service**：完結作品への再注目トリガー

## 備考

- 推薦・レビューは信用スコアとは独立して扱うが、後の評価対象にもなり得る。