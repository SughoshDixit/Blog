import { db } from "../Firebase/Firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const getBookmarksRef = (uid) => collection(db, "users", uid, "bookmarks");

export async function syncBookmarksToFirestore(uid) {
  if (!uid) return;
  const local = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  if (!local.length) return;

  const ref = getBookmarksRef(uid);
  await Promise.all(
    local.map((b) =>
      setDoc(doc(ref, b.id), {
        title: b.title || "",
        data: b.data || {},
        savedAt: b.savedAt || new Date().toISOString(),
      }, { merge: true })
    )
  );
}

export async function getBookmarksFromFirestore(uid) {
  if (!uid) return [];
  const snap = await getDocs(getBookmarksRef(uid));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addBookmarkToFirestore(uid, postId, postTitle, postData) {
  if (!uid) return;
  await setDoc(doc(getBookmarksRef(uid), postId), {
    title: postTitle || "",
    data: postData || {},
    savedAt: new Date().toISOString(),
  });
}

export async function removeBookmarkFromFirestore(uid, postId) {
  if (!uid) return;
  await deleteDoc(doc(getBookmarksRef(uid), postId));
}

export async function clearAllBookmarksFirestore(uid) {
  if (!uid) return;
  const snap = await getDocs(getBookmarksRef(uid));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}
