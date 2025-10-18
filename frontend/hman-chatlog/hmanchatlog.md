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
