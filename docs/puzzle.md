Puzzle Design
===

> **Note**
> The document should be translated to English

這份文件對大地遊戲（Puzzle）的運作機制進行說明，方便在開發上的理解。

## Use Case

> **Note**
> 尚未完成

### Puzzle Status

取得某位參加者的進度資訊。

```typescript
// GET /event/puzzle?token=[PUBLIC_TOKEN]

type PuzzleStatusInfo = {
    user_id: string // 參加者顯示名稱
    puzzles: string[] // 已收集的文字
    deliverers: string[] // 發放的贊助商
    valid: number // 收集完成的 Unix Timestamp
    coupon: number // 兌換完成的 Unix Timestamp，如果為 0 表示取消資格
}
```

## Domain Model

### PuzzleStatus

參加者的進度狀態，作為一個 Aggregate 模型將紀錄彙整後得出目前的狀態。

```typescript
type ActivityArgument = string | number

interface PuzzleActivity {
  type: string
  createdAt: Date
  args: ActivityArgument[]
}
```

```typescript
class PuzzleStatus {
  // ...
  public apply(activity: PuzzleActivity) {
    const handler = handlers[activity.type]
    // ...
    handler.apply(this, activity.args)
  }
}
```

### PuzzleStats

活動的整體進度資訊

> TBD

## Domain Event

### Puzzle Initialized

初始化參加者

```jsonc
{
  "type": "PuzzleInitialized",
  "args": ["Aotokitsuruya"]
}
```

### Puzzle Revoked

取消資格

```jsonc
{
  "type": "PuzzleRevoked",
  "args": []
}
```

### Puzzle Collected

取得拼圖

```jsonc
{
  "type": "PuzzleCollected",
  "args": ["=>", "COSCUP"] // 拼圖，發放者
}
```

### Puzzle Completed

完成拼圖

```jsonc
{
  "type": "PuzzleCompleted",
  "args": []
}
```

### Coupon Redeemed

獎品兌換

```jsonc
{
  "type": "CouponRedeemed",
  "args": []
}
```

## Database

### Puzzle Activities

用於記錄參加者活動的資訊

 | Name    | Type         | Description           |
 |---------|--------------|-----------------------|
 | id      | bigint       |                       |
 | token   | varchar(255) | The public token      |
 | version | bigint       | The activity version  |
 | type    | varchar(255) | Type of activity      |
 | args    | text         | JSON array as payload |

 > **Note**
 > `CREATE UNIQUE INDEX activity_versions ON puzzle_activities(token, version);`

 ### Puzzle Events

活動的整體進度資訊

 > TBD
