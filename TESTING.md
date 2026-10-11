# Kiểm tra đã thực hiện

Bản kiểm tra cuối: Next.js 16.4.0, production server http://localhost:3001.

- `npm run typecheck`: thành công.
- `npm run build`: thành công, hai trang tĩnh và API Node.
- `npm test -- http://localhost:3001`: thành công; hai trang HTTP 200, 5 trường hợp dữ liệu sai bị từ chối, API công khai chỉ trả tên và lời chúc, 78 tài nguyên CSS phục vụ HTTP 200.
- npm audit sau cập nhật: 0 vulnerabilities.
- 72 ảnh PNG/JPEG xác minh giải mã thành công.
- Trình duyệt: mở thiệp từ bìa, đổi ảnh album gốc, mở ảnh lớn album mới, đổi ảnh và đóng để trả focus, phát/tắt nhạc, ngăn gửi biểu mẫu rỗng.
- Gửi RSVP trên bản production: lời chúc hiển thị, tệp dữ liệu lưu đúng 2 người và khách nhà trai. Đã xóa bản ghi thử.

| Viewport |          Canvas thiệp | Tràn ngang |
| -------- | --------------------: | ---------- |
| 320 px   |                320 px | Không      |
| 375 px   |                375 px | Không      |
| 390 px   |                390 px | Không      |
| 430 px   | 420 px, giữa màn hình | Không      |
| 768 px   | 420 px, giữa màn hình | Không      |
| 1440 px  | 420 px, giữa màn hình | Không      |

Ảnh kiểm tra cũ đã được loại khỏi gói dự án. Các kích thước điện thoại được giả lập trong trình duyệt; chưa kiểm tra trên thiết bị iOS/Android thật.

Giữ nội dung mẫu, đổi mốc bộ đếm về đúng 25.10.2025 thay vì ngày khác trong mã gốc. Không sao chép lời chúc của khách thật từ trang tham chiếu. Một ảnh nền popup ẩn trả 404 ở nguồn đã được thay bằng texture giấy gốc.

## Kiểm tra sau cập nhật thông tin thật

- Build / TypeScript / smoke test đều đạt.
- Hai bản đồ Google Maps tải thành công, hai liên kết chỉ đường trỏ tới địa chỉ thôn tương ứng.
- Hộp mừng cưới mở/đóng, hiển thị VietinBank và dữ liệu người dùng cung cấp; sao chép số tài khoản thành công.
- Bỏ phần Khoảnh khắc hạnh phúc, khối địa điểm cũ và chữ Dresscode; giữ màu dresscode của mẫu.
- Ngày trên bìa và lịch đổi thành 15.11.2026; đếm ngược tới 17:00 Việt Nam cùng ngày.
- Máy chủ chỉ phục vụ localhost sau cập nhật thông tin tài khoản.
