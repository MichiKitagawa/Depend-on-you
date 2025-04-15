# Depen on you service.md – score-service 1.0

# [service.md](http://service.md/) – score-service

## サービス名

score-service

## 概要

reader-action-service によって蓄積された読者行動データと、user-service からの信用スコア情報を元に、作品ごとの評価スコアを算出するサービス。

このスコアはランキング生成やフィード表示に使用される。

## 主な責務

- 再読率、保存率、読了率、コメント密度などの算出
- 信用スコア補正を加味したスコア正規化
- スコア結果の一括提供（定期 or トリガー方式）

## 管理対象データ（抽象）

- 作品ID、期間（過去n日）
- スコア構成項目（数値）
- 最終スコア（正規化済）

## 連携先サービス

- **reader-action-service**：原始行動データの参照
- **user-service**：信用スコアの参照
- **ranking-service**：スコア送信
- **archive-service**：完結作品で再評価が必要な閾値を検出

## 備考

- 機械学習的アプローチも可能だが、初期段階ではルールベースのスコアリングを前提。