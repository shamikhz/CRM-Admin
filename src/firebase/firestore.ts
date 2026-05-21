import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';

// Collection references
export const collections = {
  users: 'users',
  attendance: 'attendance',
  customers: 'customers',
  orders: 'orders',
  visits: 'visits',
  tasks: 'tasks',
  notifications: 'notifications',
  reports: 'reports',
  liveLocations: 'liveLocations',
  regions: 'regions',
} as const;

// Helper to robustly convert Firestore values to Date objects
const parseDate = (val: any) => {
  if (!val) return undefined;
  if (typeof val.toDate === 'function') return val.toDate();
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? undefined : val;
  }
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

// Generic CRUD operations
export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const ref = collection(db, collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: parseDate(doc.data().createdAt) || new Date(),
    updatedAt: parseDate(doc.data().updatedAt),
    checkIn: parseDate(doc.data().checkIn),
    checkOut: parseDate(doc.data().checkOut),
    dueDate: parseDate(doc.data().dueDate),
    generatedAt: parseDate(doc.data().generatedAt),
    timestamp: parseDate(doc.data().timestamp),
  })) as T[];
}

export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as T;
}

export async function createDocument(
  collectionName: string,
  data: DocumentData,
  docId?: string
): Promise<string> {
  if (docId) {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docId;
  }
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

// Realtime listener
export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  constraints: QueryConstraint[] = []
) {
  const ref = collection(db, collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: parseDate(doc.data().createdAt) || new Date(),
      updatedAt: parseDate(doc.data().updatedAt),
      checkIn: parseDate(doc.data().checkIn),
      checkOut: parseDate(doc.data().checkOut),
      dueDate: parseDate(doc.data().dueDate),
      generatedAt: parseDate(doc.data().generatedAt),
      timestamp: parseDate(doc.data().timestamp),
    })) as T[];
    callback(data);
  });
}

// Re-export Firestore utilities
export { where, orderBy, limit, Timestamp, query, collection, onSnapshot };
