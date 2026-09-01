
export class StorageService {
  private static dbName = "AssamJobsHubDB";
  private static storeName = "kv-store";
  private static version = 1;

  private static async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      
      request.onsuccess = (event: any) => resolve(event.target.result);
    });
  }

  public static async set(key: string, value: any): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch(e) {
      console.warn("IndexedDB set failed, falling back to localStorage", e);
      try { localStorage.setItem(key, JSON.stringify(value)); } catch(err) {}
    }
  }

  public static async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result !== undefined ? request.result as T : null);
        request.onerror = () => reject(request.error);
      });
    } catch(e) {
      console.warn("IndexedDB get failed, falling back to localStorage", e);
      try { 
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) as T : null;
      } catch(err) { return null; }
    }
  }

  public static async remove(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch(e) {
      try { localStorage.removeItem(key); } catch(err) {}
    }
  }
}
