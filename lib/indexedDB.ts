export interface EndorsedDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  originalFile: Blob;
  endorsedFile: Blob;
  endorsedPages?: number[];
  remarks: string;
  timestamp: number;
  signatureType: 'signature' | 'stamp';
  signaturePosition: { x: number; y: number; page?: number };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  signatureImage?: Blob;
  stampImage?: Blob;
  isAuthenticated: boolean;
  subscriptionStatus: 'free' | 'premium' | 'enterprise';
}

class IndexedDBManager {
  private dbName = 'MaritimeEndorserDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('documents')) {
          const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
          documentsStore.createIndex('timestamp', 'timestamp', { unique: false });
          documentsStore.createIndex('fileType', 'fileType', { unique: false });
        }

        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      };
    });
  }

  async saveDocument(document: EndorsedDocument): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readwrite');
      const store = transaction.objectStore('documents');
      const request = store.put(document);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getDocuments(): Promise<EndorsedDocument[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readonly');
      const store = transaction.objectStore('documents');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteDocument(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readwrite');
      const store = transaction.objectStore('documents');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateDocument(document: EndorsedDocument): Promise<void> {
    return this.saveDocument(document);
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfile'], 'readwrite');
      const store = transaction.objectStore('userProfile');
      const request = store.put(profile);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfile'], 'readonly');
      const store = transaction.objectStore('userProfile');
      const request = store.get('current');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
}

export const dbManager = new IndexedDBManager();