import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, 'data');
const dbFilePath = path.join(dbDir, 'database.json');

// Ensure directory and database file exist
const initDb = () => {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({ users: [], cvs: [] }, null, 2), 'utf8');
  }
};

initDb();

// Helper to read database
export const readDb = async () => {
  try {
    const data = await fs.promises.readFile(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file, returning default structure:', error);
    return { users: [], cvs: [] };
  }
};

// Helper to write database
export const writeDb = async (data) => {
  try {
    await fs.promises.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    throw error;
  }
};

// Database Operations
export const db = {
  getUsers: async () => {
    const data = await readDb();
    return data.users || [];
  },
  
  getUserById: async (id) => {
    const users = await db.getUsers();
    return users.find(u => u.id === id);
  },

  getUserByEmail: async (email) => {
    const users = await db.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser: async (user) => {
    const data = await readDb();
    data.users = data.users || [];
    data.users.push(user);
    await writeDb(data);
    return user;
  },

  updateUser: async (id, updates) => {
    const data = await readDb();
    data.users = data.users || [];
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    data.users[index] = { ...data.users[index], ...updates };
    await writeDb(data);
    return data.users[index];
  },

  // CV Operations
  getCvs: async () => {
    const data = await readDb();
    return data.cvs || [];
  },

  getCvById: async (id) => {
    const cvs = await db.getCvs();
    return cvs.find(c => c.id === id);
  },

  getCvsByUserId: async (userId) => {
    const cvs = await db.getCvs();
    return cvs.filter(c => c.userId === userId);
  },

  getCvByShareId: async (shareId) => {
    const cvs = await db.getCvs();
    return cvs.find(c => c.shareId === shareId);
  },

  createCv: async (cv) => {
    const data = await readDb();
    data.cvs = data.cvs || [];
    data.cvs.push(cv);
    await writeDb(data);
    return cv;
  },

  updateCv: async (id, updates) => {
    const data = await readDb();
    data.cvs = data.cvs || [];
    const index = data.cvs.findIndex(c => c.id === id);
    if (index === -1) return null;

    data.cvs[index] = { ...data.cvs[index], ...updates, updatedAt: new Date().toISOString() };
    await writeDb(data);
    return data.cvs[index];
  },

  deleteCv: async (id) => {
    const data = await readDb();
    data.cvs = data.cvs || [];
    const initialLength = data.cvs.length;
    data.cvs = data.cvs.filter(c => c.id !== id);
    await writeDb(data);
    return data.cvs.length < initialLength;
  }
};
