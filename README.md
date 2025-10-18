# ShareMoney (React + Node.js)

Ung dung web giup hai ban cung phong ghi lai cac khoan chi tieu chung, tinh toan so tien can hoan lai va theo doi trang thai thanh toan tung thang. Frontend duoc viet bang React + Tailwind CSS (Vite), backend su dung Node.js/Express va luu tru du lieu tren tep JSON don gian.

## Cau truc thu muc

```
c:\OSS\sharemoney
|- client   # Ung dung React (Vite + Tailwind CSS)
|- server   # API Node.js/Express va luu tru du lieu
```

## Huong dan cai dat

Yeu cau Node.js >= 18.

### Backend (server)

```powershell
cd server
npm install
npm run dev
```

Server mac dinh chay tai `http://localhost:4000`. Co the dat bien moi truong:

- `PORT`: cong server (mac dinh 4000)
- `CLIENT_ORIGIN`: domain duoc phep goi API (mac dinh `http://localhost:5173`)

### Frontend (client)

```powershell
cd client
npm install
npm run dev
```

Vite se chay tai `http://localhost:5173`. Giao dien su dung Tailwind CSS, co the tuy bien tai `tailwind.config.js` va `src/index.css`. Neu can, tao file `.env` voi:

- `VITE_API_URL=http://localhost:4000` neu muon truy cap API truc tiep khong thong qua proxy.

## Chuc nang chinh

- Dat ten hai thanh vien phong tro.
- Them, xoa tung khoan chi tieu hoac xoa toan bo danh sach.
- Tong hop so tien moi nguoi da chi, so tien can chia deu va goi y ai can chuyen tien.
- Thong ke theo thang: xem tong chi tieu, so tien moi nguoi phai gop va danh dau trang thai da/ chua thanh toan cho tung thang.
- Du lieu duoc luu tren server (tep `server/data/store.json`).

## Tiep tuc phat trien

- Them xac thuc de chia se cho nhieu cap ban.
- Tich hop co so du lieu thuc (SQLite, PostgreSQL, ...).
- Viet bo kiem thu (frontend va backend).

Chuc ban su dung hieu qua!
