

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where, addDoc, serverTimestamp } from 'firebase/firestore';

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

const mapProductData = (doc) => {
  const data = doc.data();
  let displayPrice = data.price;
  let originalPriceValue = null;

  // A discount is when the final price is lower than the original `price`.
  // Prioritize discountPrice, then webPrice.
  if (data.discountPrice != null && data.discountPrice < data.price) {
    displayPrice = data.discountPrice;
    originalPriceValue = data.price;
  } else if (data.webPrice != null && data.webPrice < data.price) {
    displayPrice = data.webPrice;
    originalPriceValue = data.price;
  }
  
  return {
    id: doc.id,
    name: data.name,
    price: displayPrice,
    originalPrice: originalPriceValue,
    image: addCloudinaryTransformation(data.imageLink),
    description: data.description,
    category: data.category,
    quantity: data.quantity || 0,
  };
};

// Function to fetch all products
export async function getProducts() {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    return productSnapshot.docs.map(mapProductData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to fetch a single product by ID
export async function getProduct(id) {
  if (!id) {
    console.error("getProduct called with an invalid ID.");
    return null;
  }
  try {
    const productRef = doc(db, 'products', String(id));
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return mapProductData(productSnap);
    } else {
      // Product not found, return null. The page component will handle this.
      return null;
    }
  } catch (error)
  {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

// Function to fetch active time-limited offers
export async function getTimeOffers() {
  try {
    const timeOffersCol = collection(db, 'time_offers');
    const offerSnapshot = await getDocs(timeOffersCol);

    if (offerSnapshot.empty) {
      return [];
    }

    const now = new Date();
    
    // Filter for active offers client-side to avoid indexing issues
    const activeOfferDocs = offerSnapshot.docs.filter(doc => {
      const data = doc.data();
      const expiresAt = data.expiresAt;
      // Ensure expiresAt is a valid Firestore Timestamp before comparing
      return expiresAt && typeof expiresAt.toDate === 'function' && expiresAt.toDate() > now;
    });

    if (activeOfferDocs.length === 0) {
        return [];
    }
    
    const offersWithProducts = await Promise.all(activeOfferDocs.map(async (offerDoc) => {
      const offerData = offerDoc.data();
      // Use the productId from the offer document's data. Default to the doc ID if not present.
      const productId = offerData.productId || offerDoc.id;
      const product = await getProduct(productId);

      if (product) {
        const discountPrice = offerData.timediscountPrice;
        
        // Ensure there is a valid discount price before returning the offer
        if (typeof discountPrice === 'number' && discountPrice > 0) {
            return {
              ...product,
              price: discountPrice,
              originalPrice: offerData.originalPrice || product.price, // Use offer's original price, fallback to product's regular price
              expiresAt: offerData.expiresAt.toDate(),
            };
        } else {
             // Log a warning if the offer price is missing or invalid, then ignore this offer.
             console.warn(`Offer for product ${productId} has an invalid timediscountPrice:`, discountPrice);
             return null;
        }
      }
      // Log a warning if the base product for an offer can't be found.
      console.warn(`Product with ID ${productId} not found for an active time offer.`);
      return null;
    }));
    
    // Filter out any null values from invalid offers or missing products
    return offersWithProducts.filter(offer => offer !== null);

  } catch (error) {
    console.error("Error fetching time offers:", error);
    return [];
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
      return null;
    }
  } catch (error) {
    console.error("Error fetching offer message:", error);
    return null;
  }
}

// Function to fetch a coupon by its code
export async function getCoupon(couponCode) {
  try {
    const couponsCol = collection(db, 'coupons');
    const q = query(couponsCol, where("code", "==", couponCode));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const couponDoc = querySnapshot.docs[0];
      return { id: couponDoc.id, ...couponDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return null;
  }
}

// Function to create a new sale record in Firestore
export async function createSale(orderData) {
  try {
    const salesCol = collection(db, 'websales');
    await addDoc(salesCol, {
      ...orderData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    // Re-throw the error to be caught by the calling function
    throw error;
  }
}


export { db };