# CVCraft | Premium CV Oluşturucu

CVCraft, kullanıcıların profesyonel, modern ve göze hitap eden özgeçmişler (CV) hazırlamasını sağlayan, yapay zeka destekli ve tam kapsamlı bir web uygulamasıdır. Proje, Node.js tabanlı Express backend mimarisi ve Vanilla JS/CSS ön uç yapısı ile modern yazılım mimarisi standartlarına uygun olarak tasarlanmıştır.

## 🚀 Öne Çıkan Özellikler

*   **Premium & Responsive Arayüz:** Derin uzay teması (Deep Space) ve cam morfolojisi (Glassmorphism) esintili, kullanıcı dostu modern tasarım.
*   **Çift Yönlü Güvenli Yetkilendirme:** JWT (JSON Web Token) tabanlı backend kimlik doğrulama mimarisi ile kullanıcı kayıt, giriş ve profil yönetimi.
*   **Adım Adım CV Sihirbazı:** Kişisel bilgiler, iş deneyimleri, eğitim geçmişi, yetenekler, diller ve projeler için dinamik sıralama/ekleme özellikleri.
*   **Seçilebilir Premium Şablonlar:** Tek tıkla şablonlar arası geçiş (Modern, Kurumsal ve Yaratıcı temalar).
*   **Dinamik Dil Desteği:** Türkçe ve İngilizce dilleri arasında anlık geçiş ve otomatik etiket yerelleştirmesi.
*   **PDF Olarak İndirme & Yazıcı Optimizasyonu:** `html2pdf.js` entegrasyonu ile tam A4 standartlarında PDF çıktısı alma ve `@media print` stil optimizasyonları.
*   **Yapay Zeka Destekli İçerik Geliştirici:** Prompt (yönlendirme) tabanlı, simüle edilmiş AI asistanı ile özgeçmiş özetlerini ve iş deneyimi açıklamalarını zenginleştirme.
*   **Çevrimiçi Paylaşım Bağlantısı:** CV'yi dış dünya ile paylaşmak için benzersiz ve güvenli paylaşımlı bağlantı oluşturma mimarisi (`#share/shareId`).

---

## 📁 Proje Klasör Yapısı

```text
cv-builder/
├── backend/
│   ├── data/
│   │   └── database.json       # JSON tabanlı veri saklama dosyası (otomatik oluşur)
│   ├── middleware/
│   │   └── auth.js             # JWT yetkilendirme katmanı
│   ├── database.js             # Veritabanı okuma/yazma motoru
│   ├── package.json            # Node.js bağımlılıkları ve betikleri
│   └── server.js               # Express API sunucusu
├── app.js                      # Ön uç logic kontrolörü (State, Router, Form Sync)
├── index.html                  # Ön uç HTML iskeleti ve ekranları
├── README.md                   # Proje dokümantasyonu
└── style.css                   # Premium CSS stilleri ve medya sorguları
```

---

## 🛠️ Teknolojik Altyapı

*   **Ön Uç (Frontend):** HTML5, Vanilla CSS3 (Custom Properties, Grid, Flexbox), Vanilla ES6 JavaScript
*   **Arka Uç (Backend):** Node.js, Express.js
*   **Veritabanı (Database):** Local JSON-File database (`fs.promises` asenkron okuma/yazma)
*   **Güvenlik (Security):** `bcryptjs` (şifreleme), `jsonwebtoken` (JWT token yetkilendirme)
*   **İkon Kütüphanesi:** Lucide Icons
*   **Dış Kütüphane:** html2pdf.js (A4 PDF indirme motoru)

---

## 💻 Kurulum ve Çalıştırma

### 1. Arka Uç (Backend) Çalıştırma
Projeyi çalıştırmadan önce bilgisayarınızda **Node.js** kurulmuş olması gerekmektedir.

1. Terminali açın ve `backend` klasörüne girin:
   ```bash
   cd backend
   ```
2. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Sunucuyu geliştirici modunda başlatın:
   ```bash
   npm run dev
   ```
   *Sunucunuz varsayılan olarak `http://localhost:5000` portunda çalışacaktır.*

### 2. Ön Uç (Frontend) Çalıştırma
Ön uç uygulaması ek bir derleme veya derleyici gerektirmez:
*   Projenin kök dizininde bulunan **`index.html`** dosyasına çift tıklayarak tarayıcınızda doğrudan çalıştırabilirsiniz.

---

## 📅 GitHub 3 Günlük Yükleme Planı (Hoca Takibi İçin)

Projenizi hocanıza düzenli gelişim göstermek amacıyla şu commit planıyla göndermeniz tavsiye edilir:

*   **1. GÜN (Backend Altyapısı):** `package.json`, `auth.js`, `database.js` ve `.gitignore` dosyalarını ekleyip `"feat(backend): setup auth, dependencies and database layer"` commit'i ile gönderin.
*   **2. GÜN (API Rotaları & HTML İskeleti):** `server.js` ve `index.html` dosyalarını ekleyip `"feat(api/ui): implement API routes and SPA HTML screens"` commit'i ile gönderin.
*   **3. GÜN (Tasarım & Logic Bağlantısı):** `style.css`, `app.js` ve `README.md` dosyalarını ekleyip `"feat(polish): add premium styling, SPA router and controller logic"` commit'i ile tamamlayın.
