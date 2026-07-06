# 🚀 Kaiwa Test

> Aplikasi full-stack modern dengan backend Python dan frontend React Native berbasis Expo

<div align="center">

[![GitHub Repo](https://img.shields.io/badge/GitHub-Kaiwa--Test-181717?style=for-the-badge&logo=github)](https://github.com/zimamkhoirulirsad-coder/Kaiwa-Test)
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-Native-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)

![Issues](https://img.shields.io/github/issues/zimamkhoirulirsad-coder/Kaiwa-Test?style=flat-square)
![Forks](https://img.shields.io/github/forks/zimamkhoirulirsad-coder/Kaiwa-Test?style=flat-square)
![Stars](https://img.shields.io/github/stars/zimamkhoirulirsad-coder/Kaiwa-Test?style=flat-square)

</div>

---

## 📋 Daftar Isi

| Bagian | Deskripsi |
|--------|-----------|
| [🎯 Tentang](#-tentang) | Gambaran umum proyek |
| [✨ Fitur](#-fitur) | Fitur utama aplikasi |
| [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) | Teknologi yang digunakan |
| [📦 Persyaratan](#-persyaratan) | Kebutuhan sistem |
| [🚀 Mulai Cepat](#-mulai-cepat) | Setup dan menjalankan proyek |
| [📁 Struktur Proyek](#-struktur-proyek) | Organisasi folder |
| [⚙️ Konfigurasi](#%EF%B8%8F-konfigurasi) | Setup lingkungan |
| [🤝 Kontribusi](#-kontribusi) | Panduan berkontribusi |
| [📄 Lisensi](#-lisensi) | Informasi lisensi |

---

## 🎯 Tentang

Kaiwa Test adalah proyek pembelajaran dan pengembangan yang mengintegrasikan:
- **Backend robus** dengan Python untuk API server
- **Frontend modern** menggunakan React Native & Expo untuk cross-platform mobile
- **Struktur scalable** dengan modularisasi data, komponen, dan utilitas

Proyek ini dirancang untuk menjadi fondasi yang solid untuk pengembangan aplikasi mobile yang responsif dan performa tinggi.

---

## ✨ Fitur

- ✅ **Backend Ringan & Cepat** — API server berbasis Python dengan routing yang efisien
- ✅ **Multi-Platform Frontend** — Berjalan di iOS, Android, dan Web dengan Expo
- ✅ **Modular Architecture** — Pemisahan yang jelas antara komponen, data, dan hook
- ✅ **TypeScript Support** — Type-safe development dengan TypeScript di frontend
- ✅ **Scalable Structure** — Mudah diperluas untuk fitur baru
- ✅ **Development Ready** — Siap untuk development dan production

---

## 🛠️ Tech Stack

### Backend
| Teknologi | Versi | Deskripsi |
|-----------|-------|----------|
| **Python** | 3.8+ | Runtime utama |
| **Flask/FastAPI** | Latest | Web framework |

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|----------|
| **React Native** | Latest | UI Framework |
| **Expo** | Latest | Development & Build tools |
| **TypeScript** | Latest | Type Safety |
| **Metro** | Latest | JavaScript bundler |

---

## 📦 Persyaratan

Sebelum memulai, pastikan Anda telah menginstall:

- **Python** 3.8 atau lebih tinggi
- **Node.js** 16 atau lebih tinggi
- **Yarn** atau **npm** (package manager)
- **Expo CLI** untuk menjalankan aplikasi mobile
- **Git** untuk version control

### Verifikasi Instalasi
```bash
python --version      # Python 3.8+
node --version        # Node.js 16+
npm --version         # atau yarn --version
git --version         # Git installed
```

---

## 🚀 Mulai Cepat

### 1️⃣ Clone Repository
```bash
git clone https://github.com/zimamkhoirulirsad-coder/Kaiwa-Test.git
cd Kaiwa-Test
```

### 2️⃣ Setup Backend

```bash
cd backend

# Buat virtual environment
python -m venv .venv

# Aktivasi virtual environment
source .venv/bin/activate          # Linux/Mac
# atau
.venv\Scripts\activate             # Windows

# Install dependencies
pip install -r requirements.txt

# Jalankan server
python server.py
```

✅ Backend tersedia di: `http://localhost:8000`

### 3️⃣ Setup Frontend

```bash
cd frontend

# Install dependencies
yarn install
# atau
npm install

# Jalankan aplikasi
yarn start
# atau
npm start
# atau
expo start
```

📱 Ikuti petunjuk di terminal untuk membuka di:
- **iOS Simulator** (tekan `i`)
- **Android Emulator** (tekan `a`)
- **Web Browser** (tekan `w`)
- **Physical Device** (scan QR code dengan Expo Go)

---

## 📁 Struktur Proyek

```
Kaiwa-Test/
├── backend/                    # 🐍 Server Python
│   ├── server.py              # Entry point server
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables (local only)
│
├── frontend/                   # ⚛️ Aplikasi React Native
│   ├── app/                    # Navigasi & Screens
│   │   ├── _layout.tsx         # Root layout
│   │   ├── index.tsx           # Home screen
│   │   ├── onboarding.tsx      # Onboarding screen
│   │   └── (tabs)/             # Tab-based navigation
│   │
│   ├── src/                    # Source code
│   │   ├── components/         # Reusable UI components
│   │   ├── data/               # Data (grammar, vocab, scenarios)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries (API calls)
│   │   ├── store/              # State management (user)
│   │   ├── theme.ts            # Design tokens & styling
│   │   └── utils/              # Helper functions
│   │
│   ├── assets/                 # Gambar & font
│   ├── package.json            # Dependencies & scripts
│   ├── tsconfig.json           # TypeScript config
│   └── metro.config.js         # Metro bundler config
│
├── tests/                      # 🧪 Testing suite
├── design_guidelines.json      # 🎨 UI/UX guidelines
├── README.md                   # Dokumentasi (file ini)
└── .gitignore                  # Git ignore rules
```

---

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env` di masing-masing folder:

**`backend/.env`**
```env
FLASK_ENV=development
FLASK_APP=server.py
DEBUG=True
PORT=8000
```

**`frontend/.env`**
```env
API_URL=http://localhost:8000
EXPO_PUBLIC_API_URL=http://localhost:8000
```

> ⚠️ **Penting**: File `.env` tidak disertakan di repository untuk keamanan. Buat file lokal berdasarkan kebutuhan Anda.

### Scripts Tersedia

#### Backend
```bash
# Jalankan server
python server.py

# Dengan hot reload
python -m flask run --reload
```

#### Frontend
```bash
# Start dev server
npm start              # atau yarn start

# Bersihkan cache
npm run reset-project

# Build untuk production
npm run build

# Test
npm test
```

---

## 🤝 Kontribusi

Kami menerima kontribusi dari siapa saja! Ikuti langkah-langkah berikut:

### Proses Kontribusi

1. **Fork Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Kaiwa-Test.git
   ```

2. **Buat Branch Fitur**
   ```bash
   git checkout -b feature/nama-fitur-anda
   ```

3. **Commit Perubahan**
   ```bash
   git commit -m "feat: deskripsi perubahan yang jelas"
   ```

4. **Push ke Repository**
   ```bash
   git push origin feature/nama-fitur-anda
   ```

5. **Buat Pull Request**
   - Jelaskan perubahan Anda dengan detail
   - Link ke issue yang relevan (jika ada)
   - Sertakan screenshot/video jika ada UI changes

### Conventional Commits

Gunakan format commit berikut:
- `feat:` — Fitur baru
- `fix:` — Bug fix
- `docs:` — Dokumentasi
- `style:` — Formatting, semicolons, etc
- `refactor:` — Code restructuring
- `test:` — Testing
- `chore:` — Maintenance

**Contoh:**
```bash
git commit -m "feat: tambah authentication module"
git commit -m "fix: resolve memory leak di useEffect"
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE). Lihat file `LICENSE` untuk detail lengkap.

---

## 📞 Support

Jika Anda mengalami masalah:

1. **Periksa Issue yang Ada** — [Issues Page](https://github.com/zimamkhoirulirsad-coder/Kaiwa-Test/issues)
2. **Buat Issue Baru** — Jelaskan masalah dengan detail dan screenshot
3. **Diskusi** — Gunakan GitHub Discussions untuk pertanyaan umum

---

<div align="center">

**Made with ❤️ by [zimamkhoirulirsad-coder](https://github.com/zimamkhoirulirsad-coder)**

⭐ Jika proyek ini membantu Anda, berikan bintang!

</div>
