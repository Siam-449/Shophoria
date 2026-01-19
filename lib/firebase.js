
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where, addDoc, serverTimestamp, onSnapshot, documentId } from 'firebase/firestore';
import { cache } from 'react';

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

// Helper to create URL-friendly slugs from product names
const createSlug = (name) => {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

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

  if (urlParts[1].startsWith(transformation)) {
    return url;
  }

  return `${urlParts[0]}${uploadMarker}${transformation}${urlParts[1]}`;
};

const mapProductData = (doc) => {
  const data = doc.data();

  // Ensure all prices are treated as numbers to prevent comparison bugs
  const basePrice = Number(data.price) || 0;
  const discountPrice = data.discountPrice != null ? Number(data.discountPrice) : null;
  const webPrice = data.webPrice != null ? Number(data.webPrice) : null;

  let displayPrice = basePrice;
  let originalPriceValue = null;

  // Check for regular discounts
  if (discountPrice != null && discountPrice > 0 && discountPrice < basePrice) {
    displayPrice = discountPrice;
    originalPriceValue = basePrice;
  } else if (webPrice != null && webPrice > 0 && webPrice < basePrice) {
    displayPrice = webPrice;
    originalPriceValue = basePrice;
  }
  
  return {
    id: doc.id,
    slug: createSlug(data.name),
    name: data.name,
    price: displayPrice,
    originalPrice: originalPriceValue,
    image: addCloudinaryTransformation(data.imageLink),
    description: data.description,
    category: data.category,
    quantity: data.quantity || 0,
  };
};

export const getProducts = cache(async () => {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    return productSnapshot.docs.map(mapProductData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
});

export async function getProduct(slugOrId) {
  if (!slugOrId) return null;
  
  try {
    // 1. Try fetching directly by ID (maintains compatibility for old links)
    const productRef = doc(db, 'products', String(slugOrId));
    const productSnap = await getDoc(productRef);

    let product = null;

    if (productSnap.exists()) {
      product = mapProductData(productSnap);
    } else {
      // 2. If not found by ID, find by slug (new SEO-friendly system)
      const allProducts = await getProducts();
      product = allProducts.find(p => p.slug === slugOrId);
    }

    if (!product) return null;

    // Check for an active time offer for this product by name, which can override other prices
    const timeOffersCol = collection(db, 'time_offers');
    const q = query(timeOffersCol, where("productName", "==", product.name));
    const offerSnapshot = await getDocs(q);

    if (!offerSnapshot.empty) {
      const offerData = offerSnapshot.docs[0].data();
      const expiresAt = offerData.expiresAt?.toDate();
      const now = new Date();

      if (expiresAt && expiresAt > now) {
        let timedDiscountPrice = offerData.timediscountPrice;
        if (typeof timedDiscountPrice === 'string' && timedDiscountPrice.trim() !== '') {
          const parsedPrice = Number(timedDiscountPrice);
          if (!isNaN(parsedPrice)) timedDiscountPrice = parsedPrice;
        }

        if (typeof timedDiscountPrice === 'number' && timedDiscountPrice > 0) {
          // Determine the true original price, prioritizing the one from the offer if it exists
          const baseOriginalPrice = product.originalPrice || product.price;
          const finalOriginalPrice = Number(offerData.originalPrice) || baseOriginalPrice;

          // Only apply the time offer if it's a valid discount
          if (timedDiscountPrice < finalOriginalPrice) {
            product = {
              ...product,
              price: timedDiscountPrice,
              originalPrice: finalOriginalPrice,
              expiresAt: expiresAt.toISOString(),
            };
          }
        }
      }
    }
    
    return product;

  } catch (error) {
    console.error(`Error fetching product with identifier ${slugOrId}:`, error);
    return null;
  }
}

export async function getRelatedProducts({ category, id }) {
  if (!category || !id) return [];
  try {
    const productsCol = collection(db, 'products');
    const q = query(
      productsCol,
      where('category', '==', category),
      where(documentId(), '!=', id)
    );
    const querySnapshot = await getDocs(q);
    
    const related = querySnapshot.docs.map(mapProductData)
      .filter(p => p.category !== 'prank');

    // Shuffle and slice
    const shuffled = related.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);

  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function getTimeOffers() {
  try {
    const allProducts = await getProducts();
    if (allProducts.length === 0) return [];

    const productsByName = new Map();
    allProducts.forEach(product => {
      productsByName.set(product.name.toLowerCase().trim(), product);
    });

    const timeOffersCol = collection(db, 'time_offers');
    const offerSnapshot = await getDocs(timeOffersCol);

    if (offerSnapshot.empty) return [];

    const now = new Date();
    
    const activeOfferDocs = offerSnapshot.docs.filter(doc => {
      const data = doc.data();
      const expiresAt = data.expiresAt;
      return expiresAt && typeof expiresAt.toDate === 'function' && expiresAt.toDate() > now;
    });
    
    const offersWithProducts = activeOfferDocs.map(offerDoc => {
      const offerData = offerDoc.data();
      const productName = offerData.productName;
      if (!productName) return null;
      
      const product = productsByName.get(productName.toLowerCase().trim());
      if (product) {
        let discountPrice = offerData.timediscountPrice;
        if (typeof discountPrice === 'string' && discountPrice.trim() !== '') {
          const parsedPrice = Number(discountPrice);
          if (!isNaN(parsedPrice)) discountPrice = parsedPrice;
        }
        
        if (typeof discountPrice === 'number' && discountPrice > 0) {
          const baseOriginalPrice = product.originalPrice || product.price;
          const finalOriginalPrice = Number(offerData.originalPrice) || baseOriginalPrice;
          
          if (discountPrice < finalOriginalPrice) {
            return {
              ...product,
              price: discountPrice,
              originalPrice: finalOriginalPrice,
              expiresAt: offerData.expiresAt.toDate(),
            };
          }
        }
      }
      return null;
    });
    
    return offersWithProducts.filter(offer => offer !== null);
  } catch (error) {
    console.error("Error fetching time offers:", error);
    return [];
  }
}

export async function getOfferMessage() {
  try {
    const settingsRef = doc(db, 'website_settings', 'notice');
    const settingsSnap = await getDoc(settingsRef);
    return settingsSnap.exists() ? settingsSnap.data().message : null;
  } catch (error) {
    console.error("Error fetching offer message:", error);
    return null;
  }
}

export async function getFreeDeliverySettings() {
  try {
    const settingsRef = doc(db, 'website_settings', 'free_delivery');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      const thresholdValue = settingsSnap.data().threshold;
      let threshold = 0;
      if (typeof thresholdValue === 'number') threshold = thresholdValue;
      else if (typeof thresholdValue === 'string') {
        const parsed = parseInt(thresholdValue, 10);
        if (!isNaN(parsed)) threshold = parsed;
      }
      return { threshold };
    }
    return { threshold: 0 };
  } catch (error) {
    console.error("Error fetching free delivery settings:", error);
    return { threshold: 0 };
  }
}

export async function getDeliveryCharges() {
  const defaults = { inside: 60, outside: 110 };
  try {
    const settingsRef = doc(db, 'website_settings', 'dydeliverycharge');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return { 
        inside: typeof data.inside === 'number' ? data.inside : defaults.inside,
        outside: typeof data.outside === 'number' ? data.outside : defaults.outside
      };
    }
    return defaults;
  } catch (error) {
    console.error("Error fetching delivery charges:", error);
    return defaults;
  }
}

export async function getCoupon(couponCode) {
  try {
    const couponsCol = collection(db, 'coupons');
    const q = query(couponsCol, where("code", "==", couponCode));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty ? { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } : null;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return null;
  }
}

export async function getQuantityCoupons() {
  try {
    const settingsRef = doc(db, 'website_settings', 'quantity_coupons');
    const settingsSnap = await getDoc(settingsRef);
    return settingsSnap.exists() ? settingsSnap.data().coupons || [] : [];
  } catch (error) {
    console.error("Error fetching quantity coupons:", error);
    return [];
  }
}

export function subscribeToMaintenanceMode(callback) {
  const maintenanceRef = doc(db, 'website_settings', 'maintenance');
  return onSnapshot(maintenanceRef, (docSnapshot) => {
    callback(docSnapshot.exists() ? docSnapshot.data().enabled === true : false);
  }, (error) => {
    console.error("Error subscribing to maintenance mode:", error);
    callback(false);
  });
}

export async function createSale(orderData) {
  try {
    const salesCol = collection(db, 'websales');
    await addDoc(salesCol, { ...orderData, createdAt: serverTimestamp() });
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
}

export async function submitContactForm(formData) {
  try {
    const messagesCol = collection(db, 'dynamic_messages');
    await addDoc(messagesCol, { ...formData, createdAt: serverTimestamp(), status: 'new' });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw new Error("Failed to send message. Please try again later.");
  }
}

export { db };