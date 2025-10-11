## PHẦN BỔ SUNG — TÓM TẮT NGẮN (không xóa nội dung cũ)

- Mục tiêu: thêm bản tóm tắt cực ngắn để developer đọc nhanh, không thay đổi nội dung hiện có.

- Tóm tắt ngắn:
  - AuthContext: quản lý state toàn cục (user, accessToken), lưu vào localStorage và decode JWT khi cần.
  - useAuthHandlers: hook chứa business logic (gọi AuthContext, xử lý điều hướng theo role, và side-effects).
  - AuthContainer: container orchestration — nhận handlers và truyền props xuống presentation.
  - Login / Register: presentation components, chỉ render form và gọi onSubmit prop.

- Luồng một dòng: Presentation → AuthContainer → useAuthHandlers → AuthContext → authService → API → Response → navigate

- Ghi chú: phần này là bổ sung, không xóa/bỏ nội dung bạn đã viết trong `hmanchatlog.md`.