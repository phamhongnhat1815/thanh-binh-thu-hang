# Thiệp cưới Next.js — Thanh Bình & Thu Hằng

Hai trang tham chiếu:

- https://jmiiwedding.com/thanhdatminhhawedding/ — bìa phong thư, dấu sáp mở thiệp.
- https://jmiiwedding.com/dathaaa/ — thiệp chi tiết.

## Chạy

Yêu cầu Node.js 22 trở lên.

```sh
npm install
npm run dev
```

Mở http://localhost:3000. Bìa ở `/`, thiệp ở `/invitation`. Hai đường dẫn mẫu cũng được chuyển hướng đến các trang tương ứng.

```sh
npm run typecheck
npm test -- http://localhost:3001 # máy chủ cần đang chạy
npm run build
npm start
```

## Cách tổ chức

- `app/`: Next.js App Router, hai trang và API lời chúc/xác nhận.
- `components/Wedding.tsx`: hiệu ứng cuộn theo cấu hình gốc, gallery, nhạc, biểu mẫu.
- `components/FamilyMap.tsx`: hai bản đồ dưới thông tin nhà trai / nhà gái.
- `components/WeddingGift.tsx`: nút mừng cưới, hộp tài khoản và sao chép số tài khoản.
- `lib/cover.html`, `lib/invitation.html`: các lớp bố cục được chuyển từ nguồn tham chiếu; không chứa script hoặc tracking của trang gốc. Sửa chữ ở đây.
- `lib/*-events.json`: tên và thời gian chờ của hiệu ứng gốc.
- `public/cover.css`, `public/invitation.css`: kích thước, vị trí, phông chữ, keyframes và ảnh nền của mẫu.
- `lib/wedding-config.ts`: ngày/giờ đếm ngược, địa chỉ hai bên và thông tin mừng cưới.
- `public/assets/`: ảnh, font và nhạc đang được sử dụng; gồm 7 ảnh cưới của bạn.

Thiệp giữ canvas 420px của mẫu, co đồng đều theo bề rộng điện thoại và nằm giữa màn hình laptop. Giữ bố cục giấy/hoa và album gốc; phần Khoảnh khắc hạnh phúc thêm trước đó đã được gỡ. Hai bản đồ đặt dưới thông tin hai bên gia đình. Đã bỏ khối địa điểm/Chỉ đường cũ và chữ Dresscode.

Thông tin cập nhật từ ảnh thiệp: Thanh Bình & Thu Hằng; tiệc chung vui 17:00 Chủ nhật 15.11.2026 (07/10 âm lịch); lễ nạp tài 09:00 ngày 14.11 tại nhà gái; lễ thành hôn 11:00 ngày 16.11 tại nhà trai. Ảnh trang bìa giữ theo mẫu; ảnh cưới trong thiệp dùng ảnh của bạn, giữ nguyên các lớp bố cục. Bản đồ tìm theo địa chỉ thôn Tiến Thắng / Chung Sơn trong ảnh, không khẳng định vị trí chính xác từng tư gia.

Thông tin mừng cưới được cấu hình tại `lib/wedding-config.ts` theo dữ liệu người dùng cung cấp. Không tạo QR hay thực hiện chuyển tiền. Máy chủ xem thử mặc định chỉ lắng nghe trên `127.0.0.1`.

## Lời chúc và RSVP

Biểu mẫu gửi thông tin trực tiếp qua Gmail SMTP đến cô dâu hoặc chú rể theo lựa chọn của khách. API không ghi tệp, không dùng database và không công khai lời chúc. `/api/wishes` GET trả danh sách rỗng để tương thích với giao diện. Các dữ liệu local cũ trong `data/` không bị xóa nhưng không còn được sử dụng.

API chỉ báo thành công sau khi Gmail chấp nhận thư. Nếu SMTP lỗi hoặc tính năng gửi chưa bật, API trả lỗi và form giữ thông tin để khách thử lại. Máy chủ không lưu bản sao xác nhận.

Một ảnh nền trong popup ẩn của mẫu trả về 404; đã thay bằng giấy nền có sẵn của mẫu. Các tài nguyên thừa và thư mục bản site cũ đã được loại khỏi dự án.

## Đóng gói để deploy

Chỉ cần mã nguồn, `public/`, `package.json`, `package-lock.json` và các tệp cấu hình. Không tải lên `node_modules/`, `.next/`, `*.tsbuildinfo` hoặc `.DS_Store`; môi trường triển khai chạy `npm ci` và `npm run build` để tạo lại. Không cần tải thư mục `data/`; phiên bản hiện tại gửi xác nhận qua email, không lưu tệp.

## Gmail SMTP — thử trên local

1. Bật xác minh 2 bước cho tài khoản Gmail gửi thư, rồi tạo App Password tại https://myaccount.google.com/apppasswords.
2. Sao chép `.env.example` thành `.env.local`. Điền `GMAIL_USER` (email gửi), `GMAIL_APP_PASSWORD` (mật khẩu ứng dụng), `GROOM_EMAIL`, `BRIDE_EMAIL`. Đặt `RSVP_EMAIL_ENABLED=true`.
3. Khởi động lại `npm run dev`. Mở `/invitation`, gửi dữ liệu thử cho từng lựa chọn khách cô dâu/chú rể rồi kiểm tra hộp thư nhận (và Spam).
4. Có thể đặt cả hai địa chỉ nhận bằng email của bạn khi thử. Không cần tên miền riêng.

Mật khẩu chỉ nằm phía server, `.env.local` đã được Git bỏ qua. Đừng dùng mật khẩu Gmail thông thường hoặc biến `NEXT_PUBLIC_` cho bí mật. Nếu SMTP lỗi, thông tin được giữ trong form để thử lại; không có dữ liệu được lưu trên máy chủ hoặc cơ chế tự gửi lại email.

Kiểm tra chọn người nhận mà không gửi thư: `node scripts/email-test.mjs` (Node hỗ trợ chạy TypeScript trực tiếp, ví dụ Node 22.18+).

Khi chuyển lên Vercel, cấu hình các biến trên trong Environment Variables rồi deploy lại. Phiên bản này dùng email trực tiếp nên không cần database trên Vercel. Chống spam chưa được thêm theo yêu cầu bỏ qua của người dùng.
