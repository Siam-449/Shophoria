

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

    if (!productSnap.exists()) {
      return null;
    }

    let product = mapProductData(productSnap);

    // Check for an active time offer for this product by name
    const timeOffersCol = collection(db, 'time_offers');
    const q = query(timeOffersCol, where("productName", "==", product.name));
    const offerSnapshot = await getDocs(q);

    if (!offerSnapshot.empty) {
      const offerDoc = offerSnapshot.docs[0]; // Assuming one offer per product name
      const offerData = offerDoc.data();
      const expiresAt = offerData.expiresAt?.toDate();
      const now = new Date();

      if (expiresAt && expiresAt > now) {
        // Offer is active, let's process the discount price
        let discountPrice = offerData.timediscountPrice;

        if (typeof discountPrice === 'string' && discountPrice.trim() !== '') {
          const parsedPrice = Number(discountPrice);
          if (!isNaN(parsedPrice)) {
            discountPrice = parsedPrice;
          }
        }

        if (typeof discountPrice === 'number' && discountPrice > 0) {
          // Apply offer details to the product object
          product = {
            ...product,
            price: discountPrice,
            originalPrice: offerData.originalPrice || product.originalPrice || product.price,
            expiresAt: expiresAt.toISOString(), // Convert to string for serialization
          };
        }
      }
    }
    
    return product;

  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

// Function to fetch active time-limited offers
export async function getTimeOffers() {
  try {
    // 1. Fetch all products to create a lookup by name
    const allProducts = await getProducts();
    if (allProducts.length === 0) {
      console.warn("No products found, cannot process time offers.");
      return [];
    }

    // Create a map for quick, case-insensitive lookup
    const productsByName = new Map();
    allProducts.forEach(product => {
      productsByName.set(product.name.toLowerCase().trim(), product);
    });

    // 2. Fetch all time offers
    const timeOffersCol = collection(db, 'time_offers');
    const offerSnapshot = await getDocs(timeOffersCol);

    if (offerSnapshot.empty) {
      return [];
    }

    const now = new Date();
    
    // 3. Filter for active offers client-side
    const activeOfferDocs = offerSnapshot.docs.filter(doc => {
      const data = doc.data();
      const expiresAt = data.expiresAt;
      if (!expiresAt || typeof expiresAt.toDate !== 'function') {
        console.warn(`Offer ${doc.id} has an invalid or missing 'expiresAt' field.`);
        return false;
      }
      return expiresAt.toDate() > now;
    });
    
    // 4. Map active offers to products using productName
    const offersWithProducts = activeOfferDocs.map(offerDoc => {
      const offerData = offerDoc.data();
      const productName = offerData.productName;

      if (!productName || typeof productName !== 'string' || productName.trim() === '') {
        console.warn(`Offer document ${offerDoc.id} is missing a valid productName.`);
        return null;
      }
      
      const product = productsByName.get(productName.toLowerCase().trim());

      if (product) {
        let discountPrice = offerData.timediscountPrice;
        
        if (typeof discountPrice === 'string' && discountPrice.trim() !== '') {
          const parsedPrice = Number(discountPrice);
          if (!isNaN(parsedPrice)) {
            discountPrice = parsedPrice;
          }
        }
        
        if (typeof discountPrice === 'number' && discountPrice > 0) {
          return {
            ...product,
            price: discountPrice,
            originalPrice: offerData.originalPrice || product.originalPrice || product.price,
            expiresAt: offerData.expiresAt.toDate(),
          };
        } else {
          console.warn(`Offer for product name "${productName}" has an invalid or missing timediscountPrice. Value:`, offerData.timediscountPrice);
          return null;
        }
      }
      
      console.warn(`Product with name "${productName}" not found for an active time offer.`);
      return null;
    });
    
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