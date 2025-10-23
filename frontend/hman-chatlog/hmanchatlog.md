## Auth Service

![alt text](image.png)

AuthContext (Global State Layer)
↓
useAuth (Hook Interface Layer)  
 ↓
useAuthHandlers (Business Logic Layer)
↓  
AuthContainer (Container Layer)
↓
Login/Register (Presentation Layer)

📋 Vai trò từng lớp:

1. AuthContext (Global State Management)
   Chức năng: Quản lý global auth state cho toàn app
   Trách nhiệm:
   Lưu trữ user, token, loading, error
   Cung cấp base auth functions (login, logout, register)
   Persist state với localStorage
   Decode JWT token
   Scope: Toàn app (wrap từ main.jsx)
2. useAuthHandlers (Business Logic & Side Effects)
   Chức năng: Xử lý business logic specific cho login/register
   Trách nhiệm:
   Gọi AuthContext functions
   Xử lý role-based navigation
   Handle async states với useAsyncHandler
   Side effects như setTimeout, console.log
   Scope: Component level
3. AuthContainer (UI Container)
   Chức năng: Orchestrate UI cho auth flow
   Trách nhiệm:
   Chọn render Login hay Register dựa trên mode
   Bridge giữa useAuthHandlers và presentation components
   Pass props xuống UI components
   Scope: Auth pages

## 🔄 Mối quan hệ và Data Flow:

```
User submit form → Login/Register (presentation) → onSubmit(formData) →
AuthContainer → useAuthHandlers → useAsyncHandler → AuthContext →
authService → API → Response → navigate based on role
```

## 💡 Tại sao cần cả hai:

### AuthContext không thể thay thế AuthContainer vì:

1. **Separation of Concerns**:

```jsx
// AuthContext: Pure state management
const login = async (credentials) => {
  // Just handle API call and state
  const response = await loginService(credentials);
  setUser(userData);
  return userData;
};

// useAuthHandlers: Business logic + side effects
const loginHandler = async (credentials) => {
  const user = await login(credentials); // Gọi AuthContext
  // Business logic: role-based navigation
  if (user.role === "admin") navigate("/admin");
};
```

2. **Reusability**: AuthContext có thể dùng ở nhiều nơi khác, không chỉ login/register
3. **Testing**: Có thể test AuthContext và useAuthHandlers riêng biệt

### AuthContainer không thể thay thế AuthContext vì:

1. **Global State**: AuthContext cần share state cho toàn app
2. **Persistence**: AuthContext handle localStorage
3. **Token Management**: AuthContext decode JWT và manage tokens

## 🎯 Kết luận:

**KHÔNG BỎ CÁI NÀO!** Mỗi lớp có vai trò riêng:

- **AuthContext**: Global state store (như Redux store)
- **useAuthHandlers**: Business logic hooks
- **AuthContainer**: UI orchestration
- **Login/Register**: Pure presentation

useAuthHandlers = Service Layer (business logic)
AuthContainer = Controller (điều phối UI)
Login/Register = View (hiển thị form)

```

**Kiến trúc này chuẩn React patterns và scalable cho dự án lớn!** 🚀

## 📁 Cấu trúc file hoàn chỉnh:

```

src/
├── contexts/
│ └── AuthContext.jsx # Global state management
├── hooks/
│ ├── useAuth.js # Hook interface layer
│ ├── useAsyncHandler.js # Generic async state handler
│ └── useAuthHandlers.js # Auth-specific business logic
├── components/
│ ├── containers/
│ │ └── AuthContainer.jsx # UI container orchestration
│ └── auth/
│ ├── Login.jsx # Pure presentation component
│ └── Register.jsx # Pure presentation component
└── services/
├── api.js # HTTP client
└── authService.js # Auth API calls

```

##### SWAGGER and POSTMAN

1. Chạy swagger trên localhost: localhost:8080/api/docs

2. Muốn thực hiện các tác vụ đó thì phải có accessToken, lấy accessToken lúc đăng nhập trong LocalStorage

3. Tương đương bên Postman cũng authorize bằng cái token đó là dc

#### Cách các class tương tác với nhau trong luồng authentication và gọi API.

1. AuthContext.jsx — Global auth state (Provider)
   Vai trò: lưu user, token, loading, error; cung cấp hàm login/logout/register cho toàn app.
   Hoạt động:
   Gọi authService.login/register (thông qua loginService/registerService).
   Khi login thành công: decode accessToken (base64) → dựng userData → setUser, setToken → lưu localStorage.
   Khi logout: gọi logoutService() (best-effort), xóa state + localStorage.
   useEffect chạy 1 lần để restore user từ localStorage khi reload.
   Giá trị cung cấp (value của Provider): { user, token, loading, error, isAuthenticated, login, logout, register }.

2. authService.js — API layer cho auth
   Vai trò: wrapper gọi các endpoint auth qua axios instance (services/api.js).
   Các hàm: login(credentials) → POST API_ENDPOINTS.AUTH.LOGIN; register(userInfo); logout() (client cleanup); getProfile(); getAllUser().
   Trả lỗi lên caller (throw) để context hoặc container xử lý UI.

3. api.js — Axios instance chung
   Vai trò: tạo axios với baseURL từ constants.API_BASE_URL, set Content-Type.
   Interceptor request đọc token từ localStorage và gắn header Authorization tự động.
   Nhờ vậy toàn bộ service dùng api sẽ gửi token nếu có.

4. useApi.js — Hook wrapper API nhỏ
   Vai trò: lấy token từ useAuth() và thực hiện call API động (callApi(method, url, data, config)).
   Lựa chọn: bạn đang sử dụng api instance đã configure interceptor → useApi là tiện ích (không bắt buộc nhưng hữu ích).

5. useAuth.js — Hook tiêu chuẩn để read AuthContext
   Trả về useContext(AuthContext). Dùng trong components / hooks để truy cập login/logout/user.

6. index.js — Base URL + endpoint definitions
   Vai trò: tập trung endpoint và route.
   Lưu ý: hiện file có các endpoint dynamic viết sai (ví dụ /users/${(id) => id}) — nên export factory functions thay vì template string dùng arrow. Ví dụ sửa:

7. useAsyncHandler.js — Generic async state hook
   Vai trò: tái sử dụng quản lý loading/error/success cho bất kỳ async task nào.
   API: trả về { run, loading, error, success, setError, setSuccess }.
   Dùng làm building block cho handlers auth-specific.

8. useAuthHandlers.js — Auth-specific business hooks
   Vai trò: dùng useAsyncHandler + useAuth + useNavigate để implement các hành vi login/register:
   Gọi context.login/register.
   Xử lý side-effects: role-based navigate, redirect sau register, toast/log, onError callback.
   Trả ra submit function (run) cùng loading/error/success để container dùng.

9. AuthContainer.jsx — Container component
   Vai trò: orchestration UI: chọn render Login hay Register dựa trên prop mode; lấy submit/loading/error từ useAuthHandlers và truyền xuống presentation components.
   Không chứa business logic nặng — chỉ bind hook → presentation.

10. Login.jsx / Register.jsx — Presentation components
    Vai trò: giữ local form state, validation nhẹ, render form UI.
    Khi submit: gọi props.onSubmit(formData) (không gọi login trực tiếp).
    Show loading/error/success dựa trên props

### Luồng dữ liệu (tóm tắt)

User submit → Presentation gọi onSubmit(formData) → AuthContainer → useAuthHandlers.run(formData) → useAsyncHandler chạy → gọi AuthContext.login/register → AuthContext gọi authService → api.js gửi request → backend trả về → AuthContext cập nhật token/user → useAuthHandlers xử side-effect (navigate) → container/presentation cập nhật UI via loading/error/success.

### Lưu ý thực tế:

![alt text](image-1.png)

## Update: Rút gọn handler tạo staff (AdminPage.jsx)

- Mục tiêu: làm cho `handleFormSubmit` ngắn, rõ ràng và ưu tiên sử dụng `AuthContainer` (parent `onSubmit`) khi có.
- Những thay đổi chính:
   - Bỏ các nhánh if/else lồng nhau và nhiều log console không cần thiết.
   - Gọi `onSubmit(data)` nếu component nhận prop `onSubmit` từ `AuthContainer`; nếu không có thì fallback gọi `createStaffAccount(data)` (trường hợp dùng như trang độc lập).
   - Hiển thị thông báo thành công với `username` nếu server trả về, còn không thì hiển thị thông báo chung "Yêu cầu tạo tài khoản đã được gửi".

## Tóm tắt thành phần & luồng (ngắn gọn)

- AuthContext: quản lý auth toàn cục (user, token, loading, error). Cung cấp các hàm core (login, logout, register, createStaffAccount) và lưu token/user vào localStorage khi cần.
- authService: module HTTP (axios) gọi API, trả kết quả hoặc throw lỗi (bao gồm validation lỗi từ backend).
- useAuthHandlers / useAuthHandler: hook business logic; gọi AuthContext, bọc bằng useAsyncHandler để quản lý loading/error và side-effects (ví dụ điều hướng theo role).
- AuthContainer: container UI — nhận handler + trạng thái từ hook rồi truyền xuống presentation (Register / CreateStaffForm).
- Presentation (Register, CreateStaffForm): render form + validate client-side; khi submit gọi props.onSubmit(data). Nếu không có container thì có fallback nhẹ gọi handler trực tiếp.

Luồng submit (rút gọn):
Presentation → props.onSubmit → AuthContainer → useAuthHandlers.run → AuthContext → authService → backend → response → AuthContext lưu token/user → useAuthHandlers xử side-effect → UI cập nhật.

Lỗi & response: validation error thường là 400 với `message: ["..."]` (axios sẽ throw); success thường trả user + accessToken; auth error: 401/403.

Quy tắc ngắn gọn: presentation chỉ render + gọi props.onSubmit; container bind hook và pass loading/error; AuthContext quản lý token/persist; authService lo mọi HTTP.

Lợi ích: phân tách trách nhiệm rõ ràng, dễ test và dễ maintain (thay đổi ở layer dưới ít ảnh hưởng UI).
```

---

## Manual Swap Flow Implementation (October 22, 2025)

### 🎯 Tổng quan

Implement luồng đổi pin thủ công từ Driver → Staff → Swap Transaction, bao gồm:

- Driver tạo swap request với subscription_id
- Staff xem danh sách requests và xử lý
- Tạo swap transaction và cập nhật battery/vehicle status

### 📐 Architecture & Components

#### 1. **SwapRequestContext** - Global State Management

**File**: `frontend/src/contexts/SwapRequestContext.jsx`

**Chức năng**:

- Quản lý danh sách swap requests toàn cục
- Persist data vào localStorage
- Cung cấp functions: createSwapRequest, updateRequestStatus, addNotification

**State Structure**:

```javascript
{
  swapRequests: [
    {
      id: timestamp,
      user_id: 5,
      user_name: "peppa",
      vehicle_id: 1,
      vin: "ABC123",
      subscription_id: 2,
      subscription_name: "Premium Plan",
      status: "pending",
      createdAt: ISOString
    }
  ],
  notifications: []
}
```

**localStorage Keys**:

- `swapRequests` - Danh sách requests
- `swapNotifications` - Thông báo cho staff

#### 2. **DriverDashboard** - Driver UI

**File**: `frontend/src/components/dashboard/DriverDashboard.jsx`

**Tính năng chính**:

- Nút "Manual Swap" trong WelcomeHeader
- Fetch activeSubscription từ backend
- Tạo swap request với subscription_id

**Hardcoded Data** (do backend constraints):

```javascript
const userVehicle = {
  vehicle_id: 1,
  vin: "ABC123XYZ",
  battery_id: 1, // Battery đang dùng
};
```

**Flow**:

```
User click "Manual Swap"
→ Check activeSubscription (GET /api/v1/subscriptions/user/5)
→ Fallback subscription_id=2 nếu 403 error
→ createSwapRequest({ user_id, vehicle_id, subscription_id })
→ Navigate to staff login
```

**Lý do hardcode**:

- Backend endpoint `GET /vehicles?userId=5` trả 403 Forbidden
- Cần permission check hoặc endpoint mới từ backend
- Tạm thời hardcode vehicle_id=1, battery_id=1 cho user peppa

#### 3. **StaffSwapRequests** - Staff View Requests

**File**: `frontend/src/components/swap/StaffSwapRequests.jsx`

**Chức năng**:

- Hiển thị danh sách pending swap requests
- Filter requests theo status
- Button "Process Swap" để chuyển sang ManualSwapTransaction

**Navigation**:

```javascript
navigate(`/staff/manual-swap?${params.toString()}`);
// Params: userId, userName, vehicleId, vin, subscriptionId, subscriptionName, requestId
```

#### 4. **ManualSwapTransaction** - Form tạo transaction

**File**: `frontend/src/components/swap/ManualSwapTransaction.jsx`

**Cấu trúc Form**:

```javascript
{
  user_id: từ URL params,
  vehicle_id: từ URL params,
  station_id: 1 (hardcoded - staff ok's station),
  battery_returned_id: auto-fill từ vehicle.battery_id,
  battery_taken_id: dropdown (full batteries tại station),
  subscription_id: từ URL params,
  status: "completed"
}
```

**Auto-fill Logic**:

```javascript
useEffect(() => {
  // Fetch vehicle data
  const vehicle = await vehicleService.getVehicleById(vehicleId);

  // Auto-fill battery_returned
  setFormData(prev => ({
    ...prev,
    battery_returned_id: vehicle.battery_id.toString()
  }));
}, [vehicleId]);
```

**Submit Flow**:

```javascript
1. Validate subscription_id không empty/undefined
2. Create swap transaction (POST /api/v1/swap-transactions)
3. Update battery_returned: in_use → charging (PATCH /api/v1/batteries/:id)
4. Update battery_taken: full → in_use (PATCH /api/v1/batteries/:id)
5. Update vehicle.battery_id to new battery (PATCH /api/v1/vehicles/:id)
6. Update swap request status → completed
7. Send notification to driver
8. Refresh battery list
```

**CSS Design** (Matching clean form reference):

- Single white card: `bg-white p-8 rounded-lg shadow-md`
- Material Icons: position absolute với top-1/2 -translate-y-1/2
- Input padding: `pl-12` để text không overlap với icon
- Read-only field: battery_returned_id (màu xám, disabled)
- Dropdown: battery_taken_id (full batteries only)

### 🔧 Services & API Layer

#### 1. **batteryService.js**

**File**: `frontend/src/services/batteryService.js`

**Key Function**:

```javascript
const updateBatteryById = async (id, batteryData) => {
  const response = await api.patch(
    // ⚠️ PHẢI DÙNG PATCH
    API_ENDPOINTS.BATTERY.UPDATE_BATTERY(id), // ⚠️ GỌI FUNCTION
    batteryData
  );
  return response.data;
};
```

**⚠️ Common Mistakes** (Đã fix):

- ❌ Dùng `api.put` → ✅ Đổi sang `api.patch`
- ❌ Template string `${API_ENDPOINTS.BATTERY.UPDATE_BATTERY}/${id}` → ✅ Gọi function `API_ENDPOINTS.BATTERY.UPDATE_BATTERY(id)`

**Lỗi trước khi fix**:

```
PUT /api/v1/(id)%20=%3E%20%60/batteries/$%7Bid%7D%60/1 404 Not Found
```

**Nguyên nhân**:

- URL encoding cho thấy function được stringify thay vì được gọi
- Backend batteries endpoint chỉ hỗ trợ PATCH, không hỗ trợ PUT

#### 2. **vehicleService.js**

```javascript
const updateVehicle = async (vehicleId, updateData) => {
  const response = await api.patch(
    API_ENDPOINTS.VEHICLE.UPDATE_VEHICLE(vehicleId),
    updateData
  );
  return response.data;
};
```

#### 3. **swapService.js**

```javascript
const createSwapTransaction = async (swapData) => {
  const response = await api.post(
    API_ENDPOINTS.SWAP_TRANSACTION.CREATE_TRANSACTION,
    swapData
  );
  return response.data;
};
```

#### 4. **subscriptionService.js**

**Fix cho backend trả array**:

```javascript
const getActiveSubscriptionByUserId = async (userId) => {
  const response = await api.get(
    API_ENDPOINTS.SUBSCRIPTION.GET_ACTIVE_BY_USER(userId)
  );
  const subscriptions = response.data;

  // Backend returns array, take first element
  return Array.isArray(subscriptions) && subscriptions.length > 0
    ? subscriptions[0]
    : null;
};
```

### 🗄️ Database Schema

#### swap_transactions table

```prisma
model SwapTransaction {
  transaction_id      Int @id @default(autoincrement())
  user_id             Int
  vehicle_id          Int
  station_id          Int
  battery_taken_id    Int
  battery_returned_id Int?  // Optional
  subscription_id     Int   // ⚠️ REQUIRED - Đã thêm vào schema
  createAt            DateTime @default(now())
  updateAt            DateTime @updatedAt
  status              SwapTransactionStatus
}
```

**⚠️ Prisma Client Sync Issue**:

- Khi thêm field mới vào schema, PHẢI chạy: `npx prisma generate`
- Lỗi nếu không sync: `Unknown argument 'subscription_id'`
- Backend NestJS cần restart sau khi generate Prisma Client

### 🐛 Issues Encountered & Solutions

#### Issue 1: Subscription_id undefined

**Triệu chứng**: URL params `subscriptionId=undefined`

**Root causes**:

1. DriverDashboard không fetch activeSubscription
2. Backend returns array, frontend expect object
3. Backend GET /vehicles?userId=5 trả 403

**Solutions**:

```javascript
// 1. Add useEffect to fetch subscription
useEffect(() => {
  const fetchSubscription = async () => {
    if (!user?.id) return;
    await getActiveSubscription(user.id);
  };
  fetchSubscription();
}, [user?.id]);

// 2. Fix subscriptionService to handle array
const subscriptions = response.data;
return Array.isArray(subscriptions) && subscriptions.length > 0
  ? subscriptions[0]
  : null;

// 3. Hardcode fallback for peppa
subscription_id: activeSubscription?.subscription_id ||
  (user.id === 5 ? 2 : undefined);
```

#### Issue 2: Prisma "Unknown argument subscription_id"

**Triệu chứng**:

```
Invalid `prisma.swapTransaction.create()` invocation
Unknown argument `subscription_id`. Available options are marked with ?.
```

**Root cause**: Prisma Client chưa regenerate sau khi thêm field

**Solution**:

```bash
cd backend
npx prisma generate
# Restart NestJS server
```

#### Issue 3: Battery update 404 error

**Triệu chứng**:

```
PUT /api/v1/(id)%20=%3E%20%60/batteries/$%7Bid%7D%60/1 404 Not Found
```

**Root causes**:

1. Dùng `api.put` thay vì `api.patch`
2. Template string concatenation thay vì function call

**Solution**:

```javascript
// ❌ SAI
const response = await api.put(
  `${API_ENDPOINTS.BATTERY.UPDATE_BATTERY}/${id}`,
  data
);

// ✅ ĐÚNG
const response = await api.patch(
  API_ENDPOINTS.BATTERY.UPDATE_BATTERY(id),
  data
);
```

#### Issue 4: Material Icons showing as text

**Triệu chứng**: "card_membership" text thay vì icon

**Solution**: Thêm CDN vào index.html

```html
<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>
```

#### Issue 5: Icon overlap text

**Triệu chứng**: Icon và input text chồng lên nhau

**Solution**: Tăng padding-left

```jsx
<input className="pl-12" />  // 48px thay vì 40px
<i className="material-icons absolute left-3 top-1/2 -translate-y-1/2" />
```

### 🎨 UI/UX Design

#### Clean Form Design

**Reference**: HTML form với white card, clean spacing

**Implementation**:

```jsx
<div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
  <h2 className="text-2xl font-bold mb-6">Manual Swap Transaction</h2>

  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Input with icon */}
    <div className="relative">
      <i className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400">
        person
      </i>
      <input
        className="w-full pl-12 pr-4 py-3 border rounded-lg"
        placeholder="User ID"
      />
    </div>
  </form>
</div>
```

**Color Scheme**:

- Primary: Blue (#2563eb)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Disabled: Gray (#9ca3af)

#### Material Icons Used

- `person` - User ID
- `electric_scooter` - Vehicle ID
- `ev_station` - Station ID
- `card_membership` - Subscription ID
- `battery_charging_full` - Battery Returned
- `battery_alert` - Battery Taken

### 🔄 Complete Data Flow

```
┌─────────────────┐
│ Driver Dashboard│
│ (user: peppa)   │
└────────┬────────┘
         │ 1. Click "Manual Swap"
         │ 2. Fetch subscription (GET /api/v1/subscriptions/user/5)
         │ 3. Create swap request
         ▼
┌─────────────────┐
│SwapRequestContext│
│  (localStorage)  │
└────────┬────────┘
         │ 4. Save request with subscription_id=2
         ▼
┌─────────────────┐
│ Staff Login     │
│ (user: ok)      │
└────────┬────────┘
         │ 5. Navigate to /staff/swap-requests
         ▼
┌─────────────────┐
│StaffSwapRequests│
└────────┬────────┘
         │ 6. Display pending requests
         │ 7. Click "Process Swap"
         ▼
┌──────────────────┐
│ManualSwapTrans   │
│  (Form)          │
└────────┬─────────┘
         │ 8. Auto-fill from URL params
         │ 9. Fetch vehicle → battery_returned_id=1
         │ 10. Select battery_taken_id=2 (dropdown)
         ▼
┌─────────────────┐
│  Submit Form    │
└────────┬────────┘
         │ 11. POST /api/v1/swap-transactions
         │     {
         │       user_id: 5,
         │       vehicle_id: 1,
         │       station_id: 1,
         │       battery_returned_id: 1,
         │       battery_taken_id: 2,
         │       subscription_id: 2,
         │       status: "completed"
         │     }
         ▼
┌─────────────────┐
│  Backend API    │
└────────┬────────┘
         │ 12. Validate all fields
         │ 13. Check battery_taken.status === "full"
         │ 14. Check subscription exists
         │ 15. Create transaction ✅
         ▼
┌─────────────────┐
│ Battery Updates │
└────────┬────────┘
         │ 16. PATCH /api/v1/batteries/1
         │     { status: "charging", station_id: 1 } ❌ (FAILING)
         │ 17. PATCH /api/v1/batteries/2
         │     { status: "in_use", station_id: null }
         ▼
┌─────────────────┐
│ Vehicle Update  │
└────────┬────────┘
         │ 18. PATCH /api/v1/vehicles/1
         │     { battery_id: 2 }
         ▼
┌─────────────────┐
│ Notifications   │
└────────┬────────┘
         │ 19. Update request status → completed
         │ 20. Send notification to driver
         │ 21. Refresh battery list
         └─────► ✅ Complete
```

### ⚠️ Current Status & Blockers

#### ✅ Đã hoàn thành:

1. SwapRequestContext với localStorage persistence
2. Driver tạo swap request với subscription_id
3. Staff xem danh sách requests
4. Form ManualSwapTransaction với auto-fill
5. Validate subscription_id presence
6. Prisma Client regeneration (subscription_id field)
7. Swap transaction creation SUCCESS
8. Clean CSS design matching reference

#### ❌ Đang bị block:

1. **Battery update API failing** - PATCH endpoint có vấn đề
2. Vehicle battery_id update - Chưa test được do step 1 fail
3. Complete swap flow testing - Blocked by battery updates

#### 🔧 Cần backend hỗ trợ:

##### 1. Vehicle API Permission

**Issue**: `GET /api/v1/vehicles?userId=5` trả 403 Forbidden

**Cần**:

- Endpoint mới: `GET /api/v1/vehicles/user/:userId` (public for own user)
- Hoặc fix permission check để user có thể query xe của mình
- Response format:

```json
{
  "vehicle_id": 1,
  "user_id": 5,
  "vin": "ABC123XYZ",
  "battery_id": 1,
  "model": "Tesla Model 3",
  "license_plate": "29A-12345"
}
```

##### 2. Battery Update Endpoint

**Issue**: PATCH /api/v1/batteries/:id có vấn đề (404 error dù đã fix frontend)

**Cần kiểm tra backend**:

- Endpoint có tồn tại không?
- Method có đúng PATCH không? (không phải PUT)
- Route pattern: `/batteries/:id` hay `/batteries/{id}`?
- Controller:

```typescript
@Patch(':id')
async updateBattery(
  @Param('id') id: number,
  @Body() updateData: UpdateBatteryDto
) {
  return this.batteryService.update(id, updateData);
}
```

##### 3. Subscription API Response

**Issue**: Backend trả array thay vì object

**Current**:

```json
GET /api/v1/subscriptions/user/5/active
[
  { subscription_id: 2, ... }
]
```

**Expected**:

```json
GET /api/v1/subscriptions/user/5/active
{ subscription_id: 2, ... }
```

**Hoặc**: Frontend đã workaround bằng cách lấy phần tử đầu tiên

##### 4. Swap Transaction Validation

**Backend cần validate**:

- `subscription_id` có tồn tại và active không?
- `subscription.user_id === swap.user_id`
- `subscription.vehicle_id === swap.vehicle_id`
- `battery_taken.status === "full"`
- `battery_taken.station_id === swap.station_id`

**Error responses**:

```json
{
  "statusCode": 400,
  "message": "Subscription not active",
  "error": "Bad Request"
}
```

### 📝 Code Examples

#### Tạo Swap Request (Driver)

```javascript
const handleManualSwap = async () => {
  try {
    // Fetch active subscription
    await getActiveSubscription(user.id);

    // Create request with fallback
    const swapRequest = createSwapRequest({
      user_id: user.id,
      user_name: user.name,
      vehicle_id: 1, // Hardcoded
      vin: "ABC123XYZ",
      subscription_id: activeSubscription?.subscription_id || 2,
      subscription_name:
        activeSubscription?.package?.package_name || "Premium Plan",
    });

    alert("Swap request created successfully!");
    navigate("/login"); // Staff login
  } catch (error) {
    console.error("Error creating swap request:", error);
    alert("Failed to create swap request");
  }
};
```

#### Xử lý Request (Staff)

```javascript
const handleProcessRequest = (request) => {
  const params = new URLSearchParams({
    userId: request.user_id,
    userName: request.user_name,
    vehicleId: request.vehicle_id,
    vin: request.vin,
    subscriptionId: request.subscription_id,
    subscriptionName: request.subscription_name,
    requestId: request.id,
  });

  navigate(`/staff/manual-swap?${params.toString()}`);
};
```

#### Submit Transaction (Form)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate subscription_id
  if (!formData.subscription_id || formData.subscription_id === "undefined") {
    alert("Subscription ID is required");
    return;
  }

  try {
    // Prepare data (battery_returned_id is optional)
    const swapData = {
      user_id: parseInt(formData.user_id),
      vehicle_id: parseInt(formData.vehicle_id),
      station_id: parseInt(formData.station_id),
      battery_taken_id: parseInt(formData.battery_taken_id),
      subscription_id: parseInt(formData.subscription_id),
      status: "completed",
    };

    if (formData.battery_returned_id) {
      swapData.battery_returned_id = parseInt(formData.battery_returned_id);
    }

    // 1. Create swap transaction
    const transaction = await swapService.createSwapTransaction(swapData);
    console.log("Transaction created:", transaction);

    // 2. Update battery_returned status
    await batteryService.updateBatteryById(formData.battery_returned_id, {
      status: "charging",
      station_id: parseInt(formData.station_id),
    });

    // 3. Update battery_taken status
    await batteryService.updateBatteryById(formData.battery_taken_id, {
      status: "in_use",
      station_id: null,
    });

    // 4. Update vehicle battery
    await vehicleService.updateVehicle(formData.vehicle_id, {
      battery_id: parseInt(formData.battery_taken_id),
    });

    // 5. Update request and notify
    updateRequestStatus(requestId, "completed");
    addNotification({
      userId: formData.user_id,
      message: `Your battery swap has been completed at ${stationName}`,
      type: "success",
    });

    alert("Swap transaction completed successfully!");
    navigate("/staff/swap-requests");
  } catch (error) {
    console.error("Error creating swap transaction:", error);
    alert("Failed to create swap transaction: " + error.message);
  }
};
```

### 🧪 Testing Checklist

#### Manual Testing Flow:

```
1. ☐ Login as peppa (user_id=5)
2. ☐ Navigate to /driver
3. ☐ Click "Manual Swap" button
4. ☐ Verify subscription_id=2 in request
5. ☐ Logout and login as ok (user_id=17, staff)
6. ☐ Navigate to /staff/swap-requests
7. ☐ Verify request appears in list
8. ☐ Click "Process Swap"
9. ☐ Verify form auto-fills:
   - User ID: 5
   - Vehicle ID: 1
   - Station ID: 1
   - Subscription ID: 2
   - Battery Returned: 1 (read-only)
10. ☐ Select Battery Taken: 2 from dropdown
11. ☐ Submit form
12. ☐ Check console for errors
13. ☐ Verify database:
    - swap_transactions: new row
    - batteries: ID=1 status=charging, ID=2 status=in_use
    - vehicles: ID=1 battery_id=2
14. ☐ Check driver notification
```

#### Database Queries for Verification:

```sql
-- Check swap transaction
SELECT * FROM swap_transactions
WHERE user_id = 5
ORDER BY createAt DESC
LIMIT 1;

-- Check battery statuses
SELECT battery_id, status, station_id, current_charge
FROM batteries
WHERE battery_id IN (1, 2);

-- Check vehicle battery
SELECT vehicle_id, user_id, battery_id
FROM vehicles
WHERE vehicle_id = 1;

-- Check subscription
SELECT subscription_id, user_id, vehicle_id, package_id, status
FROM subscriptions
WHERE subscription_id = 2;
```

### 🔐 Security Considerations

#### Current Hardcoded Values:

```javascript
// ⚠️ PRODUCTION: Cần thay bằng dynamic data
const HARDCODED = {
  peppa_user_id: 5,
  peppa_vehicle_id: 1,
  peppa_battery_id: 1,
  peppa_subscription_id: 2,
  ok_user_id: 17,
  ok_station_id: 1,
};
```

#### Production Requirements:

1. **Authentication**: JWT token validation cho mọi request
2. **Authorization**:
   - Driver chỉ tạo request cho xe của mình
   - Staff chỉ xử lý request tại station của mình
3. **Input Validation**:
   - Validate subscription thuộc về user
   - Validate vehicle thuộc về user
   - Validate battery tồn tại và available
4. **Transaction Safety**:
   - Wrap battery updates trong database transaction
   - Rollback nếu có lỗi
5. **Rate Limiting**: Giới hạn số requests/giờ để tránh abuse

### 📊 Performance Optimization

#### Current Issues:

1. Multiple sequential API calls trong handleSubmit
2. No loading states cho từng step
3. No retry mechanism nếu battery update fail

#### Recommended Improvements:

```javascript
// 1. Batch updates thành 1 backend endpoint
POST /api/v1/swap-transactions/complete
{
  transaction: { ... },
  updates: {
    batteries: [
      { id: 1, status: "charging" },
      { id: 2, status: "in_use" }
    ],
    vehicle: { id: 1, battery_id: 2 }
  }
}

// 2. Loading states
const [loading, setLoading] = useState({
  transaction: false,
  batteries: false,
  vehicle: false
});

// 3. Retry logic
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
};
```

### 📚 References & Resources

#### API Endpoints Documentation:

- Swagger: `http://localhost:8080/api/docs`
- Backend: `backend/src/modules/swap-transactions/`
- Prisma Schema: `backend/prisma/schema.prisma`

#### Frontend Files:

```
frontend/src/
├── contexts/
│   └── SwapRequestContext.jsx
├── components/
│   ├── dashboard/
│   │   ├── DriverDashboard.jsx
│   │   └── WelcomeHeader.jsx
│   └── swap/
│       ├── StaffSwapRequests.jsx
│       └── ManualSwapTransaction.jsx
├── services/
│   ├── batteryService.js      ⚠️ Fixed PATCH issue
│   ├── vehicleService.js
│   ├── swapService.js
│   └── subscriptionService.js ⚠️ Fixed array handling
└── constants/
    └── index.js               ⚠️ API_ENDPOINTS definitions
```

#### Backend Files:

```
backend/src/modules/
├── swap-transactions/
│   ├── swap-transactions.controller.ts
│   ├── swap-transactions.service.ts
│   └── dto/
│       └── create-swap-transaction.dto.ts
├── batteries/
│   └── batteries.controller.ts  ⚠️ Need to verify PATCH endpoint
└── subscriptions/
    └── subscriptions.controller.ts ⚠️ Returns array not object
```

### 🎓 Lessons Learned

#### 1. API Method Consistency

- **Lesson**: Backend dùng PATCH, frontend phải dùng PATCH
- **Mistake**: Dùng PUT thay vì PATCH → 404 error
- **Fix**: Đổi tất cả update calls sang `api.patch`

#### 2. Function vs String in API Endpoints

- **Lesson**: Dynamic endpoints phải là functions, không phải template strings
- **Mistake**: `${API_ENDPOINTS.BATTERY.UPDATE_BATTERY}/${id}`
- **Correct**: `API_ENDPOINTS.BATTERY.UPDATE_BATTERY(id)`

#### 3. Prisma Schema Sync

- **Lesson**: Sau khi thêm field vào schema, PHẢI chạy `npx prisma generate`
- **Mistake**: Quên generate → "Unknown argument" error
- **Fix**: Generate và restart backend

#### 4. Backend Response Format Consistency

- **Lesson**: Document rõ API response format (object vs array)
- **Issue**: GET subscriptions trả array, frontend expect object
- **Fix**: Frontend handle cả 2 cases hoặc backend đổi format

#### 5. Material Icons CDN

- **Lesson**: Material Icons cần CDN riêng, không đi kèm Tailwind/Remix Icons
- **Fix**: Thêm link CDN vào index.html

#### 6. localStorage Persistence

- **Lesson**: SwapRequests cần persist qua page refreshes
- **Implementation**: Lazy initialization + useEffect save
- **Benefit**: Data không mất khi navigate between pages

### 🚀 Next Steps

#### Immediate (Cần làm ngay):

1. **Fix battery update endpoint** - Kiểm tra backend PATCH /api/v1/batteries/:id
2. **Test complete swap flow** - Từ driver → staff → transaction → updates
3. **Error handling** - Add try-catch cho từng step, rollback nếu fail

#### Short-term (1-2 tuần):

1. **Remove hardcoded data**:
   - Fetch real vehicle data từ backend
   - Dynamic station_id based on staff
   - Remove peppa/ok specific logic
2. **Add transaction atomicity**:
   - Backend endpoint handle all updates trong 1 transaction
   - Rollback toàn bộ nếu có step nào fail
3. **Improve UX**:
   - Loading states cho từng step
   - Progress indicator (Step 1/5)
   - Confirmation modal trước submit

#### Long-term (1-2 tháng):

1. **Real-time updates**:
   - WebSocket cho staff notifications
   - Auto-refresh swap requests list
2. **Advanced features**:
   - Filter/search requests
   - Swap history với pagination
   - Battery health tracking
3. **Mobile app**:
   - React Native version
   - QR code scanning
   - Push notifications

---

**Last Updated**: October 22, 2025  
**Author**: GitHub Copilot Assistant  
**Status**: Transaction creation ✅ | Battery updates ❌ | Complete flow ⏳
