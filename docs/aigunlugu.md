# CV Builder AI — Geliştirme Günlüğü (AI Günlüğü)

Bu günlük, Flask ile web uygulaması geliştirme dönem projesi kapsamında Yapay Zeka (AI) aracı ile yapılan çalışma oturumlarını belgelemektedir. Toplamda 8 oturum kaydedilmiştir.

---

## Oturum 1- 29 Mayıs 2026 — 14:00 - 15:30

### Hedef
Projenin ana yapısını oluşturmak ve GitHub'da saklanabilir hale getirmek.

### Kullandığım Mod ve Model
* **Mod:** Plan / Hızlı
* **Model:** Gemini 3 Pro (Editör / Yönetici)

### Verilen Promptlar
> "Yapay zeka destekli, kullanıcıların dinamik olarak CV oluşturabileceği, şablon seçip bilgilerini kaydedebileceği bir CV oluşturma sitesi yapıyorum. Bu proje için Flask ile nasıl bir klasör yapısı kurmalıyım? GitHub için mantıksal bir `.gitignore` ve `README.md` taslağı oluştur."

### Ajanın Önerdiği Plan
Ajan, `backend` ve `frontend` olmak üzere projeyi iki ana klasöre ayırmayı önerdi. Arka uç tarafında Flask Blueprint yapısını kullanarak `routes`, `models` ve `services` klasörlerini oluşturmayı tavsiye etti.

### Plan'da Sorgulamam
İnternetteki popüler örneklerden yola çıkarak ön uç için React kullanmayı önerdi ancak ben *"Vanilla HTML/CSS/JS (çerçeve yok) kullanmak istiyorum"* diyerek karşı çıktım; çünkü öğrenme eğrisi dönem projesi süresi için çok uzundu.

### Üretilen Kodda Düzelttiklerim
`app.py` oluşturulurken yapay zeka veri tabanını varsayılan olarak `app.db` şeklinde yapılandırmıştı. Proje bütünlüğü ve isimlendirme standartları için bunu `cvbuilder.db` olarak değiştirdim.

### Karşılaştığım Hatalar ve Çözümler
* **Hata:** İlk aşamada sanal ortam (venv) aktifleşmediği için Flask modülü bulunamadı hatası oluştu.
* **Çözüm:** Terminalde `venv\Scripts\activate` çalıştırarak sanal ortamı aktifleştirdim ve bağımlılıkları yükledim.

### Bu Oturumdan Öğrendiğim
AI, projenin büyüklüğüne göre başlangıçta sağlam bir mimari (Blueprint) kurulumu yapmanın uzun vadede kod karmaşasını nasıl önlediğini gösterdi.

---

## Oturum 2- 29 Mayıs 2026 — 16:00 - 18:00

### Hedef
Veritabanı modellerini oluşturmak ve Flask-SQLAlchemy kurulumunu tamamlamak.

### Kullandığım Mod ve Model
* **Mod:** Plan
* **Model:** Gemini 3 Pro (Editör)

### Verilen Promptlar
> "Kullanıcı kayıt bilgilerini, kişisel bilgileri, eğitim, iş deneyimi ve yetenekler gibi CV bileşenlerini ilişkisel olarak saklayacak veri tabanı modellerini yaz (SQLAlchemy kullanarak)."

### Ajanın Önerdiği Plan
Ajan; `User`, `CV_Profile`, `Experience` ve `Education` olmak üzere birbiriyle ilişkili (One-to-Many) tablolar önerdi. `User` tablosunda üyelik ve dil tercihini, diğer tablolarda ise CV içeriğini yabancı anahtarlarla (ForeignKey) bağlamayı planladı.

### Karşılaştığım Hatalar ve Çözümler
* **Hata:** Terminalde veritabanı migrasyonu yaparken Türkçe karakterler ve loglama esnasında Unicode hatası (konsolun kilitlenmesi) aldım.
* **Çözüm:** Yapay zekanın yönlendirmesiyle `app.py` içerisine `sys.stdout` için UTF-8 kodlaması ekleyerek karakter hatalarını aştım.

---

## Oturum 3- 29 Mayıs 2026 — 20:00 - 22:30

### Hedef
Sisteme giriş/çıkış ve OTP kodlu şifre sıfırlama mekanizmasını entegre etmek.

### Kullandığım Mod ve Model
* **Mod:** Hızlı
* **Model:** Gemini 3 Pro (Editör)

### Verilen Promptlar
> "Flask-JWT-Extended kullanarak `/login` ve `/register` rotaları oluşturun. Kullanıcı şifresini unuttuysa mailine güvenli bir OTP kodu gitsin."

### Ajanın Önerdiği Plan
Ajan, `auth.py` route'unu oluşturup şifrelerin `bcrypt` ile hashlendiği güvenli bir sistem tasarladı. E-posta gönderimi için soyutlanmış ayrı bir `email_service.py` modülü yazdı.

### Üretilen Kodda Düzelttiklerim
E-posta servisinin çalışabilmesi için Google hesabı üzerinden "Uygulama Şifresi" (App Password) ürettim ve bu hassas verileri doğrudan koda yazmak yerine `.env` dosyasına gizleyerek güvenliği sağladım.

---

## Oturum 4 — 30 Mayıs 2026 — 10:00 - 12:00

### Hedef
Ana sayfa tasarımını oluşturmak ve UI/UX kararlarını netleştirmek.

### Kullandığım Mod ve Model
* **Mod:** Hızlı
* **Model:** Gemini 3 Pro (Editör)

### Verilen Promptlar
> "Tema profesyonel ve modern olsun; koyu lacivert, soft mavi ve beyaz renk seçenekleri barındırsın. Modern, temiz ve cammorfizm (glassmorphism) detaylı bir CV karşılama ve yönetim ana sayfası (index.html) tasarla."

### Karşılaştığım Hatalar ve Çözümler
* **Hata:** Sayfa Live Server'da açıldığında statik CSS dosyası bir türlü yüklenemiyordu (404 Not Found).
* **Çözüm:** Dosya yolları (href) kök dizine göre `/css/main.css` yazılmıştı. Flask'ın dinamik yapısına ve yerel dizine uygun olacak şekilde `css/main.css` (veya Jinja2 şablon motoruna uygun `url_for`) biçimine dönüştürerek düzelttim.

---

## Oturum 5 — 30 Mayıs 2026 — 13:00 - 15:30

### Hedef
Google Gemini API kullanarak kullanıcının girdiği taslak metinleri profesyonel CV diline dönüştüren yapay zeka optimizasyonunu entegre etmek.

### Kullandığım Mod ve Model
* **Mod:** Plan
* **Model:** Gemini 3 Pro (Yönetici)

### Verilen Promptlar
> "Kullanıcı iş deneyimi açıklamalarını (örn: 'arabalara baktım, satış yaptım') basitçe girdiğinde, bunu Gemini API'ye gönderip profesyonel bir İK diline ('Satış operasyonlarını yönettim ve müşteri portföyünü genişlettim') dönüştüren yapay zeka servisini yaz."

### Karşılaştığım Hatalar ve Çözümler
* **Hata:** Kullanıcı çok uzun metinler veya tüm CV'yi tek seferde göndermeye çalıştığında API tarafında "Payload Too Large" veya istek zaman aşımı hatası alındı.
* **Çözüm:** Ön uç tarafında metin gönderilmeden önce karakter sınırlandırması getirdim ve arka uçta veriyi text-chunk (parçalara ayırma) mantığıyla optimize ederek API'ye gönderdim.

---

## Oturum 6 — 30 Mayıs 2026 — 15:00 - 17:30

### Hedef
Kullanıcının mevcut CV'sini veya LinkedIn metin dökümünü kopyalayıp yapıştırdığında eksik bileşenleri analiz eden ATS (Aday Takip Sistemi) uyumluluk modülünü yapmak.

### Kullandığım Mod ve Model
* **Mod:** Hızlı
* **Model:** Gemini 3 Pro (Editör)

### Verilen Promptlar
> "İçerik ve ATS analiz sayfası yap. Kullanıcı CV içeriğini yapıştıracak, sistem yapay zeka ile tarama yapıp eksik anahtar kelimeleri ve puanı 'Güçlü, Geliştirilmeli, Kritik Eksik' olarak kategorize edecek."

### Üretilen Kodda Düzelttiklerim
Yapay zekanın ürettiği puanlama bölümündeki CSS kartlarında kullanılan arka plan degrade renklerini (kırmızı, yeşil vb.) projemizin kurumsal ve modern pastel tonlarına (soft mavi, soft kırmızı) daha uygun olacak şekilde manuel olarak güncelledim.

---

## Oturum 7 — 31 Mayıs 2026 — 19:00 - 20:30

### Hedef
Kullanıcı panelindeki (Dashboard) CV görüntülenme/indirilme grafiklerini entegre etmek ve özel hata sayfalarını (404 vb.) oluşturmak.

### Kullandığım Mod ve Model
* **Mod:** Hızlı
* **Model:** Gemini 3 Pro (Editör)

### Verilen Promptlar
> "Chart.js kullanarak kullanıcının oluşturduğu farklı CV şablonlarının doluluk oranını ve eksik alanların yüzdesini gösteren dinamik bir grafik yap. Ayrıca sistemde olmayan bir sayfaya gidildiğinde şık bir 404 hata sayfası tasarla."

### Plan'da Sorgulamam
Grafikteki değerlerin doğrudan sayısal olmadığını, örneğin eğitim durumu gibi kategorik verilerin ("Lisans", "Yüksek Lisans") nasıl çizdirileceğini yapay zekaya sordum. Ajan, JavaScript tarafında bu metinsel verileri sayısal ağırlıklara dönüştüren bir eşleştirme (mapping) mantığı sundu ve grafik başarıyla oturtuldu.

---

## Oturum 8 — 31 Mayıs 2026 — 16:00 - 18:30

### Hedef
Yapay zeka kodundaki ön uç senkronizasyon hatasının düzeltilmesi, Profil/Dashboard sayfasının tamamlanması ve projenin Dockerize edilerek teslime hazır hale getirilmesi.

### Kullandığım Mod ve Model
* **Mod:** Hızlı
* **Model:** Gemini 3 Pro (Editör)

### Verilen Promptlar
> "Kullanıcı profil sayfası tasarla ve profil fotoğrafı/avatar yükleme sistemi kur."

> *(Hata Müdahale Promptu):* "Profil fotoğrafı başarıyla yükleniyor ve veri tabanına kaydediliyor ancak `api.js` dosyasındaki menü tetikleme kodlarını eksik yazmışsın. Navbar'da hala kullanıcının isminin baş harfi çıkıyor, yeni yüklenen resim görünmüyor. Sadece ilk harfi alan eski JS kodunu sil; eğer kullanıcının güncel bir avatarı varsa sağ üstte profil resmi olarak görüntülenecek şekilde `initNavbar` fonksiyonunu baştan yaz."

### Üretilen Kodda Düzelttiklerim / Ajanı Yönlendirmem
Ajan, avatar yükleme mantığını arka uçta (Flask) kusursuz kurmasına rağmen, ön uçtaki DOM manipülasyonunu ve anlık UI güncellemesini atlamıştı. Benim bu net uyarım ve yönlendirmem üzerine hatasını fark edip `api.js` kodlarını doğru şekilde yeniden yapılandırdı. Bu sayede sadece kopyala-yapıştır yapmadığımı, kodun çalışma mantığına tamamen hakim olup yapay zekayı bir denetleyici (reviewer) gibi yönlendirebildiğimi test etmiş oldum.

### Bu Oturumdan Öğrendiğim
Yapay zekanın veri işleme ve arka uç (API, DB) mimarisinde çok kararlı kodlar yazsa da, bazen dinamik ön uç detaylarını (UI anlık güncellemelerini) gözden kaçırabildiği görüldü. Yazılım geliştirme sürecinde son kontrolün ve mimari yönlendirmenin her zaman geliştirici olarak bende olması gerektiği gerçeğini deneyimledim.

---

**Sonuç:** Proje başarıyla tamamlanmış, tüm backend rotaları ve dinamik Vanilla JS arayüzü entegre çalışır şekilde yayına/teslime hazır hale getirilmiştir.
