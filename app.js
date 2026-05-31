// ----------------------------------------------------
// LOCAL DATABASE LAYER (localStorage Mock Database)
// ----------------------------------------------------
const DB = {
  getUsers: () => JSON.parse(localStorage.getItem('cv_users')) || [],
  saveUsers: (users) => localStorage.setItem('cv_users', JSON.stringify(users)),
  
  getCvs: () => JSON.parse(localStorage.getItem('cv_cvs')) || [],
  saveCvs: (cvs) => localStorage.setItem('cv_cvs', JSON.stringify(cvs)),
  
  getCurrentSession: () => JSON.parse(sessionStorage.getItem('cv_session')) || null,
  saveSession: (user) => sessionStorage.setItem('cv_session', JSON.stringify(user)),
  clearSession: () => sessionStorage.removeItem('cv_session'),

  initMockData: () => {
    // Generate some starter data if database is empty
    if (DB.getUsers().length === 0) {
      const demoUser = {
        id: 'demo-user-123',
        email: 'ahmet@example.com',
        name: 'Ahmet Yılmaz',
        password: 'password123', // plain text for simplicity in mock db
        title: 'Senior Frontend Developer',
        avatarUrl: ''
      };
      DB.saveUsers([demoUser]);

      const demoCv = {
        id: 'demo-cv-123',
        userId: 'demo-user-123',
        title: 'Yazılım Geliştirici CV - 2026',
        language: 'tr',
        template: 'modern',
        isPublic: true,
        shareId: 'ahmetyilmaz',
        personalInfo: {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          title: 'Kıdemli Arayüz Geliştirici',
          email: 'ahmet@example.com',
          phone: '+90 555 123 4567',
          website: 'ahmetyilmaz.dev',
          address: 'Kadıköy, İstanbul',
          avatar: '',
          github: 'github.com/ahmetyilmaz',
          linkedin: 'linkedin.com/in/ahmetyilmaz'
        },
        about: 'Kullanıcı dostu, erişilebilir ve yüksek performanslı web uygulamaları geliştirme konusunda 5+ yıl deneyimli Frontend Geliştirici. React.js, modern JavaScript (ES6+), CSS/HTML ve responsive web tasarımı konularında derin bilgi sahibiyim. Agile metodolojilerle çalışmayı ve sürekli yeni teknolojiler öğrenmeyi seviyorum.',
        experience: [
          {
            id: 'exp-1',
            role: 'Kıdemli Arayüz Geliştirici',
            company: 'TechSoft A.Ş.',
            dates: '2023 - Hâlâ',
            desc: 'React ve Next.js tabanlı SaaS uygulamalarının frontend mimarisini tasarladım. Web performansını %35 artıracak optimizasyon çalışmaları yaptım. 5 kişilik junior ekibe mentörlük verdim.'
          },
          {
            id: 'exp-2',
            role: 'Yazılım Geliştirici',
            company: 'Piksel Agency',
            dates: '2021 - 2023',
            desc: 'Müşteri odaklı e-ticaret siteleri ve kurumsal web arayüzleri geliştirdim. Vanilla JavaScript ve CSS grid/flexbox ile responsive tasarımlar kodladım. REST API entegrasyonlarını gerçekleştirdim.'
          }
        ],
        education: [
          {
            id: 'edu-1',
            school: 'İstanbul Teknik Üniversitesi',
            degree: 'Bilgisayar Mühendisliği (Lisans)',
            year: '2020'
          }
        ],
        skills: [
          { id: 'sk-1', name: 'JavaScript (ES6+)', level: 5 },
          { id: 'sk-2', name: 'React.js / Next.js', level: 5 },
          { id: 'sk-3', name: 'CSS Grid & Flexbox', level: 5 },
          { id: 'sk-4', name: 'TypeScript', level: 4 },
          { id: 'sk-5', name: 'Git & GitHub', level: 4 }
        ],
        projects: [
          {
            id: 'pr-1',
            name: 'Açık Kaynaklı CV Oluşturucu',
            desc: 'Kullanıcıların tarayıcı üzerinde hızlı ve şık özgeçmişler tasarlayıp PDF indirebildiği açık kaynaklı bir SPA projesi.',
            link: 'github.com/ahmetyilmaz/cvcraft'
          }
        ],
        languages: [
          { id: 'la-1', name: 'Türkçe', level: 'Anadil' },
          { id: 'la-2', name: 'İngilizce', level: 'C1 - İleri Seviye' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      DB.saveCvs([demoCv]);
    }
  }
};

DB.initMockData();

// ----------------------------------------------------
// STATE & CONSTANTS
// ----------------------------------------------------
let state = {
  currentUser: DB.getCurrentSession(),
  currentCv: null,
  activeWizardStep: 1,
  sharingOpen: false
};

// ----------------------------------------------------
// ROUTER & NAVIGATION
// ----------------------------------------------------
function router() {
  const hash = window.location.hash || '#landing';
  
  // Close open dialogs/share panels on route changes
  closeSharePanel();
  closeAIModal();
  
  // Hide all pages
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
  });

  // Handle Share Link routing (matches: #share/xxxx)
  if (hash.startsWith('#share/')) {
    const shareId = hash.split('/')[1];
    loadSharedCV(shareId);
    return;
  }

  // Routing Map
  switch (hash) {
    case '#landing':
      renderPage('page-landing');
      break;
    case '#login':
      if (state.currentUser) {
        window.location.hash = '#dashboard';
      } else {
        renderPage('page-login');
      }
      break;
    case '#register':
      renderPage('page-register');
      break;
    case '#forgot-password':
      renderPage('page-forgot-password');
      break;
    case '#dashboard':
      if (!state.currentUser) {
        showToast('Bu sayfayı görüntülemek için giriş yapmalısınız.', 'error');
        window.location.hash = '#login';
      } else {
        renderPage('page-dashboard');
        loadDashboard();
      }
      break;
    case '#builder':
      if (!state.currentUser) {
        showToast('Bu sayfayı görüntülemek için giriş yapmalısınız.', 'error');
        window.location.hash = '#login';
      } else if (!state.currentCv) {
        // If they click refresh or type #builder directly, go to dashboard
        window.location.hash = '#dashboard';
      } else {
        renderPage('page-builder');
        loadBuilder();
      }
      break;
    default:
      renderPage('page-404');
      break;
  }

  updateHeaderNav();
  lucide.createIcons();
}

function renderPage(pageId) {
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  } else {
    document.getElementById('page-404').classList.add('active');
  }
}

function updateHeaderNav() {
  const nav = document.getElementById('main-nav');
  const hash = window.location.hash || '#landing';

  // If we are in public share mode, completely hide the main header navigation or replace it
  if (hash.startsWith('#share/')) {
    document.querySelector('.main-header').style.display = 'none';
    document.querySelector('.main-footer').style.display = 'none';
    return;
  } else {
    document.querySelector('.main-header').style.display = 'flex';
    document.querySelector('.main-footer').style.display = 'block';
  }

  if (state.currentUser) {
    nav.innerHTML = `
      <a href="#dashboard" class="nav-item ${hash === '#dashboard' ? 'active' : ''}"><i data-lucide="layout-dashboard" class="inline-icon"></i> Panelim</a>
      <span class="nav-user-greet"><i data-lucide="user" class="inline-icon"></i> ${state.currentUser.name}</span>
      <button id="btn-logout" class="btn btn-secondary btn-small">Çıkış Yap</button>
    `;
    document.getElementById('btn-logout').addEventListener('click', logout);
  } else {
    nav.innerHTML = `
      <a href="#landing" class="nav-item ${hash === '#landing' ? 'active' : ''}">Ana Sayfa</a>
      <a href="#login" class="btn btn-secondary btn-small">Giriş Yap</a>
      <a href="#register" class="btn btn-primary btn-small">Üye Ol</a>
    `;
  }
}

// ----------------------------------------------------
// AUTHENTICATION LOGIC
// ----------------------------------------------------

// Register Form Submit
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value;

  const users = DB.getUsers();
  const exists = users.some(u => u.email === email);
  
  if (exists) {
    showToast('Bu e-posta adresiyle kayıtlı bir hesap zaten var.', 'error');
    return;
  }

  const newUser = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    title: '',
    avatarUrl: ''
  };

  users.push(newUser);
  DB.saveUsers(users);
  DB.saveSession(newUser);
  state.currentUser = newUser;
  
  showToast('Kaydınız başarıyla tamamlandı! Hoş geldiniz.', 'success');
  window.location.hash = '#dashboard';
});

// Login Form Submit
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  const users = DB.getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showToast('Hatalı e-posta adresi veya şifre.', 'error');
    return;
  }

  DB.saveSession(user);
  state.currentUser = user;
  
  showToast('Giriş başarılı. Yönlendiriliyorsunuz...', 'success');
  window.location.hash = '#dashboard';
});

// Forgot Password Form Submit
document.getElementById('forgot-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value.trim().toLowerCase();
  const users = DB.getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    showToast('Bu e-posta adresine ait bir kullanıcı bulunamadı.', 'error');
    return;
  }

  // Simulated code dispatch
  showToast(`Sıfırlama doğrulama kodu başarıyla ${email} adresine gönderildi! (Kod: 1907)`, 'success');
  
  // Prompt user for simulated pass restore
  setTimeout(() => {
    const code = prompt('E-postanıza gönderilen 4 haneli doğrulama kodunu girin:');
    if (code === '1907') {
      const newPass = prompt('Yeni şifrenizi girin:');
      if (newPass && newPass.length >= 6) {
        user.password = newPass;
        DB.saveUsers(users);
        showToast('Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.', 'success');
        window.location.hash = '#login';
      } else {
        showToast('Geçersiz şifre girdiniz. En az 6 karakter olmalıdır.', 'error');
      }
    } else {
      showToast('Hatalı doğrulama kodu.', 'error');
    }
  }, 1000);
});

// Profile Update Submit
document.getElementById('profile-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('profile-name').value.trim();
  const title = document.getElementById('profile-title').value.trim();
  const avatarImg = document.getElementById('profile-avatar-preview').src;

  const users = DB.getUsers();
  const index = users.findIndex(u => u.id === state.currentUser.id);

  if (index !== -1) {
    users[index].name = name;
    users[index].title = title;
    users[index].avatarUrl = avatarImg.startsWith('data:') ? avatarImg : users[index].avatarUrl;
    
    DB.saveUsers(users);
    DB.saveSession(users[index]);
    state.currentUser = users[index];
    
    // Update local dashboard representation
    document.getElementById('dash-user-name').innerText = name;
    showToast('Profil bilgileriniz başarıyla güncellendi.', 'success');
    updateHeaderNav();
  }
});

// Profile photo upload trigger
document.getElementById('profile-avatar-input').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      document.getElementById('profile-avatar-preview').src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function logout() {
  DB.clearSession();
  state.currentUser = null;
  state.currentCv = null;
  showToast('Başarıyla çıkış yaptınız. Görüşmek üzere!', 'success');
  window.location.hash = '#landing';
}

// ----------------------------------------------------
// DASHBOARD WORKFLOW
// ----------------------------------------------------
function loadDashboard() {
  document.getElementById('dash-user-name').innerText = state.currentUser.name;
  document.getElementById('profile-name').value = state.currentUser.name;
  document.getElementById('profile-title').value = state.currentUser.title || '';
  
  if (state.currentUser.avatarUrl) {
    document.getElementById('profile-avatar-preview').src = state.currentUser.avatarUrl;
  } else {
    document.getElementById('profile-avatar-preview').src = 'https://via.placeholder.com/150';
  }

  renderCvList();
}

function renderCvList() {
  const cvs = DB.getCvs().filter(c => c.userId === state.currentUser.id);
  const container = document.getElementById('cv-list-container');
  
  if (cvs.length === 0) {
    container.innerHTML = `
      <div class="empty-cv-state">
        <i data-lucide="file-plus"></i>
        <h4>Henüz bir özgeçmiş oluşturmadınız</h4>
        <p>Hemen sağ üstteki butona tıklayarak ilk CV'nizi oluşturmaya başlayın!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = cvs.map(cv => {
    const date = new Date(cv.updatedAt).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    return `
      <div class="cv-card glass-card" id="cv-card-${cv.id}">
        <div class="cv-card-header">
          <div>
            <div class="cv-card-title">${escapeHTML(cv.title)}</div>
            <div class="cv-card-meta">Son Güncelleme: ${date}</div>
          </div>
          <div class="cv-card-icon">
            <i data-lucide="file-text"></i>
          </div>
        </div>
        <div class="cv-card-actions">
          <button class="btn btn-primary btn-small btn-edit-cv" data-id="${cv.id}"><i data-lucide="edit-3"></i> Düzenle</button>
          <button class="btn btn-secondary btn-small btn-icon-only btn-rename-cv" data-id="${cv.id}" title="Yeniden Adlandır"><i data-lucide="type"></i></button>
          <button class="btn btn-secondary btn-small btn-icon-only btn-duplicate-cv" data-id="${cv.id}" title="Kopyasını Oluştur"><i data-lucide="copy"></i></button>
          <button class="btn btn-danger btn-small btn-icon-only btn-delete-cv" data-id="${cv.id}" title="Sil"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();

  // Attach card event listeners
  container.querySelectorAll('.btn-edit-cv').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cvId = e.currentTarget.getAttribute('data-id');
      editCv(cvId);
    });
  });

  container.querySelectorAll('.btn-rename-cv').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cvId = e.currentTarget.getAttribute('data-id');
      renameCv(cvId);
    });
  });

  container.querySelectorAll('.btn-duplicate-cv').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cvId = e.currentTarget.getAttribute('data-id');
      duplicateCv(cvId);
    });
  });

  container.querySelectorAll('.btn-delete-cv').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cvId = e.currentTarget.getAttribute('data-id');
      deleteCv(cvId);
    });
  });
}

// Create New CV Trigger
document.getElementById('btn-create-cv').addEventListener('click', () => {
  const cvs = DB.getCvs();
  const newCv = {
    id: 'cv_' + Math.random().toString(36).substr(2, 9),
    userId: state.currentUser.id,
    title: 'Yeni Özgeçmişim',
    language: 'tr',
    template: 'modern',
    isPublic: false,
    shareId: Math.random().toString(36).substr(2, 8),
    personalInfo: {
      firstName: state.currentUser.name.split(' ')[0] || '',
      lastName: state.currentUser.name.split(' ').slice(1).join(' ') || '',
      title: state.currentUser.title || '',
      email: state.currentUser.email || '',
      phone: '',
      website: '',
      address: '',
      avatar: state.currentUser.avatarUrl || '',
      github: '',
      linkedin: ''
    },
    about: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  cvs.push(newCv);
  DB.saveCvs(cvs);
  state.currentCv = newCv;
  showToast('Özgeçmiş taslağı oluşturuldu.', 'success');
  window.location.hash = '#builder';
});

function editCv(id) {
  const cv = DB.getCvs().find(c => c.id === id);
  if (cv) {
    state.currentCv = cv;
    window.location.hash = '#builder';
  } else {
    showToast('Özgeçmiş bulunamadı.', 'error');
  }
}

function renameCv(id) {
  const cvs = DB.getCvs();
  const cv = cvs.find(c => c.id === id);
  if (!cv) return;

  const newTitle = prompt('Özgeçmiş için yeni bir başlık girin:', cv.title);
  if (newTitle && newTitle.trim()) {
    cv.title = newTitle.trim();
    cv.updatedAt = new Date().toISOString();
    DB.saveCvs(cvs);
    renderCvList();
    showToast('Başlık güncellendi.', 'success');
  }
}

function duplicateCv(id) {
  const cvs = DB.getCvs();
  const cv = cvs.find(c => c.id === id);
  if (!cv) return;

  const duplicated = {
    ...JSON.parse(JSON.stringify(cv)), // deep clone
    id: 'cv_' + Math.random().toString(36).substr(2, 9),
    title: cv.title + ' (Kopya)',
    shareId: Math.random().toString(36).substr(2, 8),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  cvs.push(duplicated);
  DB.saveCvs(cvs);
  renderCvList();
  showToast('Özgeçmiş kopyalandı.', 'success');
}

function deleteCv(id) {
  if (confirm('Bu özgeçmişi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
    let cvs = DB.getCvs();
    cvs = cvs.filter(c => c.id !== id);
    DB.saveCvs(cvs);
    renderCvList();
    showToast('Özgeçmiş başarıyla silindi.', 'success');
  }
}

// ----------------------------------------------------
// BUILDER & WIZARD FORM LOGIC
// ----------------------------------------------------
function loadBuilder() {
  // Sync page header elements
  document.getElementById('cv-title-input').value = state.currentCv.title;
  document.getElementById('cv-lang-select').value = state.currentCv.language || 'tr';
  document.getElementById('cv-template-select').value = state.currentCv.template || 'modern';
  
  // Set up wizard tabs click events
  document.querySelectorAll('.wizard-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const step = parseInt(e.currentTarget.getAttribute('data-step'));
      switchWizardStep(step);
    });
  });

  // Wizard Nav buttons
  document.getElementById('btn-wizard-prev').onclick = () => {
    if (state.activeWizardStep > 1) switchWizardStep(state.activeWizardStep - 1);
  };
  document.getElementById('btn-wizard-next').onclick = () => {
    if (state.activeWizardStep < 7) switchWizardStep(state.activeWizardStep + 1);
  };

  // Bind top editor actions
  document.getElementById('cv-title-input').oninput = (e) => {
    state.currentCv.title = e.target.value;
    autosaveCV();
  };
  
  document.getElementById('cv-lang-select').onchange = (e) => {
    state.currentCv.language = e.target.value;
    autosaveCV();
    renderLivePreview();
  };
  
  document.getElementById('cv-template-select').onchange = (e) => {
    state.currentCv.template = e.target.value;
    // Update preview class
    const printArea = document.getElementById('cv-print-area');
    printArea.className = `a4-page template-${e.target.value}`;
    autosaveCV();
    renderLivePreview();
  };

  // Set up forms fields sync
  syncFormInputsToState();
  
  // Setup Dynamic Add buttons
  document.getElementById('btn-add-experience').onclick = addExperienceItem;
  document.getElementById('btn-add-education').onclick = addEducationItem;
  document.getElementById('btn-add-skill').onclick = addSkillItem;
  document.getElementById('btn-add-project').onclick = addProjectItem;
  document.getElementById('btn-add-language').onclick = addLanguageItem;

  // Render arrays
  renderDynamicExperienceList();
  renderDynamicEducationList();
  renderDynamicSkillsList();
  renderDynamicProjectsList();
  renderDynamicLanguagesList();

  // Render initial A4 preview
  renderLivePreview();
}

function switchWizardStep(stepNum) {
  state.activeWizardStep = stepNum;
  
  // Update Tab buttons
  document.querySelectorAll('.wizard-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-step')) === stepNum) {
      btn.classList.add('active');
    }
  });

  // Update panels
  document.querySelectorAll('.step-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`step-panel-${stepNum}`).classList.add('active');

  // Next / Prev button states
  const prevBtn = document.getElementById('btn-wizard-prev');
  const nextBtn = document.getElementById('btn-wizard-next');

  if (stepNum === 1) {
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.classList.remove('disabled');
  }

  if (stepNum === 7) {
    nextBtn.innerHTML = 'Kariyer Paneli <i data-lucide="check"></i>';
    nextBtn.onclick = () => { window.location.hash = '#dashboard'; };
  } else {
    nextBtn.innerHTML = 'İleri <i data-lucide="chevron-right"></i>';
    nextBtn.onclick = () => { switchWizardStep(state.activeWizardStep + 1); };
  }
  
  lucide.createIcons();
}

// Synchronize simple text/value changes
function syncFormInputsToState() {
  const p = state.currentCv.personalInfo;
  
  // Mapping inputs
  const mapping = {
    'cv-first-name': { obj: p, field: 'firstName' },
    'cv-last-name': { obj: p, field: 'lastName' },
    'cv-personal-title': { obj: p, field: 'title' },
    'cv-email': { obj: p, field: 'email' },
    'cv-phone': { obj: p, field: 'phone' },
    'cv-website': { obj: p, field: 'website' },
    'cv-address': { obj: p, field: 'address' },
    'cv-github': { obj: p, field: 'github' },
    'cv-linkedin': { obj: p, field: 'linkedin' },
    'cv-about': { obj: state.currentCv, field: 'about' }
  };

  for (const [id, target] of Object.entries(mapping)) {
    const input = document.getElementById(id);
    if (input) {
      input.value = target.obj[target.field] || '';
      input.oninput = (e) => {
        target.obj[target.field] = e.target.value;
        autosaveCV();
        renderLivePreview();
      };
    }
  }
}

// Autosave CV changes to localStorage
function autosaveCV() {
  if (!state.currentCv) return;
  
  const cvs = DB.getCvs();
  const idx = cvs.findIndex(c => c.id === state.currentCv.id);
  if (idx !== -1) {
    state.currentCv.updatedAt = new Date().toISOString();
    cvs[idx] = state.currentCv;
    DB.saveCvs(cvs);
  }
}

// ----------------------------------------------------
// WIZARD DYNAMIC ARRAY LISTS
// ----------------------------------------------------

// 1. Job Experience
function renderDynamicExperienceList() {
  const list = document.getElementById('experience-list');
  const items = state.currentCv.experience || [];
  
  if (items.length === 0) {
    list.innerHTML = `<p class="text-muted" style="font-size:0.9rem;">Henüz bir iş deneyimi eklemediniz.</p>`;
    return;
  }

  list.innerHTML = items.map((item, idx) => `
    <div class="list-item-card" data-idx="${idx}">
      <div class="list-item-header">
        <span class="list-item-num">İş Deneyimi #${idx + 1}</span>
        <div class="list-item-controls">
          <button class="btn btn-secondary btn-small btn-icon-only btn-move-up" data-type="experience" data-idx="${idx}"><i data-lucide="arrow-up"></i></button>
          <button class="btn btn-secondary btn-small btn-icon-only btn-move-down" data-type="experience" data-idx="${idx}"><i data-lucide="arrow-down"></i></button>
          <button class="btn btn-danger btn-small btn-icon-only btn-delete-item" data-type="experience" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label>Pozisyon / Unvan</label>
          <input type="text" class="exp-role" value="${escapeHTML(item.role || '')}" placeholder="Örn: Arayüz Geliştirici">
        </div>
        <div class="form-group half">
          <label>Şirket / Kurum</label>
          <input type="text" class="exp-company" value="${escapeHTML(item.company || '')}" placeholder="Örn: Google">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label>Çalışma Dönemi</label>
          <input type="text" class="exp-dates" value="${escapeHTML(item.dates || '')}" placeholder="Örn: 2023 - Hâlâ veya 2021 - 2023">
        </div>
        <div class="form-group half step-header-with-ai">
          <label>Açıklama / Katkılar</label>
          <button type="button" class="btn btn-secondary btn-small btn-ai" data-section="experience" data-idx="${idx}">
            <i data-lucide="sparkles"></i> AI ile Yaz
          </button>
        </div>
      </div>
      <div class="form-group">
        <textarea class="exp-desc" rows="4" placeholder="Gerçekleştirdiğiniz sorumluluklar, kullandığınız teknolojiler...">${escapeHTML(item.desc || '')}</textarea>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
  bindDynamicListChangeEvents('experience', list);
}

function addExperienceItem() {
  state.currentCv.experience = state.currentCv.experience || [];
  state.currentCv.experience.push({
    id: 'exp_' + Math.random().toString(36).substr(2, 9),
    role: '',
    company: '',
    dates: '',
    desc: ''
  });
  autosaveCV();
  renderDynamicExperienceList();
  renderLivePreview();
}

// 2. Education
function renderDynamicEducationList() {
  const list = document.getElementById('education-list');
  const items = state.currentCv.education || [];
  
  if (items.length === 0) {
    list.innerHTML = `<p class="text-muted" style="font-size:0.9rem;">Henüz bir eğitim bilgisi eklemediniz.</p>`;
    return;
  }

  list.innerHTML = items.map((item, idx) => `
    <div class="list-item-card" data-idx="${idx}">
      <div class="list-item-header">
        <span class="list-item-num">Eğitim Bilgisi #${idx + 1}</span>
        <div class="list-item-controls">
          <button class="btn btn-secondary btn-small btn-icon-only btn-move-up" data-type="education" data-idx="${idx}"><i data-lucide="arrow-up"></i></button>
          <button class="btn btn-secondary btn-small btn-icon-only btn-move-down" data-type="education" data-idx="${idx}"><i data-lucide="arrow-down"></i></button>
          <button class="btn btn-danger btn-small btn-icon-only btn-delete-item" data-type="education" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label>Okul / Üniversite Adı</label>
          <input type="text" class="edu-school" value="${escapeHTML(item.school || '')}" placeholder="Örn: Boğaziçi Üniversitesi">
        </div>
        <div class="form-group half">
          <label>Bölüm / Program</label>
          <input type="text" class="edu-degree" value="${escapeHTML(item.degree || '')}" placeholder="Örn: Bilgisayar Mühendisliği (Lisans)">
        </div>
      </div>
      <div class="form-group">
        <label>Mezuniyet Yılı / Dönem</label>
        <input type="text" class="edu-year" value="${escapeHTML(item.year || '')}" placeholder="Örn: 2022 veya 2020 - 2024">
      </div>
    </div>
  `).join('');

  lucide.createIcons();
  bindDynamicListChangeEvents('education', list);
}

function addEducationItem() {
  state.currentCv.education = state.currentCv.education || [];
  state.currentCv.education.push({
    id: 'edu_' + Math.random().toString(36).substr(2, 9),
    school: '',
    degree: '',
    year: ''
  });
  autosaveCV();
  renderDynamicEducationList();
  renderLivePreview();
}

// 3. Skills
function renderDynamicSkillsList() {
  const list = document.getElementById('skills-list');
  const items = state.currentCv.skills || [];
  
  if (items.length === 0) {
    list.innerHTML = `<p class="text-muted" style="font-size:0.9rem; grid-column:1/-1;">Henüz bir yetenek eklemediniz.</p>`;
    return;
  }

  list.innerHTML = items.map((item, idx) => `
    <div class="list-item-card" data-idx="${idx}">
      <div class="list-item-header">
        <span class="list-item-num">Yetenek #${idx + 1}</span>
        <button class="btn btn-danger btn-small btn-icon-only btn-delete-item" data-type="skills" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
      </div>
      <div class="form-group">
        <label>Yetenek Adı</label>
        <input type="text" class="sk-name" value="${escapeHTML(item.name || '')}" placeholder="Örn: React, Problem Çözme">
      </div>
      <div class="form-group">
        <label>Derece (1-5)</label>
        <div class="rating-selector" data-idx="${idx}">
          ${[1,2,3,4,5].map(val => `
            <div class="rating-dot ${item.level >= val ? 'active' : ''}" data-val="${val}"></div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();

  // Bind rating dot triggers
  list.querySelectorAll('.rating-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const parentIdx = parseInt(e.currentTarget.parentElement.getAttribute('data-idx'));
      const val = parseInt(e.currentTarget.getAttribute('data-val'));
      state.currentCv.skills[parentIdx].level = val;
      autosaveCV();
      renderDynamicSkillsList();
      renderLivePreview();
    });
  });

  bindDynamicListChangeEvents('skills', list);
}

function addSkillItem() {
  state.currentCv.skills = state.currentCv.skills || [];
  state.currentCv.skills.push({
    id: 'sk_' + Math.random().toString(36).substr(2, 9),
    name: '',
    level: 3
  });
  autosaveCV();
  renderDynamicSkillsList();
  renderLivePreview();
}

// 4. Projects & Certificates
function renderDynamicProjectsList() {
  const list = document.getElementById('projects-list');
  const items = state.currentCv.projects || [];
  
  if (items.length === 0) {
    list.innerHTML = `<p class="text-muted" style="font-size:0.9rem;">Henüz bir sertifika veya proje eklemediniz.</p>`;
    return;
  }

  list.innerHTML = items.map((item, idx) => `
    <div class="list-item-card" data-idx="${idx}">
      <div class="list-item-header">
        <span class="list-item-num">Sertifika / Proje #${idx + 1}</span>
        <div class="list-item-controls">
          <button class="btn btn-secondary btn-small btn-icon-only btn-move-up" data-type="projects" data-idx="${idx}"><i data-lucide="arrow-up"></i></button>
          <button class="btn btn-secondary btn-small btn-icon-only btn-move-down" data-type="projects" data-idx="${idx}"><i data-lucide="arrow-down"></i></button>
          <button class="btn btn-danger btn-small btn-icon-only btn-delete-item" data-type="projects" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label>Proje / Sertifika Adı</label>
          <input type="text" class="pr-name" value="${escapeHTML(item.name || '')}" placeholder="Örn: AWS Cloud Practitioner veya E-Ticaret Arayüzü">
        </div>
        <div class="form-group half">
          <label>Proje / Belge Linki</label>
          <input type="text" class="pr-link" value="${escapeHTML(item.link || '')}" placeholder="Örn: github.com/kullanici/proje">
        </div>
      </div>
      <div class="form-group">
        <label>Açıklama</label>
        <textarea class="pr-desc" rows="3" placeholder="Proje kapsamında gerçekleştirdiğiniz çalışmalar veya sertifika içeriği...">${escapeHTML(item.desc || '')}</textarea>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
  bindDynamicListChangeEvents('projects', list);
}

function addProjectItem() {
  state.currentCv.projects = state.currentCv.projects || [];
  state.currentCv.projects.push({
    id: 'pr_' + Math.random().toString(36).substr(2, 9),
    name: '',
    desc: '',
    link: ''
  });
  autosaveCV();
  renderDynamicProjectsList();
  renderLivePreview();
}

// 5. Languages
function renderDynamicLanguagesList() {
  const list = document.getElementById('languages-list');
  const items = state.currentCv.languages || [];
  
  if (items.length === 0) {
    list.innerHTML = `<p class="text-muted" style="font-size:0.9rem;">Henüz bir dil eklemediniz.</p>`;
    return;
  }

  list.innerHTML = items.map((item, idx) => `
    <div class="list-item-card" data-idx="${idx}">
      <div class="list-item-header">
        <span class="list-item-num">Dil Bilgisi #${idx + 1}</span>
        <button class="btn btn-danger btn-small btn-icon-only btn-delete-item" data-type="languages" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label>Dil Adı</label>
          <input type="text" class="la-name" value="${escapeHTML(item.name || '')}" placeholder="Örn: İngilizce, Almanca">
        </div>
        <div class="form-group half">
          <label>Yetkinlik Seviyesi</label>
          <input type="text" class="la-level" value="${escapeHTML(item.level || '')}" placeholder="Örn: C1 - İleri veya Anadil">
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
  bindDynamicListChangeEvents('languages', list);
}

function addLanguageItem() {
  state.currentCv.languages = state.currentCv.languages || [];
  state.currentCv.languages.push({
    id: 'la_' + Math.random().toString(36).substr(2, 9),
    name: '',
    level: ''
  });
  autosaveCV();
  renderDynamicLanguagesList();
  renderLivePreview();
}

// Re-use logic to bind dynamic changes to state and handle sorting/deletions
function bindDynamicListChangeEvents(type, parentElement) {
  // Input fields changes
  parentElement.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', (e) => {
      const card = e.currentTarget.closest('.list-item-card');
      const idx = parseInt(card.getAttribute('data-idx'));
      const cls = e.currentTarget.className;
      
      const item = state.currentCv[type][idx];
      
      if (type === 'experience') {
        if (cls === 'exp-role') item.role = e.target.value;
        if (cls === 'exp-company') item.company = e.target.value;
        if (cls === 'exp-dates') item.dates = e.target.value;
        if (cls === 'exp-desc') item.desc = e.target.value;
      } else if (type === 'education') {
        if (cls === 'edu-school') item.school = e.target.value;
        if (cls === 'edu-degree') item.degree = e.target.value;
        if (cls === 'edu-year') item.year = e.target.value;
      } else if (type === 'skills') {
        if (cls === 'sk-name') item.name = e.target.value;
      } else if (type === 'projects') {
        if (cls === 'pr-name') item.name = e.target.value;
        if (cls === 'pr-link') item.link = e.target.value;
        if (cls === 'pr-desc') item.desc = e.target.value;
      } else if (type === 'languages') {
        if (cls === 'la-name') item.name = e.target.value;
        if (cls === 'la-level') item.level = e.target.value;
      }

      autosaveCV();
      renderLivePreview();
    });
  });

  // Action buttons: Delete
  parentElement.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
      state.currentCv[type].splice(idx, 1);
      autosaveCV();
      
      if (type === 'experience') renderDynamicExperienceList();
      if (type === 'education') renderDynamicEducationList();
      if (type === 'skills') renderDynamicSkillsList();
      if (type === 'projects') renderDynamicProjectsList();
      if (type === 'languages') renderDynamicLanguagesList();
      
      renderLivePreview();
      showToast('Öğe listeden kaldırıldı.', 'success');
    });
  });

  // Action buttons: Move Up/Down (Sorting)
  parentElement.querySelectorAll('.btn-move-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
      if (idx > 0) {
        const arr = state.currentCv[type];
        const temp = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = temp;
        autosaveCV();
        
        if (type === 'experience') renderDynamicExperienceList();
        if (type === 'education') renderDynamicEducationList();
        if (type === 'projects') renderDynamicProjectsList();
        
        renderLivePreview();
      }
    });
  });

  parentElement.querySelectorAll('.btn-move-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
      const arr = state.currentCv[type];
      if (idx < arr.length - 1) {
        const temp = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = temp;
        autosaveCV();
        
        if (type === 'experience') renderDynamicExperienceList();
        if (type === 'education') renderDynamicEducationList();
        if (type === 'projects') renderDynamicProjectsList();
        
        renderLivePreview();
      }
    });
  });

  // Attach AI helper buttons inside dynamic card
  parentElement.querySelectorAll('.btn-ai').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sec = e.currentTarget.getAttribute('data-section');
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
      openAIModal(sec, idx);
    });
  });
}

// Attach AI click on Hakkımda section (static step button)
document.querySelectorAll('#step-panel-2 .btn-ai').forEach(btn => {
  btn.onclick = () => { openAIModal('about'); };
});

// ----------------------------------------------------
// LIVE PREVIEW & TEMPLATE RENDERER ENGINE
// ----------------------------------------------------
function renderLivePreview() {
  const cv = state.currentCv;
  const container = document.getElementById('cv-print-area');
  
  if (!cv) return;

  container.innerHTML = generateCVHTML(cv);
  lucide.createIcons();
}

function generateCVHTML(cv) {
  const isEn = cv.language === 'en';
  const p = cv.personalInfo;
  
  // Section headers localization
  const langKeys = {
    about: isEn ? 'Profile Summary' : 'Hakkımda / Profil',
    experience: isEn ? 'Work Experience' : 'İş Deneyimi',
    education: isEn ? 'Education' : 'Eğitim Bilgileri',
    skills: isEn ? 'Technical Skills' : 'Yetenekler',
    projects: isEn ? 'Projects & Certificates' : 'Projeler ve Sertifikalar',
    languages: isEn ? 'Languages' : 'Yabancı Diller'
  };

  const name = `${escapeHTML(p.firstName || '')} ${escapeHTML(p.lastName || '')}`;
  const title = escapeHTML(p.title || '');
  const about = escapeHTML(cv.about || '');

  // Render Experiences
  let expHTML = '';
  if (cv.experience && cv.experience.length > 0) {
    expHTML = cv.experience.map(item => `
      <div class="entry-item">
        <div class="entry-header">
          <span>${escapeHTML(item.role)}</span>
          <span>${escapeHTML(item.dates)}</span>
        </div>
        <div class="entry-subheader">
          <span>${escapeHTML(item.company)}</span>
        </div>
        ${item.desc ? `<div class="entry-desc">${escapeHTML(item.desc).replace(/\n/g, '<br>')}</div>` : ''}
      </div>
    `).join('');
  }

  // Render Educations
  let eduHTML = '';
  if (cv.education && cv.education.length > 0) {
    eduHTML = cv.education.map(item => `
      <div class="entry-item">
        <div class="entry-header">
          <span>${escapeHTML(item.school)}</span>
          <span>${escapeHTML(item.year)}</span>
        </div>
        <div class="entry-subheader">
          <span>${escapeHTML(item.degree)}</span>
        </div>
      </div>
    `).join('');
  }

  // Render Projects
  let projectsHTML = '';
  if (cv.projects && cv.projects.length > 0) {
    projectsHTML = cv.projects.map(item => `
      <div class="entry-item">
        <div class="entry-header">
          <span>${escapeHTML(item.name)}</span>
          ${item.link ? `<span style="font-size:0.8rem; font-weight:normal; font-family:var(--font-mono);">${escapeHTML(item.link)}</span>` : ''}
        </div>
        ${item.desc ? `<div class="entry-desc">${escapeHTML(item.desc).replace(/\n/g, '<br>')}</div>` : ''}
      </div>
    `).join('');
  }

  // Render Avatar Image tag
  const avatarUrl = p.avatar || state.currentUser?.avatarUrl || 'https://via.placeholder.com/150';

  // Return HTML structure based on template styling
  if (cv.template === 'corporate') {
    // ------------------------------------
    // CORPORATE TEMPLATE RENDER
    // ------------------------------------
    let skillsHTML = '';
    if (cv.skills && cv.skills.length > 0) {
      skillsHTML = `
        <div class="section-title">${langKeys.skills}</div>
        <div class="skills-grid">
          ${cv.skills.map(sk => `
            <div class="skill-item">
              <span class="skill-bullet"></span>
              <span>${escapeHTML(sk.name)} (${sk.level}/5)</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    let langsHTML = '';
    if (cv.languages && cv.languages.length > 0) {
      langsHTML = `
        <div class="section-title" style="margin-top:15px;">${langKeys.languages}</div>
        <div class="skills-grid">
          ${cv.languages.map(la => `
            <div class="skill-item">
              <span class="skill-bullet" style="background-color:#7f8c8d;"></span>
              <span><strong>${escapeHTML(la.name)}:</strong> ${escapeHTML(la.level)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="template-corporate">
        <h1>${name}</h1>
        ${title ? `<div class="job-title">${title}</div>` : ''}
        
        <div class="contact-horizontal">
          ${p.email ? `<span><i data-lucide="mail"></i> ${escapeHTML(p.email)}</span>` : ''}
          ${p.phone ? `<span><i data-lucide="phone"></i> ${escapeHTML(p.phone)}</span>` : ''}
          ${p.website ? `<span><i data-lucide="globe"></i> ${escapeHTML(p.website)}</span>` : ''}
          ${p.address ? `<span><i data-lucide="map-pin"></i> ${escapeHTML(p.address)}</span>` : ''}
          ${p.github ? `<span><i data-lucide="github"></i> ${escapeHTML(p.github)}</span>` : ''}
          ${p.linkedin ? `<span><i data-lucide="linkedin"></i> ${escapeHTML(p.linkedin)}</span>` : ''}
        </div>

        ${about ? `
          <div class="section-title">${langKeys.about}</div>
          <div class="about-text">${about}</div>
        ` : ''}

        ${expHTML ? `
          <div class="section-title" style="margin-top:15px;">${langKeys.experience}</div>
          ${expHTML}
        ` : ''}

        ${eduHTML ? `
          <div class="section-title" style="margin-top:15px;">${langKeys.education}</div>
          ${eduHTML}
        ` : ''}

        ${projectsHTML ? `
          <div class="section-title" style="margin-top:15px;">${langKeys.projects}</div>
          ${projectsHTML}
        ` : ''}

        ${skillsHTML}
        ${langsHTML}
      </div>
    `;

  } else if (cv.template === 'creative') {
    // ------------------------------------
    // CREATIVE TEMPLATE RENDER
    // ------------------------------------
    let contactItemsHTML = `
      ${p.email ? `<div class="contact-item"><i data-lucide="mail"></i> ${escapeHTML(p.email)}</div>` : ''}
      ${p.phone ? `<div class="contact-item"><i data-lucide="phone"></i> ${escapeHTML(p.phone)}</div>` : ''}
      ${p.website ? `<div class="contact-item"><i data-lucide="globe"></i> ${escapeHTML(p.website)}</div>` : ''}
      ${p.address ? `<div class="contact-item"><i data-lucide="map-pin"></i> ${escapeHTML(p.address)}</div>` : ''}
      ${p.github ? `<div class="contact-item"><i data-lucide="github"></i> ${escapeHTML(p.github)}</div>` : ''}
      ${p.linkedin ? `<div class="contact-item"><i data-lucide="linkedin"></i> ${escapeHTML(p.linkedin)}</div>` : ''}
    `;

    let skillsHTML = '';
    if (cv.skills && cv.skills.length > 0) {
      skillsHTML = `
        <div class="section-title">${langKeys.skills}</div>
        <div>
          ${cv.skills.map(sk => `
            <div class="skill-progress-item">
              <div class="skill-info">
                <span>${escapeHTML(sk.name)}</span>
                <span>${sk.level * 20}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${sk.level * 20}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    let langsHTML = '';
    if (cv.languages && cv.languages.length > 0) {
      langsHTML = `
        <div class="section-title">${langKeys.languages}</div>
        <div class="skills-tag-list">
          ${cv.languages.map(la => `
            <span class="skill-tag">${escapeHTML(la.name)} - ${escapeHTML(la.level)}</span>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="template-creative">
        <div class="header-block">
          <div class="header-content">
            <div class="avatar-creative">
              <img src="${avatarUrl}" alt="Avatar">
            </div>
            <div>
              <h1>${name}</h1>
              ${title ? `<div class="job-title">${title}</div>` : ''}
            </div>
          </div>
        </div>

        <div class="creative-layout">
          <div class="creative-main">
            ${about ? `
              <div>
                <div class="section-title">${langKeys.about}</div>
                <div class="about-text">${about}</div>
              </div>
            ` : ''}

            ${expHTML ? `
              <div>
                <div class="section-title">${langKeys.experience}</div>
                ${expHTML.replace(/class="entry-item"/g, 'class="creative-card"')}
              </div>
            ` : ''}

            ${eduHTML ? `
              <div>
                <div class="section-title">${langKeys.education}</div>
                ${eduHTML.replace(/class="entry-item"/g, 'class="creative-card"')}
              </div>
            ` : ''}

            ${projectsHTML ? `
              <div>
                <div class="section-title">${langKeys.projects}</div>
                ${projectsHTML.replace(/class="entry-item"/g, 'class="creative-card"')}
              </div>
            ` : ''}
          </div>

          <div class="creative-sidebar">
            <div>
              <div class="section-title">${isEn ? 'Contact' : 'İletişim'}</div>
              <div class="contact-list">
                ${contactItemsHTML}
              </div>
            </div>

            ${skillsHTML}
            ${langsHTML}
          </div>
        </div>
      </div>
    `;

  } else {
    // ------------------------------------
    // MODERN TEMPLATE RENDER (Default)
    // ------------------------------------
    let leftSideHTML = `
      <div class="avatar-container">
        <div class="avatar-circle">
          <img src="${avatarUrl}" alt="Avatar">
        </div>
      </div>
      
      <div class="contact-info">
        <div class="section-title-left">${isEn ? 'CONTACT' : 'İLETİŞİM'}</div>
        ${p.email ? `<div class="contact-item"><i data-lucide="mail"></i> <span>${escapeHTML(p.email)}</span></div>` : ''}
        ${p.phone ? `<div class="contact-item"><i data-lucide="phone"></i> <span>${escapeHTML(p.phone)}</span></div>` : ''}
        ${p.website ? `<div class="contact-item"><i data-lucide="globe"></i> <span>${escapeHTML(p.website)}</span></div>` : ''}
        ${p.address ? `<div class="contact-item"><i data-lucide="map-pin"></i> <span>${escapeHTML(p.address)}</span></div>` : ''}
        ${p.github ? `<div class="contact-item"><i data-lucide="github"></i> <span>${escapeHTML(p.github)}</span></div>` : ''}
        ${p.linkedin ? `<div class="contact-item"><i data-lucide="linkedin"></i> <span>${escapeHTML(p.linkedin)}</span></div>` : ''}
      </div>
    `;

    // Modern template skills rating bar
    let skillsHTML = '';
    if (cv.skills && cv.skills.length > 0) {
      skillsHTML = `
        <div class="contact-info" style="margin-top:15px;">
          <div class="section-title-left">${langKeys.skills.toUpperCase()}</div>
          ${cv.skills.map(sk => `
            <div class="skill-level-row">
              <span>${escapeHTML(sk.name)}</span>
              <div class="bar-container">
                <div class="bar-fill" style="width: ${sk.level * 20}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Modern languages list
    let langsHTML = '';
    if (cv.languages && cv.languages.length > 0) {
      langsHTML = `
        <div class="contact-info" style="margin-top:15px;">
          <div class="section-title-left">${langKeys.languages.toUpperCase()}</div>
          ${cv.languages.map(la => `
            <div style="font-size:0.8rem; margin-bottom: 5px;">
              <strong>${escapeHTML(la.name)}:</strong> ${escapeHTML(la.level)}
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="template-modern">
        <div class="left-column">
          ${leftSideHTML}
          ${skillsHTML}
          ${langsHTML}
        </div>
        <div class="right-column">
          <div class="name-title-area">
            <h1>${name}</h1>
            ${title ? `<div class="job-title">${title}</div>` : ''}
          </div>

          ${about ? `
            <div>
              <div class="section-title-right"><i data-lucide="user" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> ${langKeys.about}</div>
              <div class="about-text">${about}</div>
            </div>
          ` : ''}

          ${expHTML ? `
            <div>
              <div class="section-title-right"><i data-lucide="briefcase" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> ${langKeys.experience}</div>
              ${expHTML}
            </div>
          ` : ''}

          ${eduHTML ? `
            <div>
              <div class="section-title-right"><i data-lucide="graduation-cap" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> ${langKeys.education}</div>
              ${eduHTML}
            </div>
          ` : ''}

          ${projectsHTML ? `
            <div>
              <div class="section-title-right"><i data-lucide="award" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> ${langKeys.projects}</div>
              ${projectsHTML}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

// ----------------------------------------------------
// PDF GENERATION & DOCK DIALOGS
// ----------------------------------------------------

// Direct PDF generation using browser print and html2pdf CDN
function downloadCVAsPDF(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) return;

  showToast('PDF çıktısı hazırlanıyor, lütfen bekleyin...', 'success');

  const opt = {
    margin:       0,
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Run html2pdf download
  html2pdf().from(element).set(opt).save().then(() => {
    showToast('Özgeçmiş başarıyla PDF olarak indirildi.', 'success');
  }).catch(err => {
    console.error('PDF Engine error, fallback to browser print:', err);
    window.print();
  });
}

// Builder PDF Download button trigger
document.getElementById('btn-download-pdf').onclick = () => {
  if (!state.currentCv) return;
  const name = `${state.currentCv.personalInfo.firstName || 'CV'}_${state.currentCv.personalInfo.lastName || 'Craft'}`;
  downloadCVAsPDF('cv-print-area', `${name}_Ozgecmis.pdf`);
};

// Share panel toggle trigger
const sharePanel = document.getElementById('share-panel');
document.getElementById('btn-toggle-share').onclick = () => {
  if (!state.currentCv) return;
  
  state.sharingOpen = !state.sharingOpen;
  if (state.sharingOpen) {
    sharePanel.classList.remove('hidden');
    
    // Sync sharing UI values
    const shareToggle = document.getElementById('share-public-toggle');
    shareToggle.checked = state.currentCv.isPublic || false;
    
    const wrapper = document.getElementById('share-link-wrapper');
    const input = document.getElementById('share-url-input');
    
    // Create direct URL link representation
    const base = window.location.origin + window.location.pathname;
    input.value = `${base}#share/${state.currentCv.shareId}`;
    
    if (state.currentCv.isPublic) {
      wrapper.classList.remove('hidden');
    } else {
      wrapper.classList.add('hidden');
    }
  } else {
    sharePanel.classList.add('hidden');
  }
};

document.getElementById('btn-close-share').onclick = closeSharePanel;

function closeSharePanel() {
  state.sharingOpen = false;
  if (sharePanel) sharePanel.classList.add('hidden');
}

// Share toggle on/off trigger
document.getElementById('share-public-toggle').onchange = (e) => {
  const isChecked = e.target.checked;
  state.currentCv.isPublic = isChecked;
  autosaveCV();
  
  const wrapper = document.getElementById('share-link-wrapper');
  if (isChecked) {
    wrapper.classList.remove('hidden');
    showToast('Özgeçmiş çevrimiçi paylaşıma açıldı.', 'success');
  } else {
    wrapper.classList.add('hidden');
    showToast('Özgeçmiş çevrimiçi paylaşıma kapatıldı.', 'success');
  }
};

// Copy Share URL Link
document.getElementById('btn-copy-link').onclick = () => {
  const input = document.getElementById('share-url-input');
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
  showToast('Paylaşım bağlantısı panoya kopyalandı!', 'success');
};

// ----------------------------------------------------
// PUBLIC ROUTE: LOADING SHARE LINK
// ----------------------------------------------------
function loadSharedCV(shareId) {
  const cvs = DB.getCvs();
  const cv = cvs.find(c => c.shareId === shareId);
  const container = document.getElementById('cv-share-print-area');

  if (!cv || !cv.isPublic) {
    // Show 404 page if CV not found or public access is disabled
    renderPage('page-404');
    updateHeaderNav();
    return;
  }

  // Load CV HTML inside public view
  container.className = `a4-page template-${cv.template || 'modern'}`;
  container.innerHTML = generateCVHTML(cv);
  
  // Render page container
  renderPage('page-share');
  
  // Set up header actions binding
  document.getElementById('btn-share-download-pdf').onclick = () => {
    const filename = `${cv.personalInfo.firstName || 'CV'}_${cv.personalInfo.lastName || 'Craft'}_Ozgecmis.pdf`;
    downloadCVAsPDF('cv-share-print-area', filename);
  };

  lucide.createIcons();
}

// ----------------------------------------------------
// YAPAY ZEKA (AI) WRITING ASSISTANT MODAL
// ----------------------------------------------------
let activeAIStep = {
  section: null, // 'about' or 'experience'
  idx: null // for experience items index
};

const aiModal = document.getElementById('ai-modal');

function openAIModal(section, idx = null) {
  activeAIStep.section = section;
  activeAIStep.idx = idx;

  let currentText = '';
  if (section === 'about') {
    currentText = state.currentCv.about || '';
  } else if (section === 'experience' && idx !== null) {
    currentText = state.currentCv.experience[idx].desc || '';
  }

  // Set up modal texts
  document.getElementById('ai-current-text-display').innerText = currentText || '(Boş)';
  document.getElementById('ai-prompt-input').value = '';
  
  // Hide suggest box, reset buttons
  document.getElementById('ai-suggestion-box').classList.add('hidden');
  document.getElementById('btn-ai-apply').classList.add('hidden');
  document.getElementById('btn-ai-generate').classList.remove('hidden');
  document.getElementById('ai-loading').classList.add('hidden');

  aiModal.classList.remove('hidden');
  lucide.createIcons();
}

document.getElementById('btn-close-ai').onclick = closeAIModal;
function closeAIModal() {
  if (aiModal) aiModal.classList.add('hidden');
}

// AI trigger call (simulated backend assistant client side)
document.getElementById('btn-ai-generate').onclick = () => {
  const currentText = document.getElementById('ai-current-text-display').innerText;
  const promptInput = document.getElementById('ai-prompt-input').value.trim();

  // Show loading spinner
  document.getElementById('ai-loading').classList.remove('hidden');
  document.getElementById('btn-ai-generate').classList.add('hidden');

  // Simulated professional generation network latency
  setTimeout(() => {
    let result = '';
    const isEnglish = promptInput.toLowerCase().includes('english') || promptInput.toLowerCase().includes('ingilizce');
    const textLower = currentText.toLowerCase();

    if (activeAIStep.section === 'about') {
      if (isEnglish) {
        result = 'Highly motivated and results-driven software professional with extensive experience in modern web technologies. Adept at analyzing complex requirements to deliver robust, user-centric solutions. Passionate about writing clean, maintainable code and collaborating with cross-functional teams to drive product innovation and technical excellence.';
      } else {
        result = 'Web teknolojileri ve yazılım geliştirme süreçlerinde deneyimli, kullanıcı odaklı ve yüksek performanslı çözümler üretmeye odaklanmış yazılım profesyoneli. Analitik düşünme yapısı ve problem çözme becerisiyle karmaşık iş gereksinimlerini temiz, sürdürülebilir ve ölçeklenebilir kod yapılarına dönüştürme konusunda uzmandır. Ekip çalışmasına yatkın ve sürekli gelişim felsefesini benimser.';
      }
    } else if (activeAIStep.section === 'experience') {
      if (isEnglish) {
        result = 'Designed, developed, and maintained highly responsive user interfaces using React.js and modern state management tools. Collaborated closely with UI/UX designers to implement pixel-perfect layouts, resulting in a 25% increase in user engagement. Refactored legacy codebases to improve rendering speed, reduce bundle sizes, and optimize web performance metrics.';
      } else {
        result = 'React.js ve modern durum yönetimi mimarileri (Redux, Context API) kullanarak yüksek performanslı kullanıcı arayüzleri geliştirdim. Tasarım ve ürün ekipleriyle yakın çalışarak kullanıcı deneyimini üst seviyeye taşıyan pikselsiz tasarımları hayata geçirdim. Eski kod tabanlarını refaktör ederek sayfa yüklenme sürelerini optimize ettim ve kod kalitesini artırdım.';
      }
    }

    // Apply custom styling based on additional prompt words
    if (promptInput && !isEnglish) {
      result += ` (Ayrıca girdiğiniz "${promptInput}" hedefleri doğrultusunda revize edilmiştir.)`;
    }

    // Hide loader, render result
    document.getElementById('ai-loading').classList.add('hidden');
    document.getElementById('ai-enhanced-textarea').value = result;
    document.getElementById('ai-suggestion-box').classList.remove('hidden');
    document.getElementById('btn-ai-apply').classList.remove('hidden');
    
  }, 1500);
};

// Apply suggestion overwrite
document.getElementById('btn-ai-apply').onclick = () => {
  const enhancedText = document.getElementById('ai-enhanced-textarea').value;
  
  if (activeAIStep.section === 'about') {
    state.currentCv.about = enhancedText;
    document.getElementById('cv-about').value = enhancedText;
  } else if (activeAIStep.section === 'experience' && activeAIStep.idx !== null) {
    state.currentCv.experience[activeAIStep.idx].desc = enhancedText;
    renderDynamicExperienceList();
  }

  autosaveCV();
  renderLivePreview();
  closeAIModal();
  showToast('Yapay zeka önerisi başarıyla uygulandı.', 'success');
};


// ----------------------------------------------------
// TOAST MESSAGES UTILITY
// ----------------------------------------------------
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'check-circle' : 'alert-circle';
  toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  lucide.createIcons();

  // Remove toast after 3.5 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
    setTimeout(() => { toast.remove(); }, 300);
  }, 3500);
}

// ----------------------------------------------------
// SECURITY / DATA SANITIZER
// ----------------------------------------------------
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ----------------------------------------------------
// INITIALIZE EVENTS & RUNTIME
// ----------------------------------------------------
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  router();
  
  // Binding header logo click
  document.getElementById('header-logo').onclick = () => {
    window.location.hash = state.currentUser ? '#dashboard' : '#landing';
  };
});
