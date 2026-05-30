# 🌐 Hướng dẫn giấu API Key khi Deploy ứng dụng (HeritageAPI)

Khi deploy ứng dụng lên server (ví dụ: **SmarterASP.NET** mà bạn đang dùng với tên miền `ktempurl.com`), việc bảo mật các API Key như Gemini là cực kỳ quan trọng để tránh bị Google khóa do lộ key.

Dưới đây là các phương pháp bảo mật và giấu key chi tiết:

---

## 🔒 Nguyên lý hoạt động
* **Frontend (React)**: Không chứa bất kỳ API Key nào. Frontend chỉ gọi API trung gian của backend: `https://tenhieu1-001-site1.ktempurl.com/api/ai/ask`. Do đó, người dùng thông thường khi F12 sẽ **không bao giờ thấy** API Key của bạn.
* **Backend (ASP.NET Core)**: Là nơi thực hiện gọi trực tiếp đến Google. Chúng ta sẽ giấu key ở đây bằng cách **không commit key vào Git** mà cấu hình nó trực tiếp trên môi trường chạy (Runtime Environment).

---

## 🛠️ Cách 1: Cấu hình Environment Variable trên SmarterASP.NET (Khuyên Dùng)

ASP.NET Core tự động đọc các biến môi trường và nạp vào cấu hình (`IConfiguration`). Đối với các khóa phân cấp dạng JSON (như `"Gemini": { "ApiKey": "..." }`), trong biến môi trường ta thay dấu hai chấm `:` bằng **2 dấu gạch dưới** (`__`). Do đó biến môi trường sẽ tên là `Gemini__ApiKey`.

### Các bước thực hiện:
1. Đăng nhập vào trang quản trị **SmarterASP.NET Control Panel**.
2. Chọn **Websites** từ menu.
3. Nhấp vào nút **Advance** bên cạnh website của bạn, sau đó chọn **Pool Manager** (hoặc App Pool Settings).
4. Tìm phần **Environment Variables** (thường nằm dưới mục Actions).
5. Thêm một biến mới:
   * **Name**: `Gemini__ApiKey` (Lưu ý: 2 dấu gạch dưới `_`).
   * **Value**: `AQ_YOUR_API_KEY_HERE` (Key mới của bạn).
6. Lưu lại và thực hiện **Recycle/Restart Application Pool** để áp dụng thay đổi.

---

## 🛠️ Cách 2: Sửa trực tiếp file `appsettings.json` trên Server bằng File Manager

Nếu bạn không muốn thiết lập biến môi trường, bạn có thể sửa trực tiếp file cấu hình trên server sau khi đã publish code lên.

### Các bước thực hiện:
1. Trong file `appsettings.json` ở máy local của bạn, hãy để key giả hoặc trống:
   ```json
   "Gemini": {
     "ApiKey": "YOUR_PLACEHOLDER_KEY"
   }
   ```
   *(Như vậy khi push code lên GitHub sẽ không bị lộ)*.
2. Publish/Deploy code lên server **SmarterASP.NET** như bình thường.
3. Đăng nhập vào **SmarterASP.NET Control Panel**.
4. Truy cập vào **File Manager** và tìm đến thư mục root chứa source code đã chạy của bạn.
5. Tìm file `appsettings.json`, chọn **Edit** trực tiếp trên web.
6. Thay đổi giá trị `"YOUR_PLACEHOLDER_KEY"` thành API Key thật của bạn:
   ```json
   "Gemini": {
     "ApiKey": "AQ_YOUR_API_KEY_HERE"
   }
   ```
7. Lưu file lại. ASP.NET Core sẽ tự động reload cấu hình mới mà không cần restart app.

---

## 🛠️ Cách 3: Cấu hình qua file `web.config` trên server

ASP.NET Core chạy dưới IIS trên SmarterASP.NET thường sử dụng file `web.config` để điều hướng. Bạn có thể định nghĩa biến môi trường ngay trong file này.

### Các bước thực hiện:
1. Mở file `web.config` trên thư mục gốc của server (hoặc file cục bộ nếu bạn cấu hình không đưa file này lên Git).
2. Thêm thẻ `<environmentVariables>` vào trong thẻ `<aspNetCore>`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <configuration>
     <system.webServer>
       <handlers>
         <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
       </handlers>
       <aspNetCore processPath="dotnet" arguments=".\HeritageAPI.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" hostingModel="inprocess">
         <environmentVariables>
           <!-- Thêm biến môi trường chứa API Key ở đây -->
           <environmentVariable name="Gemini__ApiKey" value="AQ_YOUR_API_KEY_HERE" />
         </environmentVariables>
       </aspNetCore>
     </system.webServer>
   </configuration>
   ```
3. Lưu lại file.
