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

Biểu mẫu gửi đến API của dự án, không gửi đến JMII/LadiPage. API lưu cả RSVP và lời nhắn vào `data/wishes.jsonl`; chỉ tên và lời chúc được trả ra giao diện. Không sao chép lời chúc thật của khách từ trang tham chiếu. `WEDDING_DATA_DIR` cho phép chỉ định thư mục dữ liệu.

Khi triển khai, cần chạy trên máy chủ Node có ổ đĩa ghi được và lưu bền vững. Nếu dùng môi trường serverless, cần thay lưu trữ tệp bằng cơ sở dữ liệu trước khi dùng RSVP thật. Dự án chưa được xuất bản.

Một ảnh nền trong popup ẩn của mẫu trả về 404; đã thay bằng giấy nền có sẵn của mẫu. Các tài nguyên thừa và thư mục bản site cũ đã được loại khỏi dự án.

## Đóng gói để deploy

Chỉ cần mã nguồn, `public/`, `package.json`, `package-lock.json` và các tệp cấu hình. Không tải lên `node_modules/`, `.next/`, `*.tsbuildinfo` hoặc `.DS_Store`; môi trường triển khai chạy `npm ci` và `npm run build` để tạo lại. Thư mục `data/` là dữ liệu lời chúc/RSVP, cần được lưu bền vững trên máy chủ.

## Gmail SMTP — thử trên local

1. Bật xác minh 2 bước cho tài khoản Gmail gửi thư, rồi tạo App Password tại https://myaccount.google.com/apppasswords.
2. Sao chép `.env.example` thành `.env.local`. Điền `GMAIL_USER` (email gửi), `GMAIL_APP_PASSWORD` (mật khẩu ứng dụng), `GROOM_EMAIL`, `BRIDE_EMAIL`. Đặt `RSVP_EMAIL_ENABLED=true`.
3. Khởi động lại `npm run dev`. Mở `/invitation`, gửi dữ liệu thử cho từng lựa chọn khách cô dâu/chú rể rồi kiểm tra hộp thư nhận (và Spam).
4. Có thể đặt cả hai địa chỉ nhận bằng email của bạn khi thử. Không cần tên miền riêng.

Mật khẩu chỉ nằm phía server, `.env.local` đã được Git bỏ qua. Đừng dùng mật khẩu Gmail thông thường hoặc biến `NEXT_PUBLIC_` cho bí mật. Email được gửi sau khi lưu xác nhận; nếu SMTP lỗi, thông tin vẫn được lưu và giao diện báo chưa gửi được email. Hiện chưa có cơ chế tự gửi lại email lỗi.

Kiểm tra chọn người nhận mà không gửi thư: `node scripts/email-test.mjs` (Node hỗ trợ chạy TypeScript trực tiếp, ví dụ Node 22.18+).

Khi chuyển lên Vercel, cấu hình các biến trên trong Environment Variables rồi deploy lại. Trước khi dùng form thật, phải chuyển lưu trữ `data/wishes.jsonl` sang database bền vững và bổ sung giới hạn gửi/chống spam; phiên bản hiện tại dành cho thử local, chưa giải quyết hai phần này.
