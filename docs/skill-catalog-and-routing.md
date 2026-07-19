# Hermes Skill Catalog and Routing Model

版本：0.1
範圍：active Hermes profile 的科研與通用 skill 整理
原則：不刪除現有 skills；透過 routing 和 role 分層降低重複調用。

## 1. Skill 角色分層

### L0：總入口 / Router

只負責判斷意圖、研究階段、研究型態、可用材料和下一步。L0 不直接同時執行所有 skills。

- `research-os-router`：科研產品的唯一總入口
- `rw-research-router`：日常科研階段路由
- `academic-pipeline`：完整論文/大型項目編排
- `rw-research-passport`：持久化項目狀態
- `rw-research-lab-router`：工具和環境選擇

### L1：科研階段 Orchestrator

每次只選一個主 orchestrator，再按契約調用支持 skill。

- 問題/創新：`rw-research-question`、`rw-research-novelty`
- 文獻/證據：`rw-literature-discovery`、`research-synthesis`
- 設計/方案：`rw-research-design`、`experimental-design`
- 數據/統計：`rw-research-data`、`statistical-analysis`
- 寫作/投稿：`academic-paper`、`rw-phd-write`、`rw-journal-submission`
- 審查/修回：`rw-research-referee`、`academic-paper-reviewer`、`rw-revision-patch`

### L2：證據與質量控制

L2 不負責創建主要研究內容，只負責檢查邊界、來源、統計和可重現性。

- `rw-paper-extractor`
- `rw-evidence-map`
- `rw-claim-audit`
- `rw-statistics-audit`
- `rw-research-referee`
- `rw-research-data`
- `verification-loop`
- `zone-of-truth`
- `thinking-red-team`

### L3：專業工具執行器

只有在研究型態和輸入材料觸發時才調用。

- 統計：`statsmodels`、`pymc`、`scikit-learn`
- 數據：`polars`、`dask`、`vaex`、`xlsx`
- 組學：`scanpy`、`pydeseq2`、`anndata`、`pysam`、`biopython`
- 生物醫學：`pydicom`、`pyhealth`、`histolab`、`pathway-enrichment`
- 分子/藥物：`rdkit`、`deepchem`、`diffdock`、`molecular-dynamics`
- 圖表：`matplotlib`、`seaborn`、`scientific-visualization`、`scientific-schematics`

### L4：輸出和整合

- 文稿：`scientific-writing`、`rw-phd-tone`、`copy-editing`
- 引用：`citation-management`
- 格式：`venue-templates`、`academic-paper`
- 文件：`pdf`、`docx`、`pptx`、`latex-posters`

## 2. 唯一科研路由規則

```text
research-os-router
  ├─ 日常單步任務 → rw-research-router
  ├─ 大型完整研究 → academic-pipeline + rw-research-passport
  ├─ 深度文獻調查 → academic-deep-research
  ├─ 文獻證據 → rw-literature-discovery → rw-paper-extractor → rw-evidence-map
  ├─ 研究設計 → rw-research-question → rw-research-novelty → rw-research-design
  ├─ 統計分析 → rw-research-data → statistical-analysis → domain executor
  ├─ 論文寫作 → rw-phd-write/scientific-writing → rw-phd-tone
  ├─ 投稿審查 → rw-claim-audit → rw-statistics-audit → rw-journal-submission
  └─ 工具不確定 → rw-research-lab-router
```

禁止規則：

- 不同時啟動 `academic-pipeline`、`academic-deep-research` 和 `rw-research-router` 作為並列主流程。
- 不把 `paper-lookup`、`pubmed-database`、`literature-review` 同時當成主入口；由任務類型選一個。
- 不讓 `write` 或 `copy-editing` 改變數據、效應方向、因果強度或限制。
- 不讓統計工具在沒有 `analysis_plan` 或明確探索性標記時生成確認性結論。
- 不讓任何 skill 把候選搜索結果當成已核驗證據。

## 3. 研究型態條件路由

| 條件 | 必加分支 |
|---|---|
| 系統性綜述 / meta-analysis | `literature-review` + review protocol + PRISMA checklist |
| PubMed / 醫學文獻 | `pubmed-database` 或 `paper-lookup` |
| 隨機對照試驗 | `experimental-design` + `statistical-power` + protocol/registration gate |
| 觀察性研究 | confounding/bias review + STROBE checklist |
| 診斷研究 | diagnostic design + STARD checklist |
| 預測模型 | validation/calibration audit + TRIPOD checklist |
| 臨床試驗 | ethics/registration/data-sharing gate |
| 人體/患者資料 | privacy/consent/data access gate |
| 動物研究 | welfare/3Rs + ARRIVE checklist |
| 單細胞 RNA-seq | `anndata` + `scanpy` |
| bulk RNA-seq | `pydeseq2` + `pathway-enrichment` |
| BAM/CRAM/VCF/FASTQ | `pysam` + `biopython` |
| Bayesian | `pymc` + posterior/predictive checks |
| 大型表格 | `polars` → `dask`/`vaex` only when needed |
| 投稿 | official journal requirements + `rw-journal-submission` |

## 4. 標準 artifact 交接

所有 L1/L2 workflow 都要讀寫以下標準 artifact：

```text
ResearchPassport
ResearchQuestion
StudyTypeProfile
NoveltyBrief
SearchProtocol
SourceRegistry
PaperCard
EvidenceMap
StudyDesign
StudyProtocol
ReportingGuidelinePlan
EthicsAndRegistrationPlan
DatasetManifest
AnalysisPlan
AnalysisLock
AnalysisRun
StatisticalAudit
ReproducibilityManifest
ManuscriptOutline
ManuscriptDraft
ClaimAudit
ReviewReport
RevisionPatch
SubmissionPackage
FinalArchive
```

每個 artifact 必須包含：

```text
artifact_id
project_id
version
created_at
created_by
source_artifacts
source_registry
content_hash
status: draft | verified | blocked | superseded
claims
limitations
open_questions
quality_gates
human_approval
```

## 5. Gate 位置

- G0：研究問題可行性
- G1：研究型態和適用規範
- G2：來源身份和證據完整性
- G3：設計、樣本、測量、分析一致性
- G4：註冊、倫理、隱私和資料透明度
- G5：分析計畫鎖定
- G6：統計和結果核對
- G7：報告規範 checklist
- G8：可重現性
- G9：claim-to-source / claim-to-data audit
- G10：作者/PI 人工批准後才可投稿或公開

阻斷 gate 必須回傳：

```text
gate_id
status
failed_checks
evidence_required
suggested_next_workflow
human_decision_required
```

## 6. 實際使用模板

### 6.1 日常科研

```text
research-os-router
→ rw-research-router
→ 一個主 workflow
→ 一個必要質量 skill
→ artifact + gate
→ 更新 rw-research-passport
```

### 6.2 完整研究

```text
research-os-router
→ rw-research-passport
→ rw-research-question
→ rw-research-novelty
→ rw-literature-discovery
→ rw-paper-extractor
→ rw-evidence-map
→ rw-research-design
→ statistical-power
→ rw-research-data
→ statistical-analysis
→ rw-statistics-audit
→ rw-phd-write
→ rw-claim-audit
→ rw-research-referee
→ rw-journal-submission
→ academic-pipeline
```

### 6.3 醫學/組學研究

```text
rw-research-question
→ pubmed-database / paper-lookup
→ rw-paper-extractor
→ rw-evidence-map
→ protocol + ethics/data gate
→ scanpy / pydeseq2 / biopython / pysam
→ statistical-analysis
→ rw-statistics-audit
→ scientific-writing
→ rw-journal-submission
```

## 7. 現有 library 的處置策略

- 不刪除現有 skill。
- 不停用現有 skill，除非確認是 plugin 或安全問題。
- 把科研 18 個 RW skill 視為主骨架。
- 把 `academic-pipeline` 限定為大型項目 orchestrator。
- 把數據科學和組學 skills 視為條件式 executor。
- 把通用 writing skill 限定為語言層，不讓它改變科學語義。
- 每月重新生成 catalog，檢查新增、重複和缺失 metadata。
