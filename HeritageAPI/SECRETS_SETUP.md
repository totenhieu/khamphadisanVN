# 🛡️ Hướng dẫn Setup Credentials - HeritageAPI

## ⚠️ QUAN TRỌNG: Không được commit credentials vào Git!

Dự án này dùng **ASP.NET Core User Secrets** để quản lý credentials ở môi trường Development.

---

## 🚀 Setup cho Developer mới

### Bước 1: Khởi tạo User Secrets (chạy 1 lần)

```powershell
dotnet user-secrets init --project HeritageAPI/HeritageAPI.csproj
```

### Bước 2: Set Connection String

Liên hệ **team lead** để lấy password database thực, sau đó chạy:

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=SQL1001.site4now.net;Database=db_ac9d8c_heritagedb;User Id=db_ac9d8c_heritagedb_admin;Password=<PASSWORD_THỰC>;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true;" --project HeritageAPI/HeritageAPI.csproj
```

> Secrets được lưu tại `%APPDATA%\Microsoft\UserSecrets\` trên máy bạn — **không** bao giờ bị push lên Git.

### Bước 3: Kiểm tra secrets đã set

```powershell
dotnet user-secrets list --project HeritageAPI/HeritageAPI.csproj
```

---

## 🌐 Production / Deployment

Trên server production, set **Environment Variable** thay vì User Secrets:

```
ConnectionStrings__DefaultConnection=Server=...;Password=...;
```

Hoặc dùng **Azure Key Vault** / **Docker secrets** nếu deploy bằng container.

---

## 📋 Checklist khi thêm credentials mới

- [ ] Không bao giờ hardcode vào `appsettings.json`
- [ ] Luôn dùng `dotnet user-secrets set` ở local
- [ ] Thêm key name vào README này để team biết cần set gì
- [ ] Kiểm tra `.gitignore` đã loại trừ file nhạy cảm chưa

---

## 🔑 Danh sách Secrets cần Set

| Key | Mô tả |
|-----|-------|
| `ConnectionStrings:DefaultConnection` | Connection string đến SQL Server |
| `Gemini:ApiKey` | API Key của Google Gemini |
