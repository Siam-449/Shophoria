import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOwSUE_xSDiK79uBzNrL1ube_zUVuQwDA",
  authDomain: "shophoria-stock-tracker.firebaseapp.com",
  projectId: "shophoria-stock-tracker",
  storageBucket: "shophoria-stock-tracker.appspot.com",
  messagingSenderId: "628670156051",
  appId: "1:628670156051:web:2491543fa5879c0a19dee6",
  measurementId: "G-T832EXMQ1V"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const addCloudinaryTransformation = (url) => {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }
  
  const uploadMarker = '/upload/';
  if (!url.includes(uploadMarker)) {
    return url;
  }
  
  const transformation = 'c_pad,b_auto,w_500,h_500,f_auto,q_auto/';
  const urlParts = url.split(uploadMarker);

  // Avoid adding transformation if it's already present at the start of the path
  if (urlParts[1].startsWith(transformation)) {
    return url;
  }

  return `${urlParts[0]}${uploadMarker}${transformation}${urlParts[1]}`;
};

// Function to fetch all products
export async function getProducts() {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.webPrice !== undefined ? data.webPrice : data.price, 
        originalPrice: data.webPrice !== undefined && data.price > data.webPrice ? data.price : null,
        image: addCloudinaryTransformation(data.imageLink),
        description: data.description,
        category: data.category,
        quantity: data.quantity || 0,
      };
    });
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to fetch a single product by ID
export async function getProduct(id) {
  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const data = productSnap.data();
      return {
        id: productSnap.id,
        name: data.name,
        price: data.webPrice !== undefined ? data.webPrice : data.price,
        originalPrice: data.webPrice !== undefined && data.price > data.webPrice ? data.price : null,
        image: addCloudinaryTransformation(data.imageLink),
        description: data.description,
        category: data.category,
        quantity: data.quantity || 0,
      };
    } else {
      // Product not found, return null. The page component will handle this.
      return null;
    }
  } catch (error)
  {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Function to fetch the offer banner message
export async function getOfferMessage() {
  try {
    const settingsRef = doc(db, 'website_settings', 'notice');
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return data.message || null;
    } else {
      // This is an expected case if the banner message isn't set in Firestore.
      // The UI will gracefully fall back to a default message.
      return null;
    }
  } catch (error) {
    console.error("Error fetching offer message:", error);
    return null;
  }
}

export { db };