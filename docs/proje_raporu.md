# YAPAY ZEKA DESTEKLİ CV OLUŞTURMA PLATFORMU 
## DÖNEM PROJESİ SONUÇ RAPORU

**Geliştirici:** Ayşe Canlı 
**Kurum:** Gazi University  
**Proje Dönemi:** Mayıs 2026  

---

### 1. PROJE ÖZETİ VE AMACI
Bu proje; modern iş dünyasında adayların özgeçmişlerini profesyonel, İK (İnsan Kaynakları) standartlarına uygun ve ATS (Aday Takip Sistemleri) uyumlu hale getirmelerini kolaylaştırmak amacıyla geliştirilmiş yapay zeka destekli bir full-stack web uygulamasıdır. 

Geleneksel CV hazırlama araçlarının aksine, kullanıcıların girdikleri basit ve ham iş tanımlarını (Örn: *"arabalara baktım, satış yaptım"*) işleme alarak büyük dil modelleri aracılığıyla kurumsal ve profesyonel bir dile dönüştürür. Ayrıca, platform bünyesinde barındırdığı ATS Analiz Modülü ile kullanıcıların mevcut özgeçmiş metinlerini tarayarak eksik anahtar kelimeleri ve iyileştirme önerilerini kategorize eder.

---

### 2. KULLANILAN TEKNOLOJİLER VE SEÇİM NEDENLERİ

* **Backend (Arka Uç): Flask (Python):** Hafif, esnek ve modüler yapısı sayesinde hızlı API prototipleme imkanı sunması; Python ekosistemindeki yapay zeka kütüphaneleri ve Google Gemini SDK'sı ile kusursuz entegrasyon sağlaması nedeniyle tercih edilmiştir.
* **Frontend (Ön Uç): Vanilla HTML5, CSS3, JavaScript:** Dönem projesinin zaman kısıtları ve modern JS framework'lerinin (React, Vue vb.) getireceği ek öğrenme eğrisinin önüne geçmek adına saf web teknolojileri kullanılmıştır. Arayüzde estetik ve modern bir görünüm için cammorfizm (glassmorphism) efektleri ve pastel tonlar tercih edilmiştir.
* **Veritabanı: SQLite & Flask-SQLAlchemy:** Projenin taşınabilirliğini kolaylaştırmak ve ilişkisel veri modellerini (One-to-Many) ORM (Object-Relational Mapping) mimarisiyle güvenli şekilde yönetmek amacıyla seçilmiştir.
* **Yapay Zeka Entegrasyonu: Google Gemini 3 Pro API:** Kullanıcı metinlerinin anlamsal analizi, profesyonel dile dönüştürülmesi (re-writing) ve ATS puanlaması süreçlerinde yüksek doğruluk ve düşük gecikme süresi sunduğu için tercih edilmiştir.
* **Veri Görselleştirme: Chart.js:** Kullanıcı panelinde (Dashboard) CV'lerin doluluk oranlarını ve metinsel analiz sonuçlarını dinamik, görsel grafiklere dönüştürmek için entegre edilmiştir.
* **Kapsülleme ve Dağıtım: Docker:** Uygulamanın farklı çalışma ortamlarında "çevresel bağımlılık" hatası (dependency hell) yaşanmadan, bağımsız ve izole bir şekilde ayağa kaldırılabilmesi amacıyla Dockerize edilmiştir.

---

### 3. SİSTEM MİMARİSİ VE VERİTABANI MODELİ

Proje, genişleyebilirliği ve bakım kolaylığını artırmak adına **Flask Blueprint** mimarisi üzerine kurulmuştur. Proje ana yapısı backend ve frontend olarak iki ana modüle ayrılmıştır:

* `auth.py`: Kullanıcı kayıt, giriş ve güvenli şifre yenileme işlemlerini yönetir. Şifreler veritabanına doğrudan yazılmayıp `bcrypt` algoritması ile hashlendikten sonra saklanır. Seans yönetimi `Flask-JWT-Extended` ile token tabanlı yürütülür.
* `cv.py` & `models.py`: Kullanıcıların özgeçmiş verilerini saklayan ve yöneten rotaları içerir.

#### Veritabanı İlişkisel Şeması (ORM)
* **User Tablosu:** Kullanıcı kimlik bilgileri, hashlid şifre, dil seçeneği ve profil resmi (avatar) verilerini tutar.
* **CV_Profile Tablosu:** `User` tablosuna yabancı anahtar (ForeignKey) ile bağlıdır (One-to-Many). Kişisel bilgileri ve şablon tercihlerini saklar.
* **Experience & Education Tabloları:** `CV_Profile` tablosuna bağlı alt bileşenlerdir. Kullanıcının birden fazla iş deneyimi ve eğitim geçmişi girmesine olanak tanır.

---

### 4. GELİŞTİRİLEN ANA MODÜLLER VE ÖZELLİKLER

#### A. Kullanıcı Kimlik Doğrulama ve Güvenlik (Auth & OTP)
Kullanıcı güvenliği için standart JWT tabanlı oturum mekanizmasına ek olarak, şifre unutma senaryolarına yönelik **OTP (One-Time Password)** sistemi entegre edilmiştir. Kullanıcının kayıtlı e-posta adresine `email_service.py` üzerinden zamana duyarlı, tek kullanımlık bir kod gönderilir. Hassas e-posta sunucu şifreleri ve gizli anahtarlar (Secret Keys) proje içinde doğrudan kod satırında tutulmamış, `.env` (Environment Variables) dosyasında maskelenmiştir.

#### B. Yapay Zeka Destekli Metin Optimizasyon Modülü
Kullanıcıların iş deneyimlerine yazdıkları teknik ya da kurumsal olmayan ifadeler, arka uçta Google Gemini API'ye yapılandırılmış özel bir "system prompt" ile beslenir. API'den gelen yanıt, veritabanına kaydedilir ve eş zamanlı olarak ön yüze aktarılır. Çok uzun veri girişlerinde sistemin kilitlenmesini önlemek amacıyla ön uçta karakter sınırı uygulanmış, arka uçta ise veri parçalama (text-chunking) mantığı işletilmiştir.

#### C. ATS (Aday Takip Sistemi) Uyumluluk Analizi
Kullanıcıların harici olarak sisteme yapıştırdıkları metin blokları veya mevcut CV içerikleri yapay zeka tarafından taranır. Metin, İK standartlarına göre analiz edilerek; eksik anahtar kelimeler, sektörel terimler ve yazım dili puanlanır. Çıkan sonuçlar kullanıcı arayüzünde "Güçlü", "Geliştirilmeli" ve "Kritik Eksik" olmak üzere 3 farklı pastel renk kodlu CSS kart yapısıyla görselleştirilir.

#### D. Dinamik Veri Paneli (User Dashboard)
Kullanıcıların dashboard ekranında oluşturdukları CV şablonlarının doluluk yüzdeleri ve kategorik eksiklikleri gösterilir. Chart.js veritabanından gelen metinsel statüleri (Örn: Eğitim="Lisans") JavaScript katmanında sayısal ağırlıklara dönüştüren özel bir eşleştirme (mapping) algoritması ile işler ve dinamik grafikler halinde kullanıcıya sunar.

---

### 5. KARŞILAŞILAN TEKNİK ZORLUKLAR VE ÇÖZÜMLERİ

1. **Çevresel Bağımlılık ve venv Hataları:** Projenin ilk fazlarında yerel kütüphanelerin Flask ile çakışması ve sanal ortamın tetiklenmemesi sorunu yaşanmıştır. Terminal üzerinde `venv\Scripts\activate` komutu yürütülerek ve bağımlılık matrisi netleştirilerek sorun çözülmüştür.
2. **Unicode ve Konsol Log Kilitlenmeleri:** Veritabanı migrasyon süreçlerinde ve Türkçe karakter çıktılarında terminal arayüzünün kilitlendiği gözlemlenmiştir. `app.py` kök dosyasına `sys.stdout` UTF-8 kodlama direktifi eklenerek bu sorun aşılmıştır.
3. **Statik Dosya Erişim Hatası (404 Not Found):** Live Server ve Flask yerel sunucusu arasında geçiş yaparken CSS/JS yollarının kök dizine göre yanlış çözümlendiği (`/css/...`) tespit edilmiştir. İlgili bağlantılar dinamik yerel dizin yapısına (`css/...`) çekilerek ve şablonlarda Jinja2 `url_for` kullanımı standartlaştırılarak çözüme kavuşturulmuştur.
4. **Yapay Zeka ve Ön Uç Senkronizasyonu:** Profil sayfasında avatar yükleme sistemi arka uçta veritabanına başarıyla yazılmasına rağmen ön uçta anlık UI (Navbar) güncellenmesinde asenkron kopukluklar yaşanmıştır. Ön uçtaki DOM manipülasyon kodları revize edilmiş, eski ilk harf alan JS mantığı temizlenerek `api.js` içerisindeki `initNavbar` fonksiyonu güncel resmi dinamik çekecek şekilde baştan yazılmıştır.

---

### 6. SONUÇ VE KAZANIMLAR
Bu proje kapsamında;
* Monolitik bir Flask uygulamasının Blueprint yapısıyla nasıl ölçeklenebilir ve temiz bir mimariye dönüştürüleceği deneyimlenmiştir.
* Üçüncü parti yapay zeka API'lerinin (Google Gemini) asenkron bir web mimarisine güvenli ve optimize şekilde nasıl entegre edileceği öğrenilmiştir.
* Yapay zeka araçlarının kod üretim kapasitesi aktif olarak kullanılmış; ancak yapay zekanın özellikle dinamik ön uç (UI) detaylarında veya durum güncellemelerinde hata yapabileceği, bu nedenle yazılım geliştirme sürecinde nihai denetleyici ve mimari karar verici olarak **insan faktörünün (geliştirici rolünün)** kritik öneme sahip olduğu bizzat deneyimlenmiştir.

Proje, Docker kapsayıcısı dahilinde tüm test senaryolarından başarıyla geçmiş olup, teslime eksiksiz ve kararlı bir biçimde hazırdır.
