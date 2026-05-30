import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from './database.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'antigravity-cv-secret-key-12345';

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow higher limits for base64 avatars

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CV Builder API is running smoothly' });
});

// AUTHENTICATION ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Tüm alanları doldurmak zorunludur.' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      name,
      passwordHash,
      title: '',
      avatarUrl: '',
      createdAt: new Date().toISOString()
    };

    await db.createUser(newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Remove passwordHash before sending response
    const { passwordHash: _, ...userResponse } = newUser;
    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Kayıt işlemi sırasında bir hata oluştu.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Hatalı e-posta adresi veya şifre.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Hatalı e-posta adresi veya şifre.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    const { passwordHash: _, ...userResponse } = user;
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Giriş işlemi sırasında bir hata oluştu.' });
  }
});

// Profile Update
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { name, title, avatarUrl } = req.body;
    const userId = req.user.id;

    const updatedUser = await db.updateUser(userId, { name, title, avatarUrl });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const { passwordHash: _, ...userResponse } = updatedUser;
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Profil güncellenirken bir hata oluştu.' });
  }
});

// CV ROUTES

// Get all CVs of logged in user
app.get('/api/cvs', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cvs = await db.getCvsByUserId(userId);
    res.json(cvs);
  } catch (error) {
    console.error('Get CVs Error:', error);
    res.status(500).json({ message: 'Özgeçmişler alınırken bir hata oluştu.' });
  }
});

// Get specific CV by ID
app.get('/api/cvs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cv = await db.getCvById(id);
    if (!cv) {
      return res.status(404).json({ message: 'Özgeçmiş bulunamadı.' });
    }

    if (cv.userId !== userId) {
      return res.status(403).json({ message: 'Bu özgeçmişe erişim izniniz yok.' });
    }

    res.json(cv);
  } catch (error) {
    console.error('Get CV by ID Error:', error);
    res.status(500).json({ message: 'Özgeçmiş alınırken bir hata oluştu.' });
  }
});

// Create new CV
app.post('/api/cvs', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, language, template, personalInfo, about, experience, education, skills, projects, languages } = req.body;

    const newCv = {
      id: uuidv4(),
      userId,
      title: title || 'Yeni Özgeçmişim',
      language: language || 'tr',
      template: template || 'modern',
      isPublic: false,
      shareId: uuidv4().substring(0, 8),
      personalInfo: personalInfo || {},
      about: about || '',
      experience: experience || [],
      education: education || [],
      skills: skills || [],
      projects: projects || [],
      languages: languages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.createCv(newCv);
    res.status(201).json(newCv);
  } catch (error) {
    console.error('Create CV Error:', error);
    res.status(500).json({ message: 'Özgeçmiş oluşturulurken bir hata oluştu.' });
  }
});

// Update CV
app.put('/api/cvs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const cv = await db.getCvById(id);
    if (!cv) {
      return res.status(404).json({ message: 'Özgeçmiş bulunamadı.' });
    }

    if (cv.userId !== userId) {
      return res.status(403).json({ message: 'Bu özgeçmişi güncelleme izniniz yok.' });
    }

    // Protect system-controlled fields from direct override
    const { id: _, userId: __, createdAt: ___, ...allowedUpdates } = updates;

    const updatedCv = await db.updateCv(id, allowedUpdates);
    res.json(updatedCv);
  } catch (error) {
    console.error('Update CV Error:', error);
    res.status(500).json({ message: 'Özgeçmiş güncellenirken bir hata oluştu.' });
  }
});

// Delete CV
app.delete('/api/cvs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cv = await db.getCvById(id);
    if (!cv) {
      return res.status(404).json({ message: 'Özgeçmiş bulunamadı.' });
    }

    if (cv.userId !== userId) {
      return res.status(403).json({ message: 'Bu özgeçmişi silme izniniz yok.' });
    }

    await db.deleteCv(id);
    res.json({ message: 'Özgeçmiş başarıyla silindi.' });
  } catch (error) {
    console.error('Delete CV Error:', error);
    res.status(500).json({ message: 'Özgeçmiş silinirken bir hata oluştu.' });
  }
});

// Public Share Route: get CV by shareId
app.get('/api/cvs/share/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    const cv = await db.getCvByShareId(shareId);

    if (!cv || !cv.isPublic) {
      return res.status(404).json({ message: 'Paylaşılan özgeçmiş bulunamadı veya paylaşıma kapalı.' });
    }

    res.json(cv);
  } catch (error) {
    console.error('Public Share Error:', error);
    res.status(500).json({ message: 'Özgeçmiş yüklenirken bir hata oluştu.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
