// Firebase Configuration
// Replace with your actual Firebase credentials from your Firebase Console

const firebaseConfig = {
    apiKey: "AIzaSyBAG4ejOSYPZNU5fU_krSJroYDH1lYcCVk",
    authDomain: "sensor-reading-baea8.firebaseapp.com",
    databaseURL: "https://sensor-reading-baea8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sensor-reading-baea8",
    storageBucket: "sensor-reading-baea8.firebasestorage.app",
    messagingSenderId: "1015202424193",
    appId: "1:1015202424193:android:4d72d917d080b5ea84f480"
};

let database;

// Wait for Firebase SDK to be available
function initializeFirebaseConfig() {
    if (typeof firebase === 'undefined') {
        console.warn('⏳ Firebase SDK not yet loaded, retrying in 500ms...');
        setTimeout(initializeFirebaseConfig, 500);
        return;
    }

    try {
        console.log('🔧 Starting Firebase initialization...');
        
        // Check if already initialized
        if (firebase.apps.length === 0) {
            const app = firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase App initialized');
        } else {
            console.log('✅ Firebase App already initialized');
        }
        
        // Get database reference
        database = firebase.database();
        console.log('✅ Firebase Database reference created');
        console.log('📍 Database URL:', firebaseConfig.databaseURL);
        
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
    }
}

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebaseConfig);
} else {
    initializeFirebaseConfig();
}
