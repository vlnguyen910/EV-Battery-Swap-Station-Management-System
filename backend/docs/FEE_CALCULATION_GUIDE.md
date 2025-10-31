# Fee Calculation System - Hướng Dẫn Chi Tiết

**Ngày**: 31/10/2025  
**Mục đích**: Tính 4 loại phí chính: đăng ký gói, cọc pin, vượt km, hư hỏng

---

## 📊 4 Loại Phí Chính

### 1️⃣ **Phí Đăng Ký Gói** (Subscription Fee)
- **Mô tả**: Giá gói đăng ký pin (tháng 1, tháng 3, tháng 6)
- **Ví dụ**: Gói 3 tháng = 900,000 VNĐ
- **Tính toán**: Từ `BatteryServicePackage.base_price`
- **Endpoint**: `POST /payments/calculate/subscription-fee`

### 2️⃣ **Phí Cọc Pin** (Deposit Fee)
- **Mô tả**: Tiền cọc pin khi lần đầu tiên
- **Loại**:
  - Sinh viên: 100,000 VNĐ
  - Thường: 500,000 VNĐ
- **Tính toán**: Từ Config (`Student_Initial_Deposit` hoặc `Regular_Initial_Deposit`)
- **Endpoint**: `POST /payments/calculate/subscription-fee`

### 3️⃣ **Phí Vượt Km** (Overcharge Fee) ⚡ **TIẾN CHỈ NHƯ TIỀN ĐIỆN**
- **Mô tả**: Phí khi khách hàng đi quá số km cơ bản của gói
- **Bậc phí** (Tiering):
  - **Tier 1**: 0-2000km vượt quá → 216 VNĐ/km
  - **Tier 2**: 2001-4000km vượt quá → 195 VNĐ/km
  - **Tier 3**: Trên 4000km vượt quá → 173 VNĐ/km

**Ví dụ tính toán**:
- Gói có 1000km cơ bản
- Khách đi 5500km
- Vượt quá: 5500 - 1000 = 4500km

**Chi phí**:
- Tier 1 (2000km): 2000 × 216 = 432,000 VNĐ
- Tier 2 (2000km): 2000 × 195 = 390,000 VNĐ
- Tier 3 (500km): 500 × 173 = 86,500 VNĐ
- **Tổng**: 908,500 VNĐ

- **Endpoint**: `POST /payments/calculate/overcharge-fee`

### 4️⃣ **Phí Hư Hỏng** (Damage Fee)
- **Mô tả**: Phí bồi thường khi pin/thiết bị bị hư hỏng
- **Mức độ**:
  - **Minor** (Nhẹ): 10,000 VNĐ
  - **Moderate** (Trung bình): 50,000 VNĐ
  - **Severe** (Nặng): 100,000 VNĐ
- **Tính toán**: Từ Config
- **Endpoint**: `POST /payments/calculate/damage-fee`

---

## 🔧 API Endpoints

### 1. Calculate Subscription + Deposit Fee
```bash
POST /api/v1/payments/calculate/subscription-fee
Content-Type: application/json
Authorization: Bearer <token>

{
  "packageId": 2,
  "depositType": "regular"  # hoặc "student"
}
```

**Response**:
```json
{
  "subscription_fee": 900000,
  "deposit_fee": 500000,
  "overcharge_fee": 0,
  "damage_fee": 0,
  "total_fee": 1400000,
  "breakdown": {
    "package_price": 900000,
    "deposit_amount": 500000,
    "overcharge_km": 0,
    "overcharge_cost": 0,
    "damage_cost": 0
  },
  "breakdown_text": "📦 Phí đăng ký gói: 900.000 VNĐ\n💰 Phí cọc pin: 500.000 VNĐ\n\n💳 TỔNG CỘNG: 1.400.000 VNĐ"
}
```

---

### 2. Calculate Overcharge Fee (Km Vượt Quá)
```bash
POST /api/v1/payments/calculate/overcharge-fee
Content-Type: application/json
Authorization: Bearer <token>

{
  "subscriptionId": 123,
  "actualDistanceTraveled": 5500
}
```

**Response**:
```json
{
  "subscription_fee": 0,
  "deposit_fee": 0,
  "overcharge_fee": 908500,
  "damage_fee": 0,
  "total_fee": 908500,
  "breakdown": {
    "package_price": 900000,
    "deposit_amount": 0,
    "overcharge_km": 4500,
    "overcharge_cost": 908500,
    "damage_cost": 0
  },
  "breakdown_text": "🔋 Phí vượt km: 4500km × giá tiering = 908.500 VNĐ\n\n💳 TỔNG CỘNG: 908.500 VNĐ"
}
```

---

### 3. Calculate Damage Fee
```bash
POST /api/v1/payments/calculate/damage-fee
Content-Type: application/json
Authorization: Bearer <token>

{
  "damageSeverity": "moderate"  # minor, moderate, hoặc severe
}
```

**Response**:
```json
{
  "subscription_fee": 0,
  "deposit_fee": 0,
  "overcharge_fee": 0,
  "damage_fee": 50000,
  "total_fee": 50000,
  "breakdown": {
    "package_price": 0,
    "deposit_amount": 0,
    "overcharge_km": 0,
    "overcharge_cost": 0,
    "damage_cost": 50000
  },
  "breakdown_text": "🔨 Phí hư hỏng: 50.000 VNĐ\n\n💳 TỔNG CỘNG: 50.000 VNĐ"
}
```

---

### 4. Calculate Complex Fee (Tất Cả)
```bash
POST /api/v1/payments/calculate/complex-fee
Content-Type: application/json
Authorization: Bearer <token>

{
  "packageId": 2,
  "depositType": "regular",
  "subscriptionId": 123,
  "actualDistanceTraveled": 5500,
  "damageSeverity": "moderate"
}
```

**Response**:
```json
{
  "subscription_fee": 900000,
  "deposit_fee": 500000,
  "overcharge_fee": 908500,
  "damage_fee": 50000,
  "total_fee": 2358500,
  "breakdown": {
    "package_price": 900000,
    "deposit_amount": 500000,
    "overcharge_km": 4500,
    "overcharge_cost": 908500,
    "damage_cost": 50000
  },
  "breakdown_text": "📦 Phí đăng ký gói: 900.000 VNĐ\n💰 Phí cọc pin: 500.000 VNĐ\n🔋 Phí vượt km: 4500km × giá tiering = 908.500 VNĐ\n🔨 Phí hư hỏng: 50.000 VNĐ\n\n💳 TỔNG CỘNG: 2.358.500 VNĐ"
}
```

---

## 💡 Ví Dụ Thực Tế: Khách Hàng Mới Lần Đầu Tiên

### Scenario
Khách hàng mới (thường - không sinh viên):
- Mua gói 3 tháng
- Đi 5500km (vượt quá)
- Pin bị hư hỏng (mức độ trung bình)

### Step 1: Tính phí đăng ký + cọc
```bash
curl -X POST http://localhost:3000/api/v1/payments/calculate/subscription-fee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "packageId": 2,
    "depositType": "regular"
  }'
```

**Kết quả**: 
- Phí gói: 900,000 VNĐ
- Phí cọc: 500,000 VNĐ
- Tổng: 1,400,000 VNĐ

### Step 2: Tính phí vượt km
```bash
curl -X POST http://localhost:3000/api/v1/payments/calculate/overcharge-fee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "subscriptionId": 123,
    "actualDistanceTraveled": 5500
  }'
```

**Kết quả**:
- Vượt quá: 4500km
- Phí tiering: 908,500 VNĐ

### Step 3: Tính phí hư hỏng
```bash
curl -X POST http://localhost:3000/api/v1/payments/calculate/damage-fee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "damageSeverity": "moderate"
  }'
```

**Kết quả**:
- Phí hư hỏng (moderate): 50,000 VNĐ

### Step 4: Tính tổng (Complex Fee)
```bash
curl -X POST http://localhost:3000/api/v1/payments/calculate/complex-fee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "packageId": 2,
    "depositType": "regular",
    "subscriptionId": 123,
    "actualDistanceTraveled": 5500,
    "damageSeverity": "moderate"
  }'
```

**Kết quả**:
```
📦 Phí đăng ký gói: 900.000 VNĐ
💰 Phí cọc pin: 500.000 VNĐ
🔋 Phí vượt km: 4500km × giá tiering = 908.500 VNĐ
🔨 Phí hư hỏng: 50.000 VNĐ

💳 TỔNG CỘNG: 2.358.500 VNĐ
```

---

## 🎯 Config Values (Cấu Hình)

Tất cả giá trị được lưu trong `Config` table:

| Config Name | Type | Value | Mô Tả |
|---|---|---|---|
| `Student_Initial_Deposit` | deposit | 100,000 | Cọc sinh viên |
| `Regular_Initial_Deposit` | deposit | 500,000 | Cọc thường |
| `Overcharge_Fee_Tier1` | penalty | 216 | Phí/km (0-2000km) |
| `Overcharge_Fee_Tier2` | penalty | 195 | Phí/km (2001-4000km) |
| `Overcharge_Fee_Tier3` | penalty | 173 | Phí/km (4000+km) |
| `Minor_Damage_Fee` | damage_fee | 10,000 | Hư hỏng nhẹ |
| `Battery_Damage_Penalty` | penalty | 50,000 | Hư hỏng trung bình |
| `Equipment_Loss_Penalty` | penalty | 100,000 | Hư hỏng nặng |

---

## 🔄 Integration Flow

```
Frontend User
    ↓
Calculate fee (API endpoint)
    ↓
Get breakdown (text + numbers)
    ↓
Display to user
    ↓
User confirms
    ↓
Create payment with calculated amount
    ↓
Redirect to VNPAY
```

---

## 📝 Frontend Integration Example

```typescript
// Calculate subscription + deposit fee
calculateSubscriptionFee() {
  this.paymentService.calculateSubscriptionFee({
    packageId: 2,
    depositType: 'regular'
  }).subscribe(fee => {
    console.log(fee.breakdown_text);
    // Hiển thị cho user: "Phí đăng ký: 900,000 VNĐ..."
  });
}

// Calculate complex fee
calculateAllFees() {
  this.paymentService.calculateComplexFee({
    packageId: 2,
    subscriptionId: 123,
    actualDistanceTraveled: 5500,
    damageSeverity: 'moderate'
  }).subscribe(fee => {
    console.log(fee.breakdown_text);
    // Hiển thị tổng: 2,358,500 VNĐ
    
    // Sau đó tạo payment
    this.createPayment({
      amount: fee.total_fee,
      type: 'subscription_with_deposit'
    });
  });
}
```

---

## 🚀 Key Features

✅ **Linh hoạt**: Tính từng loại phí riêng hoặc cùng lúc
✅ **Cấu hình động**: Giá trị lấy từ Config table
✅ **Tiering System**: Phí vượt km tương tự tiền điện
✅ **Clear Breakdown**: Text tiếng Việt cho user
✅ **Type Safe**: Enum-based severity levels

---

## 📚 Related Documentation

- `PAYMENT_TYPES_GUIDE.md` - Payment types
- `PAYMENT_API_BACKWARD_COMPATIBILITY.md` - API migration
- `PAYMENT_SYSTEM_UPDATE_SUMMARY.md` - Summary

---

**Status**: ✅ **COMPLETE**
