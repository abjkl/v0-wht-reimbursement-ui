# WHT Reimbursement Review System - PRD

> 版本: 1.0 | 最后更新: 2026-03-02

---

## 1. 产品概述

WHT (Withholding Tax) Reimbursement Review System 是一个面向内部税务审核人员的 Web 应用，用于审核印尼 PPh23 预扣税报销请求。系统提供列表管理、文档查看、AI 辅助审核、字段级编辑和批量操作等功能。

### 1.1 核心用户角色

| 角色 | 说明 |
|------|------|
| Tax Reviewer / Tax Manager | 登录系统审核报销请求，查看文档，做出 Approve / Reject 决策 |

### 1.2 页面结构

```
/                               → 重定向到 /wht-requests
/wht-requests                   → 列表页（Request List）
/wht-requests/[id]              → 详情页（Request Detail）
/wht-requests/[id]/attachments  → 附件页（Attachments）
```

---

## 2. 数据模型

### 2.1 核心类型 `WHTRequest`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 请求唯一标识，格式: `WHT-2026-XXX` |
| `status` | `Status` | 请求状态，枚举值见下方 |
| `transactionType` | `TransactionType` | 交易类型 |
| `sellerType` | `SellerType` | 卖家类型 |
| `aiSuggestion` | `AISuggestion` | AI 审核建议 |
| `aiConfidence` | `number` | AI 置信度（0-1） |
| `timestamp` | `string` | 创建时间 ISO 格式 |
| `requestorEmail` | `string` | 提交人邮箱 |
| `sellerCompanyName` | `string` | 卖家公司名（来自 Google Form） |
| `syncedCompanyName` | `string?` | 同步的公司名（来自下游系统） |
| `invoiceNumber` | `string` | 发票编号 |
| `invoiceUrl` | `string?` | Shopee 商业发票 URL |
| `taxInvoiceUrl` | `string?` | 税务发票 URL |
| `whtSlipUrl` | `string?` | WHT 凭证 URL |
| `requestedReimbursementAmount` | `number` | 请求报销金额（IDR） |
| `submissionDate` | `string` | 提交日期 `YYYY-MM-DD` |
| `approvalStatusYN` | `"Y" \| "N"?` | 审批结果 |
| `approverName` | `string?` | 审批人 |
| `approvalDate` | `string?` | 审批日期 |
| `notes` | `string?` | 备注 |
| `injectionStatus` | `InjectionStatus` | 注入状态 |
| `injectionDate` | `string?` | 注入日期 |
| `usernameShopee` | `string?` | Shopee 用户名（MP 类型） |
| `shopId` | `string?` | 店铺 ID（MP 类型） |
| `userId` | `string?` | 用户 ID（MP 类型） |
| `merchantName` | `string?` | 商户名（Food 类型） |
| `merchantId` | `string?` | 商户 ID（Food 类型） |
| `storeId` | `string?` | 门店 ID（Food 类型） |
| `settleTo` | `string?` | 结算方式（Food 类型） |
| `midSid` | `string?` | MID/SID（Food 类型） |
| `docsComplete` | `object` | 文档完整性 `{ invoice, taxInvoice, whtSlip }` 各为 `boolean` |
| `extracted` | `object?` | AI 提取的文档结构化数据，包含三个子文档 |
| `eligibility` | `object?` | 资格校验 `{ isEligible, reason? }` |
| `duplicate` | `object?` | 重复检测 `{ isDuplicate }` |
| `exemptionPeriod` | `object?` | 豁免期检测 `{ isInExemption }` |
| `auditLog` | `AuditLogEntry[]` | 审计日志 |

### 2.2 枚举值

| 枚举 | 值 |
|------|------|
| `Status` | `Submitted`, `Pending Review`, `Approved`, `Rejected` |
| `TransactionType` | `MP Platform`, `Food Platform Invoice`, `SVS Prepaid Invoice`, `AMS PPS`, `AMS PPP`, `FBS` |
| `SellerType` | `Mall`, `Non-mall`, `Merchant` |
| `InjectionStatus` | `Done`, `Not Started`, `Failed` |
| `AISuggestion` | `Approve`, `Reject`, `Pending Review` |

### 2.3 提取的文档数据

#### ExtractedWHTSlip（WHT 凭证提取字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| `whtSlipNumber` | `string?` | WHT 凭证编号 |
| `taxPeriod` | `string?` | 税期 |
| `whtSlipStatus` | `string?` | 凭证状态 |
| `taxpayerNpwp` | `string?` | 纳税人 NPWP |
| `taxpayerName` | `string?` | 纳税人名称 |
| `whtCode` | `string?` | WHT 代码 |
| `dpp` | `number?` | 计税基础 (DPP) |
| `whtRate` | `number?` | WHT 税率 |
| `whtAmount` | `number?` | WHT 金额 |
| `sellerMerchantNpwp` | `string?` | 卖家/商户 NPWP |
| `sellerMerchantName` | `string?` | 卖家/商户名称 |
| `referencedInvoiceNumber` | `string?` | 关联发票号 |
| `_metadata` | `Record<string, FieldMetadata>?` | 各字段元数据 |

#### ExtractedTaxInvoice（税务发票提取字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| `taxInvoiceNumber` | `string?` | 税务发票号 |
| `issuerName` | `string?` | 开票方名称 |
| `issuerNpwp` | `string?` | 开票方 NPWP |
| `sellerMerchantNpwp` | `string?` | 卖家/商户 NPWP |
| `sellerMerchantName` | `string?` | 卖家/商户名称 |
| `totalAmountInclTax` | `number?` | 含税总金额 |
| `dpp` | `number?` | 计税基础 (DPP) |
| `vatAmount` | `number?` | 增值税金额 |
| `_metadata` | `Record<string, FieldMetadata>?` | 各字段元数据 |

#### ExtractedShopeeInvoice（Shopee 商业发票提取字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| `issuerName` | `string?` | 开票方名称 |
| `issuerNpwp` | `string?` | 开票方 NPWP |
| `sellerMerchantName` | `string?` | 卖家/商户名称 |
| `sellerMerchantUsername` | `string?` | 卖家/商户用户名 |
| `commercialInvoiceNumber` | `string?` | 商业发票号 |
| `totalAmountInclTax` | `number?` | 含税总金额 |
| `_metadata` | `Record<string, FieldMetadata>?` | 各字段元数据 |

### 2.4 FieldMetadata（字段元数据）

每个提取字段都附带元数据，用于标识数据来源和可信度：

| 字段 | 类型 | 说明 |
|------|------|------|
| `source` | `'ai' \| 'user'` | 数据来源：AI 自动提取 或 人工修改 |
| `updatedBy` | `string?` | 修改人邮箱（仅 `source='user'` 时有值） |
| `updatedAt` | `string?` | 修改时间 |
| `confidence` | `number?` | AI 置信度 0-100（仅 `source='ai'` 时有值） |

---

## 3. 列表页 `/wht-requests`

### 3.1 页面结构

```
┌─────────────────────────────────────────────────────┐
│  Header: "WHT Reimbursement Requests"               │
├─────────────────────────────────────────────────────┤
│  Filter 区域                                         │
├─────────────────────────────────────────────────────┤
│  Status Tabs（状态标签页）                             │
├─────────────────────────────────────────────────────┤
│  Table Info: "Total: X WHT Request/s"               │
├─────────────────────────────────────────────────────┤
│  数据表格（含全选 / 单选）                             │
├─────────────────────────────────────────────────────┤
│  [固定底部] 批量操作栏（选中时出现）                    │
└─────────────────────────────────────────────────────┘
```

### 3.2 Filter 区域

筛选器包含两行：

**第一行（3 列）：**

| 筛选器 | 字段 | 说明 |
|--------|------|------|
| Search | `searchField` + `search` | 左侧下拉选择搜索范围（All Fields / Request ID / Email / Username / Company Name / Invoice Number / NPWP），右侧输入关键词 |
| Status | `status` | 下拉选择：All Status / Submitted / Pending Review / Approved / Rejected |
| AI Suggestion | `aiSuggestion` | 下拉选择：All / Approve / Reject / Pending Review |

**第二行（2 列）：**

| 筛选器 | 字段 | 说明 |
|--------|------|------|
| Submission Date Range | `dateRange.start` / `dateRange.end` | 两个日期输入框，起止日期 |
| Amount Range | `amountRange.min` / `amountRange.max` | 两个数字输入框，最小/最大金额 |

**操作按钮：** `Reset`（重置所有筛选）、`Apply Filters`（应用筛选）

### 3.3 Status Tabs（状态标签页）

| Tab Key | 显示名 | 数据筛选逻辑 |
|---------|--------|-------------|
| `all` | All | 全部 requests，应用 Filter 区域的所有筛选条件 |
| `in-preparation` | In Preparation | `status === 'Submitted'` 的 requests，忽略 Filter 中的 status 筛选 |
| `pending-review` | Pending Review | `status === 'Pending Review'` 的 requests，忽略 Filter 中的 status 筛选 |
| `approved` | Approved | `status === 'Approved'` 的 requests，忽略 Filter 中的 status 筛选 |
| `rejected` | Rejected | `status === 'Rejected'` 的 requests，忽略 Filter 中的 status 筛选 |

每个 Tab 显示对应的计数，例如 `All 20`、`In Preparation 5`。选中 Tab 时底部显示蓝色下划线。

### 3.4 数据表格

#### 表头列定义

| 列 | 字段 | 宽度 | 对齐 | 说明 |
|----|------|------|------|------|
| Checkbox | - | 50px | 居左 | 全选框，支持 全选 / 部分选中（indeterminate）/ 取消全选 |
| Request ID | `id` | 140px | 居左 | 可点击跳转详情页，蓝色链接样式，等宽字体 |
| Submission Date | `submissionDate` | 120px | 居左 | 格式化为印尼日期格式（如 `20 Feb 2026`） |
| Email | `requestorEmail` | 200px | 居左 | |
| Username | `usernameShopee` / `merchantName` | 150px | 居左 | MP 类型显示 usernameShopee，Food 类型显示 merchantName，无值显示 `—` |
| Company Name | `sellerCompanyName` / `syncedCompanyName` | 180px | 居左 | 优先显示 sellerCompanyName，无值显示 `—` |
| WHT.23 Reimbursement Amount | `requestedReimbursementAmount` | 180px | 居右 | IDR 格式化金额 |
| AI Suggestion | `aiSuggestion` | 120px | 居左 | 带颜色圆点：绿色=Approve，红色=Reject，琥珀色=Pending Review |
| Status | `status` | 100px | 居左 | Badge 样式：绿色=Approved，红色=Rejected，琥珀色=Pending Review，灰色=Submitted |
| Action | - | 100px | 居左 | "Review" 链接，点击跳转详情页 |

#### 行选择逻辑

- **Header Checkbox**: 点击切换全选/取消全选当前页所有行
- **Row Checkbox**: 点击切换单行选中/取消
- 部分行选中时，Header Checkbox 显示 indeterminate 状态

### 3.5 批量操作栏

**触发条件：** 当 `selectedIds.size > 0` 时显示。

**位置：** 固定定位在页面底部（`fixed inset-x-0 bottom-0`），带顶部边框和阴影。

| 区域 | 内容 | 说明 |
|------|------|------|
| 左侧 | `Selected X request(s)` | 显示选中数量，数量以粗体突出 |
| 右侧 | `Batch Reject` 按钮 | 红色 outline 样式，带 XCircle 图标，点击后批量将选中 requests 的 `status` 更新为 `Rejected` |
| 右侧 | `Batch Approve` 按钮 | 绿色实心样式，带 CheckCircle2 图标，点击后批量将选中 requests 的 `status` 更新为 `Approved` |

**操作后行为：** 批量操作执行后自动清空选择集（`selectedIds` 重置为空 Set）。

---

## 4. 详情页 `/wht-requests/[id]`

### 4.1 页面整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: < Back > WHT Reimbursement > Request Detail       │
├────────────────────────────────────────────┬────────────────────┤
│  Title Card（标题信息栏）                    │                    │
│  [id] [status badge] [Attachments btn]     │   AI Review Panel  │
│  [Sparkles toggle]                         │   (右侧可折叠面板)   │
│  Submission Date | Email | Username |      │                    │
│  Company Name | Amount                     │                    │
├──────────────────┬─────────────────────────┤                    │
│  Document Viewer │  Parsed Fields &        │                    │
│  (左侧文档预览)   │  Details Panel          │                    │
│                  │  (中间结构化字段展示)      │                    │
│                  │                         │                    │
├──────────────────┴─────────────────────────┴────────────────────┤
│  [固定底部] 操作栏: [Next Request >]    [Reject] [Approve]      │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Breadcrumb（面包屑导航）

格式：`< Back > WHT Reimbursement > WHT Reimbursement Request Detail`

- `< Back` 和 `WHT Reimbursement` 可点击，返回列表页
- 最后一级为当前页标题，灰色不可点击

### 4.3 Title Card（标题信息栏）

| 元素 | 字段 | 说明 |
|------|------|------|
| 标题 | 固定文案 | "WHT Reimbursement Request" |
| Request ID | `id` | 灰色小字 |
| Status Badge | `status` | Badge 组件 |
| Attachments 按钮 | - | outline 按钮，点击跳转附件页 `/wht-requests/[id]/attachments` |
| AI Review 切换按钮 | - | Sparkles 图标按钮，切换右侧 AI Review Panel 的显示/隐藏。激活时按钮高亮（primary 背景色） |

**Inline Info（第二行摘要信息）：**

| 标签 | 字段 | 格式 |
|------|------|------|
| Submission Date | `submissionDate` | 原始日期 |
| Email | `requestorEmail` | 邮箱 |
| Username | `usernameShopee` / `merchantName` | 无值显示 `—` |
| Company Name | `sellerCompanyName` / `syncedCompanyName` | 无值显示 `—` |
| WHT.23 Reimbursement Amount | `requestedReimbursementAmount` | IDR 货币格式 |

### 4.4 Document Viewer（文档预览模块 - 左侧面板）

**位置：** 主内容区的左半部分。

#### 文档 Tab

| Tab ID | 显示名 | 对应 URL 字段 | 可用条件 |
|--------|--------|-------------|---------|
| `wht-slip` | WHT Slip | `whtSlipUrl` | `docsComplete.whtSlip === true` |
| `tax-invoice` | Tax Invoice | `taxInvoiceUrl` | `docsComplete.taxInvoice === true` |
| `invoice` | Shopee Invoice | `invoiceUrl` | `docsComplete.invoice === true` |

#### 功能

- **缩放控制：** ZoomOut / ZoomIn 按钮，范围 50%-200%，步进 10%，显示当前缩放百分比
- **外部链接：** 在新窗口打开文档原始 URL
- **文档渲染：** PDF 使用 iframe，图片使用 img 标签
- **缺失文档：** 显示 FileX 图标 + "Document Not Provided" 提示
- **Tab 联动：** 切换文档 Tab 时通过 `onTabChange` 回调通知中间面板同步滚动到对应的结构化字段区域

### 4.5 Document Context Panel（结构化字段面板 - 中间面板）

**位置：** 主内容区的右半部分。

此面板展示三份文档的 AI 提取结构化数据，按三个 Card 排列：

#### Card 1: WHT Slip

| 字段 | 对应数据 | 类型 |
|------|---------|------|
| WHT Slip Number | `extracted.whtSlip.whtSlipNumber` | 文本 |
| Tax Period | `extracted.whtSlip.taxPeriod` | 文本 |
| Status | `extracted.whtSlip.whtSlipStatus` | 文本 |
| Taxpayer NPWP | `extracted.whtSlip.taxpayerNpwp` | 文本 |
| Taxpayer Name | `extracted.whtSlip.taxpayerName` | 文本 |
| WHT Code | `extracted.whtSlip.whtCode` | 文本 |
| --- 分隔线 --- | | |
| DPP | `extracted.whtSlip.dpp` | 金额 |
| WHT Rate (%) | `extracted.whtSlip.whtRate` | 数字 |
| WHT Amount | `extracted.whtSlip.whtAmount` | 金额 |
| Seller/Merchant NPWP | `extracted.whtSlip.sellerMerchantNpwp` | 文本 |
| Seller/Merchant Name | `extracted.whtSlip.sellerMerchantName` | 文本 |
| Referenced Invoice Number | `extracted.whtSlip.referencedInvoiceNumber` | 文本 |

#### Card 2: Tax Invoice

| 字段 | 对应数据 | 类型 |
|------|---------|------|
| Tax Invoice Number | `extracted.taxInvoice.taxInvoiceNumber` | 文本 |
| Issuer Name | `extracted.taxInvoice.issuerName` | 文本 |
| Issuer NPWP | `extracted.taxInvoice.issuerNpwp` | 文本 |
| Seller/Merchant NPWP | `extracted.taxInvoice.sellerMerchantNpwp` | 文本 |
| Seller/Merchant Name | `extracted.taxInvoice.sellerMerchantName` | 文本 |
| --- 分隔线 --- | | |
| Total Amount Incl. Tax | `extracted.taxInvoice.totalAmountInclTax` | 金额 |
| DPP | `extracted.taxInvoice.dpp` | 金额 |
| VAT Amount | `extracted.taxInvoice.vatAmount` | 金额 |

#### Card 3: Shopee Invoice

| 字段 | 对应数据 | 类型 |
|------|---------|------|
| Issuer Name | `extracted.shopeeInvoice.issuerName` | 文本 |
| Issuer NPWP | `extracted.shopeeInvoice.issuerNpwp` | 文本 |
| Seller/Merchant Name | `extracted.shopeeInvoice.sellerMerchantName` | 文本 |
| Seller/Merchant Username | `extracted.shopeeInvoice.sellerMerchantUsername` | 文本 |
| Commercial Invoice Number | `extracted.shopeeInvoice.commercialInvoiceNumber` | 文本 |
| Total Amount Incl. Tax | `extracted.shopeeInvoice.totalAmountInclTax` | 金额 |

#### EditableField 组件特性

每个字段使用 `EditableField` 组件渲染，具备以下特性：

1. **来源指示器（Source Indicator）：**
   - `source = 'ai'`：显示 Sparkles 图标（琥珀色），Tooltip 显示 "AI parsed"
   - `source = 'user'`：显示用户头像圆圈（取邮箱首字母缩写），Tooltip 显示修改人邮箱和 "Manually updated"

2. **置信度指示器（Confidence Indicator）：**
   - `confidence >= 60`：绿色小圆圈 + 勾号，Tooltip 显示具体百分比
   - `confidence < 60`：琥珀色感叹号 + 百分比文本，表示低置信度

3. **可编辑功能：**
   - hover 时显示 Pencil 编辑图标
   - 点击进入编辑模式，显示 Input + 确认/取消按钮
   - 支持 Enter 保存、Escape 取消

4. **问题高亮（Issue Highlight）：** （与 AI Review Panel 联动，详见第 5 节）
   - `issue.status = 'fail'`：红色边框 + 红色浅底背景
   - `issue.status = 'warn'`：琥珀色边框 + 琥珀色浅底背景
   - 无问题但有其他字段有问题时：`dimmed = true`，降低不相关字段透明度至 30%
   - 显示问题时顶部出现 "Clear highlights" 按钮，点击清除所有高亮

### 4.6 底部操作栏

**显示条件：** `request.status !== 'Approved' && request.status !== 'Rejected'`（仅未终态的请求显示）

**位置：** `fixed bottom-0 left-0 right-0`

| 区域 | 元素 | 说明 |
|------|------|------|
| 左侧 | `Next Request >` 按钮 | outline 样式，带 ChevronRight 图标。点击跳转到列表中下一个 request 的详情页。如无下一条，显示灰色文本 "No more requests" |
| 右侧 | `Reject` 按钮 | 红色 outline 样式（`border-red-200 text-red-600`），带 XCircle 图标。点击弹出 Reject Dialog |
| 右侧 | `Approve` 按钮 | 绿色实心样式（`bg-emerald-600 text-white`），带 CheckCircle 图标。点击弹出 Approve Dialog |

### 4.7 Approve Dialog

| 元素 | 说明 |
|------|------|
| 标题 | "Approve Request" |
| 描述 | "Are you sure you want to approve this WHT reimbursement request?" |
| Request ID | 显示当前请求 ID |
| Amount | 显示格式化金额 |
| Notes | 可选的审批备注文本域（3 行） |
| Cancel 按钮 | 关闭对话框 |
| Confirm Approval 按钮 | 确认审批 |

**Confirm Approval 执行逻辑：**
1. 更新 request: `status → 'Approved'`, `approvalStatusYN → 'Y'`, `approverName → 当前用户邮箱`, `approvalDate → 当天日期`
2. 添加 audit log 记录
3. 显示 toast 成功提示
4. 关闭对话框

### 4.8 Reject Dialog

| 元素 | 说明 |
|------|------|
| 标题 | "Reject Request" |
| 描述 | "Please select reason(s) for rejection. This action cannot be undone." |
| 拒绝原因（多选 Checkbox） | 见下方列表 |
| Notes | 可选的额外备注文本域（3 行） |
| Cancel 按钮 | 关闭对话框 |
| Confirm Rejection 按钮 | destructive 样式，至少选择一个原因后才可点击 |

**拒绝原因选项：**
1. Missing or incomplete documentation
2. Invoice number mismatch
3. Invalid amount
4. Company information incomplete
5. Tax invoice issues
6. WHT slip issues
7. Duplicate request
8. Other

**Confirm Rejection 执行逻辑：**
1. 拼接拒绝备注: `"Rejected: 原因1, 原因2 - 额外备注"`
2. 更新 request: `status → 'Rejected'`, `approvalStatusYN → 'N'`, `approverName → 当前用户邮箱`, `approvalDate → 当天日期`, `notes → 拼接后的备注`
3. 添加 audit log 记录
4. 显示 toast 错误提示
5. 关闭对话框，清空选中的拒绝原因

---

## 5. AI Review Panel（AI 审核面板）

### 5.1 概述

AI Review Panel 是详情页右侧的可折叠面板（宽度 340px），提供 AI 自动审核结果展示，并支持审核人确认或否决 AI 的建议。

**开关控制：** Title Card 中的 Sparkles 图标按钮，默认展开（`showAIDrawer = true`）。

### 5.2 面板结构

```
┌──────────────────────────┐
│  Header: "AI Review" [X] │
├──────────────────────────┤
│  Required Tasks  0/1     │
├──────────────────────────┤
│  ┌────────────────────┐  │
│  │  Agent Card:       │  │
│  │  WHT Slip Review   │  │
│  │  [展开/折叠]        │  │
│  │  - Re-run 按钮     │  │
│  │  - Details 区域     │  │
│  │  - 用户操作区域     │  │
│  └────────────────────┘  │
│                          │
│  （未来可扩展更多 Agent）  │
├──────────────────────────┤
│  Final Decision          │
│  [Reject]  [Accept]      │
└──────────────────────────┘
```

### 5.3 Agent Card 组件

每个 Agent Card 代表一个 AI 审核任务（当前仅有 "WHT Slip Review"，未来可扩展）。

#### Header 区域

| 元素 | 说明 |
|------|------|
| Status 图标 | 未确认：灰色空心圆；已 Accept：绿色 CheckCircle；已 Not Accept：红色 XCircle |
| Agent 名称 | 如 "WHT Slip Review" |
| Conclusion Badge | 根据 `aiSuggestion` 显示不同颜色标签：绿色 "Approve"，红色 "Reject"，琥珀色 "Pending"，附带置信度百分比 |
| 展开/折叠箭头 | ChevronDown / ChevronRight |

#### Details 区域（展开后）

- **Re-run 按钮：** 重新运行 AI 审核（模拟 2 秒加载，显示旋转图标）
- **统计摘要：** `passed / warn / failed` 三色数字，分别表示通过/警告/失败的检查项数量

**验证检查分为 4 个 Section，每个 Section 可独立展开/折叠：**

##### Section A: Document Completeness（文档完整性）

| 检查项 | 校验逻辑 |
|--------|---------|
| WHT Slip Uploaded | `whtSlipUrl` 是否存在 |
| Tax Invoice Uploaded | `taxInvoiceUrl` 是否存在 |
| Shopee Invoice Uploaded | `invoiceUrl` 是否存在 |

##### Section B: Identity Validation（身份校验）

| 检查项 | 校验逻辑 |
|--------|---------|
| Entity Identity Match (Shopee) | 比较 `whtSlip.taxpayerNpwp` vs `taxInvoice.issuerNpwp`，以及 `whtSlip.taxpayerName` vs `taxInvoice.issuerName`（不区分大小写）。任一不匹配则 fail |
| Collector Identity Match (Seller/Merchant) | 比较 `whtSlip.sellerMerchantNpwp` vs `taxInvoice.sellerMerchantNpwp`，以及 `whtSlip.sellerMerchantName` vs `taxInvoice.sellerMerchantName`。任一不匹配则 fail |

##### Section C: Invoice Matching（发票匹配）

| 检查项 | 校验逻辑 |
|--------|---------|
| Invoice Reference Match (B9) | `whtSlip.referencedInvoiceNumber` 是否等于 `taxInvoice.taxInvoiceNumber`、`request.invoiceNumber` 或 `shopeeInvoice.commercialInvoiceNumber` 之一 |
| Single Invoice per Slip | 固定 pass（MVP 阶段每个请求对应一张发票） |

##### Section D: Tax Calculation（税额计算）

| 检查项 | 校验逻辑 |
|--------|---------|
| WHT Code Allowed (B3) | `whtSlip.whtCode` 是否在允许列表 `['24-104-18', '24-104-34', '24-104-02']` 内 |
| WHT Rate = 2% (B6) | `whtSlip.whtRate` 是否等于 `2` |
| Tax Base Match (B5) | `whtSlip.dpp` 是否等于 `taxInvoice.dpp` |
| WHT Amount Correct (B7) | `whtSlip.whtAmount` 与 `0.02 * whtSlip.dpp` 的差值是否在 ±10 以内 |
| Requested Amount Matches WHT | `requestedReimbursementAmount` 与 `whtSlip.whtAmount` 的差值是否在 ±10 以内 |

每个检查项状态:
- `pass`（绿色 CheckCircle）：校验通过
- `warn`（琥珀色 AlertCircle）：数据缺失无法校验，或差异在可接受范围
- `fail`（红色 XCircle）：校验失败，附带失败原因文本

Section 标题根据内部检查项状态显示颜色边框：有 fail 则红色边框，有 warn 则琥珀色边框，全 pass 则绿色边框。

#### 用户操作区域（Agent Card 底部）

**根据 AI 建议的不同状态，显示不同的操作按钮：**

**情况 1: aiSuggestion = 'Approve' 或 'Reject' 时：**

显示两个按钮：
| 按钮 | 说明 |
|------|------|
| Not Accept | 灰色 outline 按钮。用户不同意 AI 建议 |
| Accept | 黑色实心按钮。用户同意 AI 建议 |

**情况 2: aiSuggestion = 'Pending Review' 时：**

显示一个按钮：
| 按钮 | 说明 |
|------|------|
| Check Details | 琥珀色 outline 按钮，带 AlertCircle 图标 |

> **重点交互: "Check Details" 与左侧内容的联动关系（见 5.4 节）**

**操作后状态：**
- Accept 后：显示绿色 "Accepted" 标签
- Not Accept 后：显示红色 "Not Accepted" 标签
- 操作后按钮被替换为状态标签，不可重复操作

### 5.4 AI Panel 与左侧内容的互动关系（核心交互）

这是本系统最关键的交互设计之一。AI Review Panel 中的操作会直接影响中间 Document Context Panel 中字段的显示状态。

#### 5.4.1 Check Details 联动（aiSuggestion = 'Pending Review' 时）

**触发方式：** 在 Agent Card 底部点击 "Check Details" 按钮。

**联动行为：**

1. **生成 fieldIssues 映射：** 系统遍历所有验证检查项（validationChecks），找出状态不是 `pass` 的检查项，通过 `checkToFieldMap` 映射表将检查项名称转换为对应的字段名列表：

```
checkToFieldMap = {
  'Entity Identity Match (Shopee)': ['taxpayerNpwp', 'taxpayerName', 'issuerNpwp', 'issuerName'],
  'Collector Identity Match (Seller/Merchant)': ['sellerMerchantNpwp', 'sellerMerchantName'],
  'Invoice Reference Match (B9)': ['referencedInvoiceNumber', 'taxInvoiceNumber', 'commercialInvoiceNumber'],
  'WHT Code Allowed (B3)': ['whtCode'],
  'WHT Rate = 2% (B6)': ['whtRate'],
  'Tax Base Match (B5)': ['dpp'],
  'WHT Amount Correct (B7)': ['whtAmount'],
  'Requested Amount Matches WHT': ['whtAmount'],
}
```

2. **字段高亮：** 中间面板的 EditableField 组件根据 `fieldIssues` 显示不同的视觉状态：
   - **有问题的字段（fail）：** 红色边框 + 浅红色背景 + 红色 XCircle 图标，Tooltip 显示失败原因
   - **有问题的字段（warn）：** 琥珀色边框 + 浅琥珀色背景 + 琥珀色 AlertCircle 图标，Tooltip 显示警告原因
   - **无问题但当前有高亮的字段：** 透明度降至 30%（`dimmed = true`），使有问题的字段更突出

3. **文档 Tab 自动切换：** 触发 Check Details 时自动切换到 `wht-slip` Tab（`setActiveDocTab('wht-slip')`）

4. **清除高亮：** 当有字段高亮时，面板顶部显示 "Clear highlights" 文本按钮，点击后清除所有高亮恢复正常显示

#### 5.4.2 文档 Tab 与字段面板的联动

**触发方式：** 在 Document Viewer 中切换文档 Tab。

**联动行为：** 中间的 Document Context Panel 自动滚动到对应的 Card：
- 切换到 `wht-slip` Tab → 滚动到 WHT Slip Card
- 切换到 `tax-invoice` Tab → 滚动到 Tax Invoice Card
- 切换到 `invoice` Tab → 滚动到 Shopee Invoice Card

使用 `scrollIntoView({ behavior: 'smooth', block: 'start' })` 平滑滚动。

#### 5.4.3 联动流程示意

```
用户场景: AI 建议为 Pending Review，审核人需要定位问题字段

1. 审核人打开详情页
2. 右侧 AI Panel 显示 Agent Card，conclusion 为 "Pending"
3. 审核人展开 Details，查看哪些检查项是 warn/fail
4. 点击 "Check Details" 按钮
5. 系统自动:
   a. 左侧文档 Tab 切换到 WHT Slip
   b. 中间面板问题字段高亮（红色/琥珀色边框）
   c. 无问题字段透明度降低
6. 审核人聚焦到有问题的字段
7. 审核人可直接点击字段旁的编辑图标修正数据
8. 修正后点击 "Clear highlights" 恢复正常视图
9. 审核人在底部操作栏做出最终 Approve 或 Reject 决策
```

### 5.5 Final Decision Footer

AI Panel 底部固定的最终决策区域：

| 元素 | 说明 |
|------|------|
| Sparkles 图标 + "Final Decision" | 区域标题 |
| Reject 按钮 | 红色 outline 样式，触发 AI Panel 的 `onReject` 回调 |
| Accept 按钮 | 绿色实心样式，直接调用 `handleApprove` 确认审批 |

---

## 6. 状态机

### 6.1 Request Status 流转

```
                    ┌──────────┐
                    │ Submitted│ (初始状态，对应 Tab: In Preparation)
                    └────┬─────┘
                         │
                    ┌────▼──────────┐
                    │ Pending Review │ (需要人工审核)
                    └────┬──────────┘
                         │
                   ┌─────┴─────┐
                   ▼           ▼
              ┌─────────┐ ┌──────────┐
              │ Approved│ │ Rejected │
              └─────────┘ └──────────┘
```

> **注意：** 当前 MVP 版本中，Submitted 和 Pending Review 都可以直接被 Approve 或 Reject。批量操作也可以直接将 Submitted 状态的请求变更为 Approved/Rejected。

### 6.2 aiSuggestion 状态影响

| aiSuggestion 值 | AI Panel 中的行为 |
|-----------------|------------------|
| `Approve` | Agent Card 显示绿色 "Approve" Badge，底部显示 Accept / Not Accept 按钮 |
| `Reject` | Agent Card 显示红色 "Reject" Badge，底部显示 Accept / Not Accept 按钮 |
| `Pending Review` | Agent Card 显示琥珀色 "Pending" Badge，底部显示 "Check Details" 按钮（触发字段高亮联动） |

---

## 7. 全局状态管理

使用 Zustand 进行客户端状态管理，Store 结构：

| 状态/方法 | 类型 | 说明 |
|-----------|------|------|
| `requests` | `WHTRequest[]` | 所有请求数据（初始值来自 mockRequests） |
| `filters` | `FilterState` | 当前筛选条件 |
| `setFilters(partial)` | `function` | 更新部分筛选条件 |
| `resetFilters()` | `function` | 重置为默认筛选条件 |
| `updateRequest(id, updates)` | `function` | 更新指定请求的部分字段 |
| `addAuditLog(id, entry)` | `function` | 为指定请求添加审计日志 |

---

## 8. 附录：技术实现参考

### 8.1 组件清单

| 组件 | 路径 | 说明 |
|------|------|------|
| `WHTRequestsPage` | `app/wht-requests/page.tsx` | 列表页 |
| `RequestDetailPage` | `app/wht-requests/[id]/page.tsx` | 详情页 |
| `FiltersBar` | `components/filters-bar.tsx` | 筛选器组件 |
| `RequestsTable` | `components/requests-table.tsx` | 数据表格组件 |
| `DocumentViewer` | `components/document-viewer.tsx` | 文档预览组件 |
| `DocumentContextPanel` | `components/document-context-panel.tsx` | 结构化字段面板 |
| `EditableField` | `components/editable-field.tsx` | 可编辑字段组件 |
| `AIReviewDrawer` | `components/ai-review-drawer.tsx` | AI 审核面板 |

### 8.2 工具函数

| 函数 | 路径 | 说明 |
|------|------|------|
| `filterRequests(requests, filters)` | `lib/filter-utils.ts` | 根据 FilterState 筛选请求列表 |
| `formatCurrency(amount)` | `lib/filter-utils.ts` | IDR 货币格式化 |
| `formatDate(date)` | `lib/filter-utils.ts` | 印尼日期格式化 |
| `getDocCompletionCount(req)` | `lib/filter-utils.ts` | 文档完成计数，如 "2/3" |

### 8.3 依赖

- Next.js (App Router)
- Zustand（状态管理）
- shadcn/ui（UI 组件库）
- Lucide React（图标）
- Sonner（Toast 通知）
- Tailwind CSS v4

---
