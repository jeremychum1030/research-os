# 科研全生命週期 Workflow Blueprint

版本：0.1
狀態：架構草案，可進入 MVP 設計
定位：以 Hermes skills 為執行能力，以標準化科研 artifact 為交接單位，支援獨立 workflow、組合 workflow 和一條龍科研服務。

## 1. 設計目標

### 1.1 核心目標

- 覆蓋研究構思、文獻、設計、數據、統計、寫作、審稿、投稿和修回。
- 每個模組可以單獨使用，也可以被總流程調用。
- 每個階段都產生可保存、可追溯、可核驗的 artifact。
- 支援中途加入、暫停、回退、分支、重跑和跨 session 繼續。
- 把「AI 建議」和「已由來源/數據核驗的結論」分開。
- 對臨床、醫學、統計和投稿等高風險階段設置阻斷式質量 gate。
- 未來可包裝為 Web app、桌面 app 或手機小程序。

### 1.2 非目標

- 不替代倫理審查、IRB、GCP、統計師、醫生、研究 PI 或期刊編輯。
- 不自動把推測寫成研究結果。
- 不把搜索結果當成證據，不把公開數據當成可自由重用。
- 不在沒有原始數據、代碼或來源時聲稱完成重新分析。
- 不讓總 orchestrator 自己撰寫實質內容；它只負責路由、狀態、交接和 gates。

## 2. 三層架構

```text
科研產品層
  ├── 全流程：Research-to-Publication Pipeline
  ├── 專題流程：Literature / Design / Data / Writing / Submission
  └── 單點工具：Search / Extract / Power / Claim Audit / Polish

Workflow 編排層
  ├── Router：判斷目前階段和可用材料
  ├── State Machine：管理狀態、依賴、分支和回退
  ├── Artifact Bus：標準化輸入/輸出和版本
  ├── Quality Gates：通過、警告、阻斷
  └── Human Checkpoints：需要研究者決策時停下來

能力執行層
  ├── Hermes skills
  ├── Web / PubMed / Crossref / arXiv 等資料來源
  ├── Python/R/統計/組學工具
  └── 文件、圖表、LaTeX、DOCX、PDF 輸出工具
```

## 3. 科研項目主狀態機

```text
INTAKE
  ↓
QUESTION_DEFINED
  ↓
LANDSCAPE_MAPPED
  ↓
EVIDENCE_CORPUS_READY
  ↓
EVIDENCE_SYNTHESIZED
  ↓
NOVELTY_CANDIDATES_READY
  ↓
DESIGN_READY
  ↓
PROTOCOL_READY
  ↓
DATA_READY
  ↓
ANALYSIS_READY
  ↓
RESULTS_VERIFIED
  ↓
MANUSCRIPT_DRAFTED
  ↓
INTEGRITY_PASSED
  ↓
PEER_REVIEWED
  ↓
REVISION_COMPLETED
  ↓
SUBMISSION_READY
  ↓
SUBMITTED
  ↓
REVIEWER_RESPONSE_READY
  ↓
FINALIZED
```

### 3.1 可回退分支

- `QUESTION_DEFINED → INTAKE`：研究問題仍然過寬或不可證偽。
- `EVIDENCE_SYNTHESIZED → LANDSCAPE_MAPPED`：文獻衝突需要擴大檢索。
- `DESIGN_READY → QUESTION_DEFINED`：方法不能回答研究問題。
- `PROTOCOL_READY → DESIGN_READY`：樣本、測量、分析或倫理資訊不足。
- `RESULTS_VERIFIED → DATA_READY`：數據、代碼、分析單位或結果不一致。
- `INTEGRITY_PASSED → MANUSCRIPT_DRAFTED`：引用、數字、聲明或來源核驗失敗。
- `PEER_REVIEWED → MANUSCRIPT_DRAFTED`：審稿結論要求研究或論證重構。
- `SUBMISSION_READY → MANUSCRIPT_DRAFTED`：格式或披露不符合目標期刊要求。

### 3.2 暫停、重跑和分支

每次執行都記錄：

- `project_id`
- `workflow_run_id`
- `stage`
- `input_artifact_ids`
- `output_artifact_ids`
- `skill_version`
- `source_snapshot`
- `decision_log`
- `quality_gate_results`
- `human_approval`

重跑規則：輸入 artifact 未變更時可復用；輸入、skill 版本、來源或規則變更時必須重新執行相關節點。

## 4. Workflow 分層

## A. 入口與項目管理

### W00 — Research Intake

用途：收集研究興趣、已有材料、目標、限制和時間表。

- Skills：`rw-research-router`、`rw-research-passport`
- 輸入：自然語言描述、文件、網址、數據目錄、審稿意見
- 輸出：`Research Intake Brief`、材料清單、缺口清單、建議入口
- Gate：研究目標、研究對象、輸入材料、輸出期望已明確

### W01 — Research Router

用途：判斷目前研究階段，選一個主 workflow，不同時啟動不必要的流程。

- Skills：`rw-research-router`
- 輸入：Intake Brief、現有 artifact
- 輸出：`Routing Decision`
- Gate：只能選一個主 workflow；並列任務需建立明確依賴

### W02 — Research Passport

用途：維護可交接、可恢復的研究項目狀態。

- Skills：`rw-research-passport`
- 輸入：所有已確認材料和決策
- 輸出：`Research Passport JSON`
- Gate：每次重大決策、版本變更和未解問題都有記錄

## B. 研究問題與創新

### W10 — Research Question Formation

用途：把研究興趣轉成對象、構念、範圍、可檢索、可證偽的問題。

- Skills：`rw-research-question`
- 輸出：`RQ Brief`、PICO/PECO/SPIDER 或適用問題框架、證偽條件
- Gate：問題可研究、可操作、可由資料回答

### W11 — Research Landscape Mapping

用途：建立領域地圖、概念、關鍵作者、方法、爭議和資料來源。

- Skills：`academic-deep-research`、`research-synthesis`
- 輸出：`Landscape Map`、初步來源圖、研究邊界
- Gate：來源多樣、時間範圍和資料庫範圍清楚

### W12 — Novelty Discovery

用途：把證據 gap、衝突和異常轉成候選創新點。

- Skills：`rw-research-novelty`
- 輸出：`Novelty Candidates`、貢獻、可行性、證偽條件、風險
- Gate：禁止使用沒有完成檢索支持的「首次」「從未」

## C. 文獻與證據

### W20 — Literature Search Design

用途：制定檢索式、資料庫、納排標準、時間範圍和停止規則。

- Skills：`rw-literature-discovery`、`rw-review-methods`
- 輸出：`Search Protocol`
- Gate：可重現、可記錄、每個限制有理由

### W21 — Literature Retrieval

用途：按 protocol 查找和核驗文獻。

- Skills：`paper-lookup`、`pubmed-database`、`arxiv-watcher`、`academic-deep-research`
- 輸出：`Source Registry`、DOI/PMID/arXiv metadata、來源快照
- Gate：去重、來源身份核驗、標記預印本和正式出版版本

### W22 — Paper Extraction

用途：從正文、補充材料和圖表提取研究設計、樣本、測量、結果和限制。

- Skills：`rw-paper-extractor`、`pdf-extract`、`paper-analysis-assistant`
- 輸出：`Paper Cards`、欄位缺失清單、原文位置
- Gate：所有關鍵數字帶來源位置；缺失項不可猜測

### W23 — Evidence Mapping

用途：將研究、構念、樣本、結果、偏倚、衝突和 gap 連成證據圖。

- Skills：`rw-evidence-map`、`research-synthesis`
- 輸出：`Evidence Map`、支持/反駁/不確定關係
- Gate：區分單一來源、獨立重複和引用鏈轉述

### W24 — Claim-to-Source Audit

用途：逐條核驗論文主張與來源原文是否匹配。

- Skills：`rw-claim-audit`、`citation-management`
- 輸出：`Claim Audit Matrix`
- Gate：高風險主張、數字、因果語句和臨床結論不能有未核驗狀態

## D. 研究設計與方案

### W30 — Study Design

用途：將 RQ 轉成設計、對照、變量、樣本、測量、分析和證偽計劃。

- Skills：`rw-research-design`、`experimental-design`
- 輸出：`Study Design Brief`
- Gate：設計能回答 RQ；主要終點、暴露、對照和偏倚策略明確

### W31 — Protocol Builder

用途：產出可執行研究方案、操作流程、時間表和責任矩陣。

- Skills：`rw-research-design`、`case-lifecycle-planning`（適用時）
- 輸出：`Study Protocol`
- Gate：程序可執行、資源足夠、依從性和偏差控制已寫明

### W32 — Sample Size & Power

用途：預先設定效應量、樣本量、power、alpha、dropout 和最小可檢測差異。

- Skills：`statistical-power`、`statistical-analysis`
- 輸出：`Power Analysis Report`
- Gate：假設有來源；不能用事後 power 冒充設計前 power

### W33 — Bias, Ethics & Feasibility Review

用途：檢查選擇偏差、測量偏差、混雜、替代解釋、倫理和可行性。

- Skills：`rw-research-referee`、`thinking-red-team`、`clinical-decision-support`（醫學時）
- 輸出：`Pre-registration Risk Review`
- Gate：重大偏差、倫理或可行性問題阻斷 protocol

## E. 數據、計算和統計

### W40 — Data Readiness

用途：核驗資料來源、版本、標識符、權限、缺失、代碼和可重用限制。

- Skills：`rw-research-data`、`data-throughput-accelerator`
- 輸出：`Data Readiness Report`、`Data Dictionary`、provenance 記錄
- Gate：來源、版本和資料使用權限可追溯

### W41 — Data Cleaning & Exploration

用途：數據導入、清理、缺失、異常、分布、重複和探索性圖表。

- Skills：`data-analyst`、`exploratory-data-analysis`、`pandas`、`polars`、`dask`、`vaex`
- 輸出：`EDA Report`、清理規則、分析資料集版本
- Gate：原始資料 immutable；每個清理規則有記錄

### W42 — Statistical Analysis Plan

用途：預先定義主要分析、次要分析、模型、協變量、缺失資料、敏感性分析和 multiplicity。

- Skills：`statistical-analysis`、`statsmodels`、`pymc`、`rw-statistics-audit`
- 輸出：`SAP`、分析決策記錄
- Gate：分析計劃先於結果解讀；探索性和確認性分析分開

### W43 — Domain Analysis

用途：按科研領域執行實際分析。

- 通用：`scikit-learn`、`statsmodels`、`pymc`、`networkx`
- 組學：`scanpy`、`pydeseq2`、`anndata`、`pysam`、`biopython`
- 分子/藥物：`rdkit`、`deepchem`、`diffdock`、`torchdrug`、`molecular-dynamics`
- 通路：`pathway-enrichment`
- 時間序列：`aeon`、`timesfm-forecasting`
- 輸出：`Analysis Notebook`、模型、表格、圖表、log
- Gate：環境、版本、隨機種子、輸入和輸出可重現

### W44 — Statistical & Results Audit

用途：核對分析單位、重複層級、n、模型、p 值、CI、效應量、圖表和正文。

- Skills：`rw-statistics-audit`、`statistical-analysis`、`thinking-bayesian`
- 輸出：`Results Audit Matrix`
- Gate：任何數字對不上時阻斷進入寫作定稿

### W45 — Reproducibility Package

用途：整理代碼、環境、資料字典、分析順序、版本和執行說明。

- Skills：`rw-research-data`、`content-hash-cache-pattern`、`verification-loop`
- 輸出：`Reproducibility Manifest`
- Gate：第三方可根據說明重跑核心分析，或明確記錄不可重跑原因

## F. 論文寫作與圖表

### W50 — Manuscript Architecture

用途：將 RQ、證據、設計和結果轉成論文結構和論證主線。

- Skills：`academic-paper`、`rw-phd-write`
- 輸出：`Manuscript Outline`、圖表計劃、段落功能表
- Gate：每個結論都能回到研究問題和證據

### W51 — Manuscript Drafting

用途：撰寫摘要、引言、方法、結果、討論、限制和結論。

- Skills：`rw-phd-write`、`scientific-writing`、`academic-paper`
- 輸出：`Manuscript Draft`
- Gate：不補造來源、不生成不存在的數據、不混淆結果和推論

### W52 — Scientific Figures & Tables

用途：生成科研圖、統計圖、流程圖、表格和圖注。

- Skills：`scientific-visualization`、`matplotlib`、`seaborn`、`scientific-schematics`、`diagram-maker`
- 輸出：`Figure Package`、`Table Package`、圖注
- Gate：圖表數字來自已核驗資料；色彩、標籤、尺度和單位完整

### W53 — Language & Tone Editing

用途：在不改變科學含義的前提下改善語氣、結構、清晰度和英文表達。

- Skills：`rw-phd-tone`、`copy-editing`、`edit-article`、`humanizer`、`write`
- 輸出：`Polished Manuscript`、修改摘要
- Gate：語言修改不得改變效應方向、限制、因果強度或不確定性

## G. 完整性、審稿與投稿

### W60 — Pre-review Integrity Gate

用途：投稿前獨立核驗引用、來源、數字、數據、圖表、方法、披露和 AI 研究失敗模式。

- Skills：`academic-pipeline`、`rw-claim-audit`、`rw-statistics-audit`、`rw-research-data`
- 輸出：`Pre-review Integrity Report`
- Gate：高風險問題必須修正或由研究者明確記錄接受限制

### W61 — Peer Review Simulation

用途：模擬編輯、方法學審稿人、統計審稿人、領域審稿人和反方審稿人。

- Skills：`academic-paper-reviewer`、`rw-research-referee`、`thinking-red-team`
- 輸出：`Review Reports`、編輯決定、`Revision Roadmap`
- Gate：每個 major/minor 問題要有處置狀態

### W62 — Revision & Response

用途：逐條處理審稿意見，生成修改稿和 response to reviewers。

- Skills：`rw-revision-patch`、`academic-paper`、`rw-phd-tone`
- 輸出：`Revised Manuscript`、`Response Matrix`
- Gate：只修改批准範圍；每條意見有原文、回應、位置和證據

### W63 — Re-review

用途：檢查修回是否真正解決問題，是否引入新問題。

- Skills：`academic-paper-reviewer`、`rw-claim-audit`、`rw-statistics-audit`
- 輸出：`Re-review Report`
- Gate：major 問題未解決則返回 W62

### W64 — Journal Submission

用途：核驗目標期刊最新要求、格式、字數、圖表、披露、倫理、數據聲明和投稿文件。

- Skills：`rw-journal-submission`、`venue-templates`、`citation-management`
- 輸出：`Submission Package`、投稿 checklist、cover letter、response 文件
- Gate：期刊要求必須回到官方頁面核驗，不能依賴過時模板

### W65 — Final Integrity & Finalize

用途：定稿前最後一次獨立核驗並輸出 MD/DOCX/LaTeX/PDF。

- Skills：`academic-pipeline`、`academic-paper`、`rw-claim-audit`、`rw-statistics-audit`
- 輸出：`Final Manuscript`、`Final Integrity Report`、`Process Record`
- Gate：零未處理高風險問題；版本 hash 固定；輸出文件可開啟

## 5. 獨立 workflow 的統一契約

每個 workflow 必須包含以下 metadata：

```yaml
workflow_id: Wxx-name
version: 0.1.0
purpose: one sentence
entry_conditions:
  - required artifacts
optional_inputs:
  - optional artifacts
skills:
  - skill-name
produces:
  - artifact-type
quality_gates:
  - gate-id
human_decisions:
  - decision-id
failure_modes:
  - failure-id
rerun_policy: input-hash-and-skill-version
handoff_targets:
  - workflow-id
```

每個 artifact 至少包含：

```yaml
artifact_id:
project_id:
artifact_type:
version:
created_at:
created_by:
source_artifacts: []
source_registry: []
content_hash:
status: draft|verified|blocked|superseded
claims: []
limitations: []
open_questions: []
quality_gates: []
```

## 6. 一條龍主流程

```text
W00 Intake
→ W01 Router
→ W02 Passport
→ W10 Research Question
→ W11 Landscape
→ W20 Search Design
→ W21 Retrieval
→ W22 Extraction
→ W23 Evidence Map
→ W12 Novelty
→ W30 Study Design
→ W31 Protocol
→ W32 Power
→ W33 Bias/Ethics Review
→ W40 Data Readiness
→ W41 EDA
→ W42 SAP
→ W43 Domain Analysis
→ W44 Results Audit
→ W45 Reproducibility
→ W50 Manuscript Architecture
→ W51 Drafting
→ W52 Figures/Tables
→ W53 Editing
→ W60 Integrity Gate
→ W61 Peer Review
→ W62 Revision
→ W63 Re-review
→ W64 Submission
→ W65 Final Integrity/Finalize
```

### 6.1 自適應策略

- 沒有數據：停在 W33，先完成方案和 power，不進分析。
- 已有數據：可從 W40 中途進入，但必須補 W10/W30 的前置檢查。
- 已有論文：從 W60 開始，但不能跳過完整性 gate。
- 已收到審稿意見：直接進 W62，再進 W63 和 W65。
- 只想查一篇論文：只啟動 W21/W22，不啟動全流程。
- 只想潤色：只啟動 W53，禁止改變科學結論。
- 只想投稿：W64 必須先建立或驗證 W60 的完整性結果。

## 7. Quality Gate 分級

### G0 — 信息完整性

材料、研究問題、範圍、目標輸出已足夠。

### G1 — 科學可行性

研究問題可回答；設計、樣本、測量和分析相互一致。

### G2 — 證據完整性

來源身份、引用位置、主張和證據關係可追溯。

### G3 — 數據/統計完整性

數據版本、分析單位、重複、模型、n、效應量和報告一致。

### G4 — 可重現性

環境、代碼、輸入、輸出和分析順序可記錄或明確說明限制。

### G5 — 臨床/倫理安全

涉及人體、患者、醫療建議或倫理時，必須標示專業審批邊界。

### G6 — 發表完整性

目標期刊要求、格式、披露、數據聲明和 response 文件已核驗。

## 8. Hermes 中的實作方式

第一階段不新增大量 code，先用以下三類 skill 組成 workflow：

1. **Router skill**：只做 intake、路由和狀態更新。
2. **Atomic workflow skills**：每個 Wxx 一個可獨立調用的 skill。
3. **Shared schemas/references**：統一保存 artifact schema、gate 規則和交接模板。

建議新增的核心 skills：

- `research-os-router`
- `research-intake-workflow`
- `research-design-workflow`
- `literature-evidence-workflow`
- `data-statistics-workflow`
- `manuscript-production-workflow`
- `submission-review-workflow`
- `research-quality-gates`
- `research-artifact-schemas`

現有 `academic-pipeline` 不刪除，定位調整為：

- 論文產出子流程 orchestrator；或
- 由新的 `research-os-router` 調用的 W50-W65 執行器。

## 9. 未來 App / 小程序產品結構

### 9.1 首頁

- 新建研究項目
- 繼續上一個研究項目
- 單獨使用某個 workflow
- 查看研究項目 dashboard
- 查看待處理 quality gate

### 9.2 項目 Dashboard

- 當前階段
- 已完成 artifact
- 阻斷問題
- 下一步建議
- 來源和引用數量
- 統計/數據完整性狀態
- 版本和變更歷史
- 一鍵暫停、分支、重跑

### 9.3 Workflow 卡片

每個 workflow 顯示：

- 目的
- 需要什麼輸入
- 會產生什麼輸出
- 需要多久/多少交互
- 可用的 skills
- 是否需要人類確認
- 風險級別
- 上游和下游 workflow

### 9.4 研究項目資料模型

```text
User
  └── ResearchProject
        ├── ResearchQuestion
        ├── SourceRegistry
        ├── EvidenceCorpus
        ├── StudyProtocol
        ├── DataAsset
        ├── AnalysisRun
        ├── Manuscript
        ├── ReviewRound
        ├── SubmissionPackage
        ├── ArtifactVersion[]
        ├── QualityGate[]
        └── DecisionLog[]
```

### 9.5 MVP 優先順序

**MVP-1：科研項目管理和單點 workflow**

- Research Intake
- Research Passport
- Research Question
- Literature Search
- Paper Extraction
- Evidence Map
- Claim Audit

**MVP-2：研究方案和數據統計**

- Study Design
- Protocol
- Power Analysis
- Data Readiness
- EDA
- SAP
- Statistics Audit

**MVP-3：論文和投稿**

- Manuscript Architecture
- Drafting
- Figures/Tables
- Tone Editing
- Integrity Gate
- Peer Review
- Revision
- Journal Submission

**MVP-4：智能編排和團隊協作**

- 一條龍 Pipeline
- 多人/多 agent 協作
- 任務分派
- 版本分支
- 審批流程
- 統一研究 provenance

## 10. 第一版驗收標準

第一版不應只測試「能否產生文字」，而要測試：

- 同一研究項目能否從任一階段進入。
- 每個 workflow 能否獨立執行並產出 artifact。
- artifact 能否被下一個 workflow 正確消費。
- 缺少前置條件時是否阻斷而不是猜測。
- 來源、數字、版本和決策能否追溯。
- 修改後是否只重跑受影響的節點。
- 論文潤色是否保留科學含義和不確定性。
- 審稿意見是否逐條有處置狀態。
- 最終輸出是否有 integrity report 和 reproducibility manifest。
- 所有涉及臨床、倫理、統計和投稿的高風險決策是否保留人工確認。

## 11. 建議的第一個實作任務

先不要立即開發完整 app。第一個可驗證切片應是：

```text
Research Intake
→ Research Question
→ Literature Search
→ Paper Extraction
→ Evidence Map
→ Claim Audit
```

原因：

- 不依賴真實實驗數據或複雜計算環境。
- 可以立即驗證 artifact schema 和 workflow handoff。
- 對 Roche/MedCore 的醫學文獻工作最直接有用。
- 會先暴露路由、來源、引用和狀態管理的核心問題。
- 成功後可自然擴展到 Study Design、SAP 和 Manuscript。
