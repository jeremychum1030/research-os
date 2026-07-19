# SciFlow Pilot：科研規範與缺口補全

版本：0.2
更新：2026-07-18
用途：把科研 workflow 從「方法與工具清單」補成可按研究類型執行、可核驗、可投稿的研究助手。

## 一、研究型態路由層

SciFlow 不應一開始把所有 skill 都列給使用者，而應先判斷研究型態，再選擇主 workflow 和必需規範。

| 研究型態 | 主要流程 | 主要報告/方案規範 |
|---|---|---|
| 隨機對照試驗 | 研究問題 → SPIRIT → protocol → power → trial conduct → results → CONSORT | SPIRIT 2025、CONSORT 2025；按需要使用 harms、CONSORT-ROUTINE、CONSORT-AI 等 extension |
| 觀察性研究 | 問題 → cohort/case-control/cross-sectional design → data readiness → analysis → report | STROBE；按領域使用 STROBE extensions |
| 診斷準確度研究 | index test/reference standard → sampling → threshold → analysis → report | STARD；AI 診斷研究需檢查適用 extension |
| 預測模型研究 | target population → model development/validation → calibration/discrimination → report | TRIPOD；AI/ML 預測模型需檢查適用 extension |
| 系統性文獻綜述/Meta-analysis | protocol → search → screening → extraction → risk of bias → synthesis → report | PRISMA 2020、PRISMA-P；按類型使用 PRISMA extensions |
| 個案報告 | case identification → consent/privacy → chronology → intervention/outcome → report | CARE |
| 動物實驗 | protocol → 3Rs/animal welfare → randomisation/blinding → analysis → report | ARRIVE |
| 經濟學評估 | perspective → comparator → costing → model → uncertainty → report | CHEERS 2022 |
| 質性研究 | question → sampling → reflexivity → data collection → coding → synthesis | SRQR / COREQ，按研究方法選擇 |
| 混合方法 | quantitative + qualitative protocol → integration plan → analysis → report | 需要在 protocol 中預先寫清 integration strategy，並分別核對適用規範 |
| 計算/AI/組學研究 | data provenance → preprocessing lock → model/analysis plan → validation → reproducibility | 依研究問題選 STARD/TRIPOD/CONSORT 等；另加 dataset、code、model-card 和 external validation gate |

規範是 reporting guidance，不等於倫理批准、GCP 認證或統計審批。SciFlow 必須在介面上明確區分三者。

## 二、需要新增的科研 artifact

### 1. Study Type Profile

在 W10 研究問題後建立：

- 研究型態
- 研究目的：描述、關聯、因果、預測、診斷、證據綜合或經濟評估
- 研究單位和目標族群
- 是否涉及人體、動物、可識別資料或臨床試驗
- 觸發的 reporting guidelines
- 仍需人工決定的問題

### 2. Reporting Guideline Plan

在 W30/W31 建立，在 W50/W60 使用：

- 適用規範及版本
- 適用理由
- checklist 條目
- 對應 protocol/manuscript section
- evidence/artifact reference
- `not_applicable` 的理由
- 人工確認狀態

### 3. Registration & Transparency Plan

臨床試驗或需註冊的研究，在 protocol gate 前要求：

- registry 名稱和 record ID
- prospective/retrospective 狀態
- 註冊時間相對於 participant enrolment
- protocol amendment log
- data-sharing plan
- code/materials availability
- restricted access 的理由

ICMJE 官方 clinical trial registration guidance 明確指出，2019-01-01 之後開始招募的臨床試驗需要在註冊中包含 data-sharing plan。SciFlow 應把這個變成條件式 gate，而不是對所有研究一概要求。

### 4. Ethics & Participant Protection Record

只要涉及人體、患者、可識別資料或生物樣本，要求記錄：

- ethics/IRB 狀態
- informed consent 狀態
- privacy/de-identification strategy
- data access restriction
- adverse event/safety handling（適用時）
- responsible human reviewer

系統只能記錄和提醒，不得顯示「已獲倫理批准」等未由正式文件支持的結論。

### 5. Analysis Lock

在 W42 前固定：

- primary endpoint/outcome
- estimand 或主要比較
- analysis population
- missing-data strategy
- multiplicity strategy
- model specification
- sensitivity/subgroup analyses
- deviations from plan

W43 之後的 exploratory analysis 要單獨標記，不能回寫成預先指定分析。

### 6. Reproducibility Manifest

W45 需包括：

- raw data identity and access restrictions
- derived dataset version
- code repository/version
- environment/dependency lock
- random seeds
- execution order
- table shell / figure source
- known non-reproducible elements
- responsible person

## 三、完整的科研助手流程

```text
1. Research Intake
2. Research Question
3. Study Type Profile
4. Novelty and Landscape
5. Protocol/Search Design
6. Reporting Guideline Plan
7. Registration/Ethics/Data Transparency Plan
8. Evidence Discovery or Data Readiness
9. Paper/Data Extraction
10. Evidence Map or Analysis Dataset
11. Power and Analysis Plan
12. Analysis Lock
13. Domain Analysis
14. Statistical Audit
15. Reproducibility Package
16. Manuscript Architecture
17. Guideline Checklist Completion
18. Claim/Source/Number Audit
19. Human Pre-submission Review
20. Journal Requirements and Submission
21. Peer Review and Revision
22. Final Archive
```

### 動態分支

```text
if study_type == randomized_trial:
    SPIRIT → registration/ethics → CONSORT
if study_type == observational:
    STROBE
if study_type == diagnostic:
    STARD
if study_type == prediction_model:
    TRIPOD
if study_type == systematic_review:
    PRISMA-P → PRISMA
if study_type == case_report:
    CARE + privacy/consent gate
if study_type == animal:
    ARRIVE + welfare/3Rs gate
if study_type == economic_evaluation:
    CHEERS
if study_type == clinical_trial:
    registry + data-sharing + protocol amendment gate
```

## 四、網頁版真正需要的頁面

### A. New Research

第一個畫面只問：

1. 你想研究什麼？
2. 這是什麼類型的研究？
3. 你現在有什麼材料？
4. 你的目標是研究計劃、分析、論文還是投稿？
5. 是否涉及人體、動物、患者資料或臨床試驗？

系統再生成 Study Type Profile 和個人化路徑。

### B. Research Journey

每一屏只處理一個任務，顯示：

- 這一步要回答什麼
- 為什麼重要
- 需要使用者輸入什麼
- SciFlow 可以調用哪些 skills
- 產出的 artifact
- 目前質量 gate
- 下一步會解鎖什麼

### C. Evidence Workspace

不是單純文獻列表，而是：

- source identity
- full-text status
- extraction card
- claim/source link
- study design
- risk of bias
- uncertainty
- evidence conflict

### D. Study Design Workspace

以問答方式完成：

- PICO/PECO/SPIDER
- design selection
- population/exposure/intervention/comparator
- primary/secondary outcomes
- sample size/power
- bias/confounding
- ethics/registration
- guideline checklist

### E. Data & Analysis Workspace

使用者看得到：

- data readiness
- variable dictionary
- missingness
- analysis lock
- exploratory vs confirmatory 標籤
- run record
- statistical audit
- reproducibility manifest

### F. Manuscript Workspace

不是只有文字編輯器，而是：

- section outline
- claim inventory
- source links
- figure/table source
- guideline checklist
- disclosure/AI-use record
- reviewer comments
- response matrix

## 五、質量 gate 補全

| Gate | 阻斷條件 |
|---|---|
| G0 問題可行性 | 研究問題過寬、不可操作或沒有可觀察 outcome |
| G1 研究型態 | 沒有完成研究型態和適用規範判斷 |
| G2 證據身份 | 來源身份、版本或全文狀態不清楚 |
| G3 設計一致性 | 問題、設計、樣本、測量和分析不一致 |
| G4 透明度 | 註冊、protocol amendment 或 data-sharing 狀態缺失（適用時） |
| G5 倫理與隱私 | 人體/動物/患者資料的責任人和正式文件狀態不明 |
| G6 統計完整性 | n、analysis unit、model、effect size、CI 或結果對不上 |
| G7 報告規範 | 適用 checklist 有未處理項目且沒有 `not_applicable` 理由 |
| G8 可重現性 | code、環境、資料版本、表圖來源或限制未記錄 |
| G9 主張完整性 | claim 沒有來源、數據支持或超出研究設計可支持的範圍 |
| G10 人工發表批准 | 沒有 PI/作者/責任研究者確認就進行提交或公開 |

## 六、資料和 AI 的邊界

- PubMed、Crossref、OpenAlex 等搜尋結果只是候選來源，不能直接當成已核驗證據。
- AI 生成的研究問題、統計建議和段落都是 draft，直到有來源、數據或人工確認。
- 所有數字必須連到原始資料或已核驗 artifact。
- 所有臨床、倫理、註冊和投稿要求必須以當前官方來源核驗。
- 期刊要求要按投稿當日的官方頁面重新確認，不能只用舊模板。
- 對人體研究，SciFlow 是研究管理和核驗輔助，不是 IRB、醫療或法規批准系統。

## 七、官方來源

- EQUATOR Network reporting guideline library：<https://www.equator-network.org/reporting-guidelines/>
- CONSORT / SPIRIT official：<https://www.consort-spirit.org/>
- CONSORT 2025：<https://www.equator-network.org/reporting-guidelines/consort/>
- SPIRIT 2025：<https://www.equator-network.org/reporting-guidelines/spirit-2013-statement-defining-standard-protocol-items-for-clinical-trials/>
- STROBE：<https://www.equator-network.org/reporting-guidelines/strobe/>
- PRISMA：<https://www.equator-network.org/reporting-guidelines/prisma/>
- TRIPOD：<https://www.equator-network.org/reporting-guidelines/tripod-statement/>
- CARE：<https://www.equator-network.org/reporting-guidelines/care/>
- WHO clinical trials and ICTRP：<https://www.who.int/health-topics/clinical-trials>
- WHO Guidance for best practices for clinical trials：<https://www.who.int/publications/i/item/9789240097711>
- ICMJE clinical trial registration：<https://www.icmje.org/recommendations/browse/publishing-and-editorial-issues/clinical-trial-registration.html>
- Cochrane Handbook：<https://www.cochrane.org/handbook>
- NIH data management and sharing：<https://sharing.nih.gov/>

## 八、結論

現有 skill 清單已足以提供科研執行能力。真正應補的是：

1. 研究型態路由
2. 規範版本和 checklist
3. 註冊/倫理/資料透明度
4. Analysis Lock
5. 可重現性 manifest
6. 研究型態對應的 artifact 和阻斷 gate
7. 研究者在每一步的具體輸入和決策界面

因此 SciFlow Pilot 應該是「個人化科研旅程引擎」，而不是 workflow 看板或 skill 列表。
