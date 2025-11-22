// ====== Data Management ====== //
const sensorData = {
    water_level: 0,
    tds: 0,
    turbidity: 0,
    temperature: 0,
    ph: 0,
    wqi: 0,
    suggestion: "Initializing system..."
};

// ====== Global Variables ====== //
let firebaseInitialized = false;
let firebaseConnected = false;

// ====== Initialization ====== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌊 Water Monitoring Dashboard - DOM Loaded');
    
    // Wait for Firebase to be ready (it initializes in config.js)
    waitForFirebase();
    
    // Update clock
    updateClock();
    setInterval(updateClock, 1000);
});

// ====== Wait for Firebase Initialization ====== //
function waitForFirebase() {
    if (typeof database === 'undefined') {
        console.log('⏳ Waiting for Firebase to initialize...');
        setTimeout(waitForFirebase, 300);
        return;
    }
    
    console.log('✅ Firebase is ready!');
    initializeApp();
}

// ====== Main Initialization Function ====== //
function initializeApp() {
    console.log('🚀 Initializing Application...');
    
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK not loaded! Check CDN links.');
        setConnectionStatus(false);
        return;
    }
    
    console.log('✅ Firebase SDK detected');
    
    // Check if database is initialized
    if (typeof database === 'undefined') {
        console.error('❌ Database not initialized! Check config.js');
        setConnectionStatus(false);
        return;
    }
    
    console.log('✅ Database initialized');
    firebaseInitialized = true;
    
    // Initialize Firebase listeners
    initializeFirebaseListeners();
}

// ====== Firebase Real-time Listeners ====== //
function initializeFirebaseListeners() {
    console.log('📡 Setting up Firebase listeners...');
    
    try {
        // Test connection first
        const connectedRef = database.ref('.info/connected');
        
        connectedRef.on('value', (snapshot) => {
            if (snapshot.val() === true) {
                console.log('✅ Connected to Firebase Realtime Database');
                firebaseConnected = true;
                setConnectionStatus(true);
                
                // Once connected, start listening for sensor data
                setupSensorListeners();
            } else {
                console.log('❌ Disconnected from Firebase');
                firebaseConnected = false;
                setConnectionStatus(false);
            }
        }, (error) => {
            console.error('❌ Connection check error:', error);
            console.error('Error Code:', error.code);
            firebaseConnected = false;
            setConnectionStatus(false);
        });
        
    } catch (error) {
        console.error('❌ Error setting up listeners:', error);
        setConnectionStatus(false);
    }
}

// ====== Update All Displays ====== //
function updateAllDisplays() {
    updateWaterLevel();
    updateTDS();
    updateTurbidity();
    updateTemperature();
    updatePH();
    updateWQI();
    generateSuggestions();
}

// ====== Setup Sensor Data Listeners ====== //
function setupSensorListeners() {
    console.log('🔍 Setting up sensor data listeners...');
    
    try {
        const sensorsRef = database.ref('sensors');
        
        sensorsRef.on('value', 
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    console.log('📊 Data received from Firebase:', data);
                    
                    // Update sensor data
                    sensorData.water_level = data.water_level ?? 0;
                    sensorData.tds = data.tds ?? 0;
                    sensorData.turbidity = data.turbidity ?? 0;
                    sensorData.temperature = data.temperature ?? 0;
                    sensorData.ph = data.ph ?? 0;
                    sensorData.wqi = data.wqi ?? calculateWQI(data);
                    
                    // Update all displays
                    updateAllDisplays();
                    
                    setConnectionStatus(true);
                    firebaseConnected = true;
                } else {
                    console.log('⚠️ Sensors node exists but is empty');
                    console.log('💡 Tip: Your ESP32 may not have sent data yet');
                }
            },
            (error) => {
                console.error('❌ Error reading sensor data:', error);
                console.error('Error Code:', error.code);
                console.error('Error Message:', error.message);
                
                if (error.code === 'PERMISSION_DENIED') {
                    console.error('🔐 Permission denied! Check your Firebase Security Rules');
                    console.log('📖 Go to Firebase Console → Realtime Database → Rules');
                }
                
                setConnectionStatus(false);
                firebaseConnected = false;
            }
        );
        
    } catch (error) {
        console.error('❌ Exception in setupSensorListeners:', error);
        setConnectionStatus(false);
    }
}

// ====== Water Level Update ====== //
function updateWaterLevel() {
    const value = sensorData.water_level;
    const circumference = 2 * Math.PI * 90;
    const offset = circumference * (1 - value / 100);

    const element = document.getElementById('waterLevelText');
    if (element) element.textContent = `${Math.round(value)}%`;
    
    const gauge = document.getElementById('waterLevelGauge');
    if (gauge) gauge.style.strokeDashoffset = offset;
}

// ====== TDS Update ====== //
function updateTDS() {
    const value = sensorData.tds;
    const percentage = Math.min((value / 1000) * 100, 100);

    const element = document.getElementById('tdsValue');
    if (element) element.textContent = Math.round(value);
    
    const progress = document.getElementById('tdsProgress');
    if (progress) progress.style.width = percentage + '%';
}

// ====== Turbidity Update ====== //
function updateTurbidity() {
    const value = sensorData.turbidity;
    const percentage = Math.min((value / 3000) * 100, 100);

    const element = document.getElementById('turbidityValue');
    if (element) element.textContent = Math.round(value);
    
    const progress = document.getElementById('turbidityProgress');
    if (progress) progress.style.width = percentage + '%';
}

// ====== Temperature Update ====== //
function updateTemperature() {
    const value = sensorData.temperature;
    const percentage = Math.min(((value + 10) / 40) * 100, 100);

    const element = document.getElementById('temperatureValue');
    if (element) element.textContent = value.toFixed(1);
    
    const progress = document.getElementById('temperatureProgress');
    if (progress) progress.style.width = percentage + '%';
}

// ====== pH Update ====== //
function updatePH() {
    const value = sensorData.ph;
    const phPercentage = (value / 14) * 100;

    const element = document.getElementById('phValue');
    if (element) element.textContent = value.toFixed(1);
    
    const bar = document.getElementById('phBar');
    if (bar) bar.style.width = phPercentage + '%';

    // Update pH status
    let phStatus = 'Neutral';
    if (value < 5) phStatus = '🔴 Very Acidic';
    else if (value < 6) phStatus = '🟠 Acidic';
    else if (value < 7) phStatus = '🟡 Slightly Acidic';
    else if (value === 7) phStatus = '🟢 Neutral';
    else if (value < 8) phStatus = '🟡 Slightly Basic';
    else if (value < 9) phStatus = '🟠 Basic';
    else phStatus = '🔴 Very Basic';

    const statusElement = document.getElementById('phStatus');
    if (statusElement) statusElement.textContent = phStatus;
}

// ====== WQI Update ====== //
function updateWQI() {
    const value = sensorData.wqi;
    const circumference = 2 * Math.PI * 50;
    const offset = circumference * (1 - value / 100);

    const element = document.getElementById('wqiValue');
    if (element) element.textContent = Math.round(value);
    
    const fill = document.getElementById('wqiFill');
    if (fill) fill.style.strokeDashoffset = offset;
}

// ====== Calculate WQI ====== //
function calculateWQI(data) {
    const tdsScore = Math.max(0, 100 - (data.tds ?? 0) / 10);
    const turbidityScore = Math.max(0, 100 - (data.turbidity ?? 0) / 30);
    
    const ph = data.ph ?? 7;
    let phScore = 100;
    if (ph < 6.5 || ph > 8.5) {
        phScore = Math.max(0, 100 - Math.abs(ph - 7) * 10);
    }
    
    const temp = data.temperature ?? 25;
    let tempScore = 100;
    if (temp < 10 || temp > 35) {
        tempScore = Math.max(0, 100 - Math.abs(temp - 25) / 0.5);
    }

    const wqi = (tdsScore * 0.3 + turbidityScore * 0.3 + phScore * 0.2 + tempScore * 0.2);
    return Math.max(0, Math.min(100, wqi));
}

// ====== Generate Suggestions ====== //
function generateSuggestions() {
    let suggestions = [];

    // Water Level suggestions
    if (sensorData.water_level < 30) {
        suggestions.push('⚠️ Water level is low. Consider refilling.');
    } else if (sensorData.water_level > 90) {
        suggestions.push('⚠️ Water level is high. Check for potential overflow.');
    } else {
        suggestions.push('✅ Water level is optimal.');
    }

    // TDS suggestions
    if (sensorData.tds > 500) {
        suggestions.push('🔴 High TDS detected. Consider water treatment or replacement.');
    } else if (sensorData.tds > 300) {
        suggestions.push('🟡 TDS is moderately high. Monitor water quality.');
    } else {
        suggestions.push('✅ TDS levels are healthy.');
    }

    // Turbidity suggestions
    if (sensorData.turbidity > 1000) {
        suggestions.push('🔴 High turbidity detected. Water needs filtration.');
    } else if (sensorData.turbidity > 500) {
        suggestions.push('🟡 Turbidity is elevated. Consider filtering water.');
    } else {
        suggestions.push('✅ Water clarity is good.');
    }

    // pH suggestions
    const ph = sensorData.ph;
    if (ph < 6.5 || ph > 8.5) {
        suggestions.push(`⚠️ pH level (${ph.toFixed(1)}) is outside optimal range. Adjust pH balance.`);
    } else {
        suggestions.push(`✅ pH level (${ph.toFixed(1)}) is optimal.`);
    }

    // Temperature suggestions
    if (sensorData.temperature < 15) {
        suggestions.push('❄️ Water temperature is cold. Increase heating if necessary.');
    } else if (sensorData.temperature > 32) {
        suggestions.push('🔥 Water temperature is high. Improve cooling or shade.');
    } else {
        suggestions.push('✅ Water temperature is ideal.');
    }

    // WQI suggestions
    const wqi = sensorData.wqi;
    if (wqi > 80) {
        suggestions.push('⭐ Excellent water quality! Keep monitoring.');
    } else if (wqi > 60) {
        suggestions.push('👍 Good water quality. Continue regular monitoring.');
    } else if (wqi > 40) {
        suggestions.push('⚠️ Fair water quality. Take corrective measures.');
    } else {
        suggestions.push('🔴 Poor water quality. Immediate action required!');
    }

    // Display suggestions
    const suggestionText = suggestions.join(' | ');
    document.getElementById('suggestionText').textContent = suggestionText;
}

// ====== Connection Status ====== //
function setConnectionStatus(connected) {
    const statusDot = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');

    if (connected) {
        if (statusDot) statusDot.classList.add('connected');
        if (statusText) statusText.textContent = 'Connected';
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.remove('show');
    } else {
        if (statusDot) statusDot.classList.remove('connected');
        if (statusText) statusText.textContent = 'Disconnected';
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.add('show');
    }
}

// ====== Update Clock ====== //
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const element = document.getElementById('lastUpdate');
    if (element) element.textContent = time;
}

// ====== Error Handler ====== //
window.addEventListener('error', function(e) {
    console.error('🔴 JavaScript Error:', e.error);
});

// ====== Cleanup on Unload ====== //
window.addEventListener('beforeunload', function() {
    if (typeof database !== 'undefined') {
        database.ref().off();
    }
});

// ====== Debug Helper - Log to Console ====== //
console.log('📊 SafePond AI Water Monitoring Dashboard');
console.log('🔍 Check the console for status messages');
console.log('⏱️ Waiting for Firebase initialization...');
