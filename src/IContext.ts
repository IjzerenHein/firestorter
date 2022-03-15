import type {
    collection,
    doc,
    getDocs,
    where,
    query,
    addDoc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    deleteField,
    serverTimestamp,
  } from 'firebase/firestore';
  
  export interface IContext {
    collection(path: string): ReturnType<typeof collection>;
    doc(path: string): ReturnType<typeof doc>;
    readonly getDocs: typeof getDocs;
    readonly where: typeof where;
    readonly query: typeof query;
    readonly addDoc: typeof addDoc;
    readonly getDoc: typeof getDoc;
    readonly setDoc: typeof setDoc;
    readonly updateDoc: typeof updateDoc;
    readonly deleteDoc: typeof deleteDoc;
    readonly onSnapshot: typeof onSnapshot;
    readonly deleteField: typeof deleteField;
    readonly serverTimestamp: typeof serverTimestamp;
  }