
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where, addDoc, serverTimestamp, onSnapshot, documentId } from 'firebase/firestore';
import { cache } from 'react';
import { unstable_noStore as noStore } from 'next/cache';

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

const normalizeStringList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map(item => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') return item.name || item.title || item.label || item.value || '';
        return String(item || '').trim();
      })
      .filter(Boolean);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeStringList(parsed);
      } catch (e) {}
    }
    return trimmed
      .split(/[,|\n]/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeImages = (data) => {
  const images = [];

  const addImage = (rawUrl) => {
    if (!rawUrl) return;
    const url = typeof rawUrl === 'string' ? rawUrl.trim() : (rawUrl.url || rawUrl.link || rawUrl.src || rawUrl.imageLink);
    if (typeof url === 'string' && url.trim()) {
      const transformed = addCloudinaryTransformation(url.trim());
      if (transformed && !images.includes(transformed)) {
        images.push(transformed);
      }
    }
  };

  // 1. Check primary product gallery from Shophoria (images array of strings)
  if (Array.isArray(data.images)) {
    data.images.forEach(addImage);
  }

  // 2. Primary image fields
  addImage(data.imageLink);
  addImage(data.image);

  // 3. Fallback candidate lists
  const candidateLists = [data.imageLinks, data.gallery, data.additionalImages, data.photos];
  candidateLists.forEach(list => {
    if (Array.isArray(list)) {
      list.forEach(addImage);
    } else if (typeof list === 'string' && list.trim()) {
      const trimmed = list.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) parsed.forEach(addImage);
        } catch (e) {}
      } else if (trimmed.includes(',') || trimmed.includes('\n')) {
        trimmed.split(/[,|\n]/).forEach(url => {
          const u = url.trim();
          if (u.startsWith('http')) addImage(u);
        });
      }
    }
  });

  // 4. Variant images (Size Image / Weight Image)
  const rawVariants = Array.isArray(data.variants) ? data.variants : [];
  rawVariants.forEach(v => {
    if (v && typeof v === 'object') {
      addImage(v.image || v.imageLink || v.imageUrl || v.photo);
    }
  });

  return images;
};

const normalizeVariants = (data) => {
  let raw = data.variants || data.productVariants;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch (e) {
      raw = [];
    }
  }
  if (!Array.isArray(raw)) return [];

  return raw.map((v, idx) => {
    if (typeof v === 'string') {
      const name = v.trim();
      return {
        id: `var-${idx}`,
        variantType: 'other',
        name: name,
        price: null,
        regularPrice: null,
        discountPrice: null,
        originalPrice: null,
        quantity: null,
        image: null,
        color: null,
        size: null,
        sizeUnit: null,
        weight: null,
        weightUnit: null,
      };
    }
    if (v && typeof v === 'object') {
      const img = v.image || v.imageLink || v.imageUrl || v.photo;
      const rawPrice = v.price != null && !isNaN(Number(v.price)) ? Number(v.price) : null;
      const rawDiscountPrice = v.discountPrice != null && !isNaN(Number(v.discountPrice)) ? Number(v.discountPrice) : null;
      const rawOriginalPrice = v.originalPrice != null && !isNaN(Number(v.originalPrice)) ? Number(v.originalPrice) : null;

      // Price & Discount Price resolution:
      // In Shophoria: Price (Tk) is regular price, Discount Price (Tk) is the discounted offer price.
      let effectivePrice = rawPrice;
      let effectiveOriginalPrice = rawOriginalPrice;

      if (rawDiscountPrice != null && rawDiscountPrice > 0) {
        if (rawPrice != null && rawPrice > rawDiscountPrice) {
          effectivePrice = rawDiscountPrice;
          effectiveOriginalPrice = rawPrice;
        } else {
          effectivePrice = rawDiscountPrice;
        }
      } else if (rawOriginalPrice != null && rawPrice != null && rawOriginalPrice > rawPrice) {
        effectiveOriginalPrice = rawOriginalPrice;
      }

      const rawType = v.variantType ? String(v.variantType).toLowerCase().trim() : '';
      const variantType = rawType || (v.size ? 'size' : (v.weight ? 'weight' : (v.color ? 'color' : 'other')));
      const sizeVal = v.size || (variantType === 'size' ? v.name : null);
      const weightVal = v.weight || (variantType === 'weight' ? v.name : null);
      const colorVal = v.color || (variantType === 'color' ? v.name : null);
      const nameVal = v.name || sizeVal || weightVal || colorVal || `Variant ${idx + 1}`;

      return {
        id: v.id || v.sku || `var-${idx}`,
        variantType: variantType,
        name: nameVal,
        price: effectivePrice,
        regularPrice: rawPrice,
        discountPrice: rawDiscountPrice,
        originalPrice: effectiveOriginalPrice,
        quantity: v.quantity != null && !isNaN(Number(v.quantity)) ? Number(v.quantity) : null,
        image: img ? addCloudinaryTransformation(img) : null,
        color: colorVal,
        size: sizeVal,
        sizeUnit: v.sizeUnit || null,
        weight: weightVal,
        weightUnit: v.weightUnit || null,
      };
    }
    return null;
  }).filter(Boolean);
};

const mapProductData = (doc) => {
  const data = doc.data();

  const basePrice = Number(data.price) || 0;
  let displayPrice = basePrice;

  // Convert potential discounts to numbers
  const discountPrice = data.discountPrice != null ? Number(data.discountPrice) : null;
  const webPrice = data.webPrice != null ? Number(data.webPrice) : null;

  // Sequentially check for the best price
  if (discountPrice > 0 && discountPrice < displayPrice) {
    displayPrice = discountPrice;
  }
  if (webPrice > 0 && webPrice < displayPrice) {
    displayPrice = webPrice;
  }
  
  const originalPriceValue = (displayPrice < basePrice) ? basePrice : null;
  
  const images = normalizeImages(data);
  const variants = normalizeVariants(data);
  const colors = normalizeStringList(data.colors || data.color);

  // Collect sizes: from data.sizes, data.size, or from size variants
  const sizeVariants = variants.filter(v => v.variantType === 'size' || v.size);
  const rawSizes = normalizeStringList(data.sizes || data.size);
  const variantSizes = sizeVariants.map(v => v.size || v.name).filter(Boolean);
  const sizes = rawSizes.length > 0 
    ? rawSizes 
    : Array.from(new Set(variantSizes));

  // Collect weights: from data.weights, data.weight, or from weight variants
  const weightVariants = variants.filter(v => v.variantType === 'weight' || v.weight);
  const rawWeights = normalizeStringList(data.weights || data.weight);
  const variantWeights = weightVariants.map(v => v.weight || v.name).filter(Boolean);
  const weights = rawWeights.length > 0 
    ? rawWeights 
    : Array.from(new Set(variantWeights));

  const fallbackImage = addCloudinaryTransformation(data.imageLink) || '/shophoria.jpeg';
  const allImages = images.length > 0 ? images : [fallbackImage];

  return {
    id: doc.id,
    slug: createSlug(data.name),
    name: data.name,
    price: displayPrice,
    originalPrice: originalPriceValue,
    image: allImages[0] || fallbackImage,
    images: allImages,
    description: data.description,
    category: data.category,
    quantity: data.quantity || 0,
    barcode: data.barcode || '',
    variants: variants,
    colors: colors,
    sizes: sizes,
    weights: weights,
    color: data.color || null,
    size: data.size || null,
    weight: data.weight || null,
  };
};

export const getProducts = cache(async () => {
  noStore();
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    return productSnapshot.docs.map(mapProductData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
});

export function subscribeToProducts(callback) {
  try {
    const productsCol = collection(db, 'products');
    return onSnapshot(productsCol, (snapshot) => {
      const productList = snapshot.docs.map(mapProductData);
      callback(productList);
    }, (error) => {
      console.error("Error subscribing to products:", error);
    });
  } catch (err) {
    console.error("Error setting up products listener:", err);
    return () => {};
  }
}

export async function getProduct(slugOrId) {
  noStore();
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
          const baseOriginalPrice = product.originalPrice || product.price;
          const finalOriginalPrice = Number(offerData.originalPrice) || baseOriginalPrice;

          // Only apply the time offer if it's a valid discount against the original price
          if (timedDiscountPrice < finalOriginalPrice) {
             // And if it's better than the current display price
            if (timedDiscountPrice < product.price) {
                product.price = timedDiscountPrice;
                product.originalPrice = finalOriginalPrice;
            }
            product.expiresAt = expiresAt.toISOString();
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
  noStore();
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
  noStore();
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
              price: Math.min(product.price, discountPrice), // Use the better price
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
  noStore();
  try {
    const settingsRef = doc(db, 'website_settings', 'notice');
    const settingsSnap = await getDoc(settingsRef);
    return settingsSnap.exists() ? settingsSnap.data().message : null;
  } catch (error) {
    console.error("Error fetching offer message:", error);
    return null;
  }
}

export async function getBanners() {
  noStore();
  try {
    const settingsRef = doc(db, 'website_settings', 'banners');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      const list = data.slides || data.banners || data.items;
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }

    const bannersCol = collection(db, 'banners');
    const bannerSnapshot = await getDocs(bannersCol);
    if (!bannerSnapshot.empty) {
      return bannerSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    return null;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return null;
  }
}

export function subscribeToBanners(callback) {
  try {
    const settingsRef = doc(db, 'website_settings', 'banners');
    return onSnapshot(settingsRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const list = data.slides || data.banners || data.items;
        if (Array.isArray(list) && list.length > 0) {
          callback(list);
          return;
        }
      }
      callback(null);
    }, (error) => {
      console.error("Error subscribing to banners:", error);
      callback(null);
    });
  } catch (err) {
    console.error("Error setting up banners listener:", err);
    callback(null);
    return () => {};
  }
}

export async function getCategories() {
  noStore();
  try {
    const settingsRef = doc(db, 'website_settings', 'categories');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      const list = data.categories || data.items || data.list;
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }

    const catCol = collection(db, 'categories');
    const catSnapshot = await getDocs(catCol);
    if (!catSnapshot.empty) {
      return catSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    return null;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
}

export function subscribeToCategories(callback) {
  try {
    const settingsRef = doc(db, 'website_settings', 'categories');
    return onSnapshot(settingsRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const list = data.categories || data.items || data.list;
        if (Array.isArray(list) && list.length > 0) {
          callback(list);
          return;
        }
      }
      callback(null);
    }, (error) => {
      console.error("Error subscribing to categories:", error);
      callback(null);
    });
  } catch (err) {
    console.error("Error setting up categories listener:", err);
    callback(null);
    return () => {};
  }
}

export async function getFreeDeliverySettings() {
  noStore();
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
  noStore();
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