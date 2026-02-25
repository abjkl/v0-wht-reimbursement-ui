# PRD: WHT 预扣税报销审核工具

| 项目 | 详情 |
|------|------|
| 产品名称 | WHT Reimbursement Review Tool |
| 版本 | 1.0 (MVP) |
| 负责人 | Tax Operations Team |
| 目标市场 | 印度尼西亚 (PPh23 预扣税) |
| 目标用户 | 内部税务审核员 / 审批人 |

---

## 1. 背景与问题描述

Shopee 印尼卖家/商户提交 WHT（预扣税 / PPh23）报销申请。当前，税务审核员需要手动逐一核对上传文件（WHT 凭证、税务发票、Shopee 商业发票），将提取的字段与业务规则进行比对。此流程耗时长、容易出错，且缺乏标准化的校验机制。

**核心问题**：税务审核员需要一个高效工具来审核、校验和批准/拒绝 WHT 报销请求，借助 AI 自动化能力提升效率，同时保留完整的人工覆盖能力。

---

## 2. 目标

| 目标 | 衡量指标 |
|------|----------|
| 缩短单条请求平均审核时间 | 从约 15 分钟降至 5 分钟以内 |
| 提高校验准确率 | AI 自动检测字段不匹配及异常 |
| 标准化审核流程 | 所有审核员使用统一校验清单 |
| 保持可审计性 | AI 建议 vs 人工决策的完整追溯链 |

---

## 3. 用户角色

| 角色 | 权限 |
|------|------|
| 税务审核员 (Tax Reviewer) | 查看请求、审阅解析字段、接受/拒绝 AI 建议、批准/驳回请求 |
| 税务经理 (Tax Manager) | 拥有审核员全部权限 + 批量操作（未来规划） |

---

## 4. 核心功能

### 4.1 请求列表页 (`/wht-requests`)

可筛选、分 Tab 展示的 WHT 报销请求表格。

**状态 Tab**：

| Tab | 描述 |
|-----|------|
| All | 全部请求 |
| To Review | `Submitted` + `Pending Review` 状态的待审核请求 |
| Approved (Not Injected) | 已批准但尚未注入下游系统 |
| Rejected | 已驳回请求 |

**筛选维度**：

| 筛选项 | 可选值 |
|--------|--------|
| Status | Submitted, Pending Review, Approved, Rejected |
| Transaction Type | MP Platform, Food Platform Invoice, SVS Prepaid Invoice, AMS PPS, AMS PPP, FBS |
| Seller Type | Mall, Non-mall, Merchant |
| Injection Status | Done, Not Started, Failed |
| Approver | All / Empty / Me |
| Date Range | 起始日期 ~ 结束日期 |
| Search | 自由文本搜索（ID、公司名称、发票号） |
| Missing Docs | Missing WHT Slip / Missing Tax Invoice / Missing Shopee Invoice / Complete |
| Amount Range | <= 1,000,000 / 1,000,001-10,000,000 / > 10,000,000 |
| SLA | > 3 天 |

**表格列**：
- Request ID、Status、Seller Company、Transaction Type、Seller Type
- Requested Amount（格式化为 IDR）
- Submission Date、AI Suggestion（Approve / Reject / Pending Review）、AI Confidence
- Document Completeness（3 份文件指示器）
- Injection Status
- Approver Name

点击行即跳转至详情页。

---

### 4.2 请求详情页 (`/wht-requests/[id]`)

三栏布局，用于审核单条 WHT 报销请求。

#### 4.2.1 整体布局

```
+------------------------------------------+
| 顶部导航栏 (Back / Request ID / 状态标签)  |
+----------+----------+--------------------+
| 文档查看器 | 解析字段  | AI Assistant       |
| (PDF)    | 面板     | 抽屉面板 (340px)    |
|          |          |                    |
+----------+----------+--------------------+
| 底部操作栏 (固定吸底)                       |
+------------------------------------------+
```

**顶部导航栏**：紧凑的单行导航条
- 左侧：Back 返回按钮 + Request ID + 状态 Badge
- 右侧："Attachments" 按钮 + "AI Review" 开关按钮（控制右侧抽屉的显示/隐藏）

#### 4.2.2 左侧面板：文档查看器 (Document Viewer)

基于 Tab 的 PDF/图片查看器，展示 3 份源文件：

| Tab | 文件 | 来源 |
|-----|------|------|
| WHT Slip | 预扣税凭证 (Bukti Potong PPh23) | 申请人上传 |
| Tax Invoice | 税务发票 (Faktur Pajak) | 申请人上传 |
| Shopee Invoice | 商业发票 | 申请人上传 |

功能特性：
- 缩放控制（50% - 200%）
- 外部链接打开原始文件
- 缺失文件时显示 "Document Not Provided" 占位
- Tab 切换自动同步右侧解析字段面板

#### 4.2.3 中间面板：解析字段 (Parsed Fields)

展示当前选中文档 Tab 对应的 OCR/AI 提取关键字段。字段以卡片形式组织，分段用分割线隔开。

**WHT Slip 字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| WHT Slip Number (Nomor Bukti Potong) | 字符串 | WHT 凭证唯一编号 |
| Tax Period / Masa Pajak | 字符串 | MM-YYYY 格式 |
| WHT Code | 字符串 | 税目代码（如 24-104-18） |
| WHT Rate (%) | 数字 | 预期值：2% |
| Taxpayer NPWP (Shopee) | 字符串 | 被扣税主体的纳税识别号 |
| Taxpayer Name (Shopee) | 字符串 | 被扣税主体名称 |
| Collector NPWP (Seller/Merchant) | 字符串 | 扣缴义务人纳税识别号 |
| Collector Name (Seller/Merchant) | 字符串 | 扣缴义务人名称 |
| Tax Base / DPP | 金额 (IDR) | 税基 (Dasar Pengenaan Pajak) |
| WHT Amount (PPh23) | 金额 (IDR) | 预扣税金额 |
| Referenced Invoice Number | 字符串 | 关联的发票号 |

**Tax Invoice 字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| Tax Invoice Number | 字符串 | 税务发票号 (Nomor Faktur Pajak) |
| Tax Invoice Date | 日期 | 开票日期 |
| Issuer NPWP | 字符串 | 应与 WHT Slip 的 Taxpayer NPWP 一致 |
| Issuer Name | 字符串 | 应与 WHT Slip 的 Taxpayer Name 一致 |
| Buyer NPWP | 字符串 | 应与 WHT Slip 的 Collector NPWP 一致 |
| Buyer Name | 字符串 | 应与 WHT Slip 的 Collector Name 一致 |
| DPP (Tax Base) | 金额 (IDR) | 应与 WHT Slip 的 Tax Base 一致 |
| VAT Amount (PPN) | 金额 (IDR) | 增值税金额（11%） |
| Total Amount | 金额 (IDR) | DPP + VAT |

**Shopee Invoice 字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| Invoice Number (OCR) | 字符串 | OCR 提取的发票号 |
| Invoice Date | 日期 | 发票日期 |
| Issuer Name | 字符串 | Shopee 实体名称 |
| Issuer NPWP | 字符串 | Shopee 实体纳税识别号 |
| Amount Before Tax | 金额 (IDR) | 税前金额 |
| Total Amount | 金额 (IDR) | 发票总金额 |
| Currency | 字符串 | 预期值：IDR |
| Line Item Count | 数字 | 行项目数量 |
| Invoice Description | 字符串 | 发票描述 |

**字段交互行为**：

- 每个字段支持**行内编辑**（鼠标悬停显示铅笔图标，点击进入编辑模式，Enter 保存 / Escape 取消）
- 每个字段显示**数据来源标识**：
  - 金色 Sparkle 图标 = AI/OCR 解析
  - 彩色圆形头像（首字母缩写）= 人工更新，悬停显示操作人邮箱
- **问题高亮模式**：当从 AI 抽屉点击 "Check Details" 时：
  - 有问题的字段获得彩色边框（红色 = 失败，琥珀色 = 警告）+ 问题图标（悬停显示原因）
  - 无问题的字段降低透明度至 30%，突出有问题字段
  - 面板标题出现 "Clear highlights" 链接，点击清除高亮

#### 4.2.4 右侧面板：AI Assistant 抽屉

可折叠的 340px 右侧面板，展示 AI 审核结果。通过顶部导航栏的 "AI Review" 按钮切换。

**架构设计**：AI Assistant 支持**多 Agent 扩展**。当前实现了一个 Agent。

**面板结构**：

```
+----------------------------------+
| [Sparkle] AI Assistant           |
| Review tasks & conclusions  [x]  |
+----------------------------------+
| REQUIRED TASKS    0/1 confirmed  |
+----------------------------------+
| [Agent 卡片: WHT Slip Review]    |
|  |- 标题: 名称 + 结论标签 + 置信度% |
|  |- Re-run 按钮                  |
|  |- Details（校验检查详情）        |
|  |- 用户操作 (Accept/Not/Check)   |
+----------------------------------+
| [未来更多 Agent 卡片...]          |
+----------------------------------+
| Final Decision                   |
| [Reject] [Accept]               |
+----------------------------------+
```

**Agent 卡片详情** (WHT Slip Review)：

| 区域 | 说明 |
|------|------|
| 标题行 | Agent 名称 + 结论 Badge（含状态圆点 + 结论文本 + 置信度百分比） |
| 状态圈 | 空心（待处理）、绿色勾（已接受）、红色叉（未接受） |
| Re-run 按钮 | 重新运行 AI 校验（模拟 2 秒延迟），重置接受状态 |
| Details | 可展开的校验检查项，按类别分组显示，带 pass/warn/fail 状态图标 |
| 操作按钮 | 见下表 |

**结论类型与操作**：

| 结论 | 标签颜色 | 操作按钮 |
|------|----------|----------|
| Approve | 绿色 | Accept / Not Accept |
| Reject | 红色 | Accept / Not Accept |
| Pending Review | 琥珀色 | Check Details（触发字段问题高亮） |

---

### 4.3 校验引擎 (AI Agent: WHT Slip Review)

核心校验逻辑，交叉比对各文档的提取数据。分为 5 个检查类别，共 14 条规则：

#### Section A：文件完整性

| 检查项 | 规则 | 状态 |
|--------|------|------|
| WHT Slip 已上传 | WHT 凭证 URL 存在 | Pass / Fail |
| Tax Invoice 已上传 | 税务发票 URL 存在 | Pass / Fail |
| Shopee Invoice 已上传 | 商业发票 URL 存在 | Pass / Fail |

#### Section B：身份信息验证

| 检查项 | 规则 | 状态 |
|--------|------|------|
| 实体身份匹配 (Shopee) | WHT Slip Taxpayer NPWP/Name = Tax Invoice Issuer NPWP/Name | Pass / Warn / Fail |
| 扣缴方身份匹配 (Seller/Merchant) | WHT Slip Collector NPWP/Name = Tax Invoice Buyer NPWP/Name | Pass / Warn / Fail |

#### Section C：发票匹配

| 检查项 | 规则 | 状态 |
|--------|------|------|
| 发票号引用匹配 (B9) | WHT Slip 引用的发票号匹配 Tax Invoice 号或 Shopee Invoice 号 | Pass / Warn / Fail |
| 单票对应 | MVP：一个请求对应一张发票 | 始终 Pass |

#### Section D：税额计算

| 检查项 | 规则 | 状态 |
|--------|------|------|
| WHT Code 允许 (B3) | 必须为以下之一：`24-104-18`、`24-104-34`、`24-104-02` | Pass / Warn / Fail |
| WHT Rate = 2% (B6) | 税率必须为 2% | Pass / Warn / Fail |
| 税基匹配 (B5) | WHT Slip Tax Base = Tax Invoice DPP | Pass / Warn / Fail |
| WHT 金额正确 (B7) | WHT Amount = Tax Base x 2%（容差 +/- IDR 10） | Pass / Warn / Fail |
| 报销金额匹配 WHT | 申请报销金额约等于 WHT Slip 金额（容差 +/- IDR 10） | Pass / Warn |

#### Section E：合规与资格

| 检查项 | 规则 | 状态 |
|--------|------|------|
| 非免税期 (SKB) | 卖家不得持有有效免税证明 | Pass / Warn / Fail |
| 非重复提交 | 请求不得为重复提交 | Pass / Warn / Fail |
| 报销资格 | 卖家类型和交易类型符合报销条件 | Pass / Warn / Fail |

**状态说明**：
- **Pass**（绿色）：校验通过
- **Warn**（琥珀色）：数据缺失或存在轻微偏差
- **Fail**（红色）：校验失败，需关注处理

---

### 4.4 审批流程

#### 底部操作栏

固定吸底的操作栏，根据上下文展示不同按钮：

| 场景 | 可用操作 |
|------|----------|
| AI 建议为 Approve/Reject | "Accept AI Suggestion (Approve/Reject) XX%" + "Or decide manually" 链接 |
| AI 建议为 Pending Review | "Approve" + "Reject to Requestor" 按钮 |
| 展开手动决策 | "Approve" + "Reject to Requestor" 按钮 |
| 下一条请求 | 导航至队列中下一条请求 |

#### 批准弹窗

确认弹窗包含：
- 备注输入框（可选）
- 确认 / 取消 按钮
- 确认后：状态更新为 `Approved`，写入审计日志

#### 驳回弹窗

确认弹窗包含：
- 多选驳回理由：
  - 文件缺失或不完整
  - 发票号不匹配
  - 金额无效
  - 公司信息不完整
  - 税务发票问题
  - WHT 凭证问题
  - 重复请求
  - 其他
- 备注输入框（可选）
- 确认 / 取消 按钮
- 确认后：状态更新为 `Rejected`，写入审计日志（含驳回理由）

---

## 5. 数据模型

### 5.1 WHTRequest 主体

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 唯一请求 ID（如 WHT-2026-001） |
| status | Enum | 是 | Submitted / Pending Review / Approved / Rejected |
| transactionType | Enum | 是 | MP Platform / Food Platform Invoice / SVS Prepaid Invoice / AMS PPS / AMS PPP / FBS |
| sellerType | Enum | 是 | Mall / Non-mall / Merchant |
| aiSuggestion | Enum | 是 | Approve / Reject / Pending Review |
| aiConfidence | Float | 是 | 0.0 - 1.0 |
| timestamp | ISO DateTime | 是 | 请求创建时间 |
| requestorEmail | String | 是 | 提交人邮箱 |
| sellerCompanyName | String | 是 | 来自 Google Form "Nama Perusahaan" |
| invoiceNumber | String | 是 | 主要发票引用号 |
| invoiceUrl | URL | 否 | Shopee 商业发票文件 URL |
| taxInvoiceUrl | URL | 否 | 税务发票文件 URL |
| whtSlipUrl | URL | 否 | WHT 凭证文件 URL |
| requestedReimbursementAmount | Number (IDR) | 是 | 申请报销金额 |
| submissionDate | Date | 是 | 提交日期 |
| approvalStatusYN | Y/N | 否 | 审批结果 |
| approverName | String | 否 | 审批人邮箱 |
| approvalDate | Date | 否 | 审批日期 |
| notes | String | 否 | 审核备注 |
| injectionStatus | Enum | 是 | Done / Not Started / Failed |
| injectionDate | Date | 否 | 注入日期 |
| docsComplete | Object | 是 | `{ invoice: bool, taxInvoice: bool, whtSlip: bool }` |
| extracted | Object | 否 | OCR/AI 提取数据（见 4.2.3 字段定义） |
| eligibility | Object | 否 | `{ isEligible: bool, reason?: string }` |
| duplicate | Object | 否 | `{ isDuplicate: bool }` |
| exemptionPeriod | Object | 否 | `{ isInExemption: bool }` |

### 5.2 字段元数据 (Field Metadata)

每个提取字段可携带以下元数据：

| 字段 | 类型 | 说明 |
|------|------|------|
| source | Enum | `ai`（OCR/AI 解析）或 `user`（人工修改） |
| updatedBy | String | 最后修改人邮箱 |
| updatedAt | ISO DateTime | 最后修改时间 |

### 5.3 MP 平台特有字段

| 字段 | 类型 | 说明 |
|------|------|------|
| usernameShopee | String | Shopee 用户名 |
| shopId | String | 店铺 ID |
| userId | String | 用户 ID |

### 5.4 Food 平台特有字段

| 字段 | 类型 | 说明 |
|------|------|------|
| merchantName | String | 商户显示名称 |
| merchantId | String | 商户 ID |
| storeId | String | 门店 ID |
| settleTo | String | 结算目标（MID/SID） |
| midSid | String | MID 或 SID 标识符 |

---

## 6. 技术架构

### 6.1 前端技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI 组件 | shadcn/ui + Tailwind CSS v4 |
| 状态管理 | Zustand |
| 语言 | TypeScript |

### 6.2 组件结构

```
app/
  wht-requests/
    page.tsx                    # 列表页
    [id]/
      page.tsx                  # 详情页（主编排器）

components/
  filters-bar.tsx               # 筛选控件
  requests-table.tsx            # 数据表格
  document-viewer.tsx           # PDF/图片查看器（带 Tab）
  document-context-panel.tsx    # 解析字段展示面板（3 种文档类型）
  editable-field.tsx            # 行内可编辑字段（带数据来源标识）
  ai-review-drawer.tsx          # AI Assistant 右侧抽屉面板

lib/
  types.ts                      # TypeScript 类型定义
  store.ts                      # Zustand 状态仓库
  mock-data.ts                  # 模拟数据（20 条记录）
  filter-utils.ts               # 筛选与格式化工具函数
```

### 6.3 关键交互流程

| 交互 | 流程描述 |
|------|----------|
| Tab 切换（文档查看器） | 查看器 Tab 变更 -> 同步解析字段面板展示对应文档字段 |
| Check Details（AI 抽屉） | 点击 "Check Details" -> 将失败/警告校验项映射至字段名 -> 高亮问题字段 + 淡化正常字段 |
| 清除高亮 | 点击面板标题的 "Clear highlights" -> 移除所有字段高亮覆盖 |
| Accept AI 建议 | 点击 Agent 卡片的 "Accept" -> 标记该 Agent 为已接受 -> 可进入 Final Decision |
| Re-run Agent | 点击 Agent 卡片的 "Re-run" -> 重新执行校验（模拟 2 秒延迟）-> 重置接受状态 |
| 批准/驳回 | 底部操作栏或 AI 抽屉 Final Decision -> 打开确认弹窗 -> 更新状态 + 写入审计日志 |
| 行内编辑字段 | 鼠标悬停显示铅笔图标 -> 点击进入编辑模式 -> Enter 保存 / Escape 取消 |

---

## 7. 未来规划（MVP 范围外）

| 项目 | 说明 |
|------|------|
| 多 AI Agent | 架构已支持扩展，可添加 Invoice Review、Tax Review 等 Agent 卡片 |
| 批量操作 | 从列表页批量批准/驳回 |
| 真实 OCR 对接 | 接入实际 OCR/AI 提取服务（当前使用模拟数据） |
| 后端 API | 将 Zustand 本地状态替换为 REST/GraphQL API |
| 角色权限 | Reviewer / Manager / Admin 不同权限等级 |
| 注入工作流 | 自动注入至下游财务系统 |
| 通知系统 | 邮件/Slack 待审核提醒 |
| 分析看板 | 审核吞吐量、准确率、SLA 达标率 |
| 审计日志导出 | 下载审计记录为 CSV/PDF |
| 多国支持 | 从印尼 WHT 扩展至其他国家税务场景 |

---

## 8. 附录

### 8.1 AI 建议生成逻辑

AI 建议由校验检查结果的组合决定：
- **Approve**：所有检查通过，或仅存在轻微警告
- **Reject**：一项或多项关键检查失败
- **Pending Review**：文件缺失或数据无法自动核实

### 8.2 允许的 WHT Code（印尼 PPh23）

| 代码 | 说明 |
|------|------|
| 24-104-18 | PPh 23: 租金及其他收入 (Sewa dan penghasilan lain) |
| 24-104-34 | PPh 23: 技术、管理、咨询服务 (Jasa teknik, manajemen, konsultan) |
| 24-104-02 | PPh 23: 其他服务 (Jasa lainnya) |

### 8.3 金额格式化规范

所有金额以印尼盾 (IDR) 格式展示：
- 示例：`Rp 5.000.000`（使用印尼语言环境 `id-ID`）
- 金额匹配容差：+/- IDR 10

### 8.4 字段来源标识说明

| 标识 | 含义 |
|------|------|
| 金色 Sparkle 图标 | AI/OCR 自动提取的字段值 |
| 彩色圆形头像（首字母缩写） | 人工修改的字段值（悬停显示操作人邮箱） |
| 红色圆形 XCircle 图标 | 该字段校验失败 |
| 琥珀色 AlertCircle 图标 | 该字段存在校验警告 |
