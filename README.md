# 🌊 SafePond AI - Water Quality Monitoring Dashboard

A beautiful real-time water quality monitoring dashboard connected to Firebase Realtime Database.

## 📋 Features

- **Real-time Monitoring**: Live sensor data updates from your ESP32 device
- **7 Key Parameters**:
  - 💧 Water Level
  - 📊 TDS (Total Dissolved Solids)
  - 🌊 Turbidity
  - 🌡️ Temperature
  - 📈 pH Level
  - ⭐ WQI (Water Quality Index) - Calculated automatically
  - 💡 Smart Suggestions - AI-powered recommendations

- **Beautiful Design**: Underwater ocean theme with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Firebase REST API integration for instant data sync

## 🚀 Quick Start

1. **Open the dashboard**:
   ```
   Open index-rest.html in your web browser
   ```

2. **See your data**:
   - Dashboard will automatically connect to Firebase
   - Parameters update in real-time
   - All animations work smoothly

## 📁 Project Files

| File | Purpose |
|------|---------|
| `index-rest.html` | Main dashboard (open this!) |
| `config.js` | Firebase configuration |
| `script.js` | Real-time data logic |
| `styles.css` | Ocean theme & animations |

## ⚙️ Configuration

Firebase credentials are in `config.js`:
- API Key
- Database URL
- Project ID
- Other Firebase settings

**Note**: Credentials are pre-configured. No changes needed unless you change Firebase projects.

## 📊 Data Format

Your ESP32 should send data to Firebase at this path:
```
/sensors/
```

Expected data structure:
```json
{
  "water_level": 45.5,
  "tds": 280,
  "turbidity": 2.3,
  "temperature": 28.5,
  "ph": 7.2
}
```

## 🎨 WQI Calculation

Water Quality Index is automatically calculated using:
- **TDS**: 30% weight
- **Turbidity**: 30% weight
- **pH**: 20% weight
- **Temperature**: 20% weight

WQI Scale:
- 0-25: Poor (Red)
- 25-50: Fair (Orange)
- 50-75: Good (Yellow)
- 75-100: Excellent (Green)

## 💡 Smart Suggestions

The dashboard generates recommendations based on:
- TDS levels (salinity/minerals)
- Turbidity (cloudiness)
- pH balance
- Temperature conditions

## 🔒 Security

Firebase is configured to allow:
- Anonymous authentication
- Real-time database read access
- REST API access

If you want to restrict access:
1. Go to Firebase Console
2. Update Database Rules
3. Add custom security rules

## 📱 Browser Support

Works on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🌐 Offline Mode

The dashboard works with Firebase REST API, which:
- Works with most firewalls
- Polls for updates every 5 seconds
- Falls back gracefully if unavailable

## 🐛 Troubleshooting

**Dashboard not updating?**
1. Check browser console (F12)
2. Verify ESP32 is sending data to Firebase
3. Confirm data path is `/sensors/`
4. Check Firebase security rules

**Animations stuttering?**
1. Close other browser tabs
2. Reduce browser zoom
3. Use latest browser version

**Data format issues?**
1. Verify JSON structure in Firebase
2. Ensure numbers are valid (not strings)
3. Check for missing parameters

## 📞 Support

For issues or questions:
1. Check browser console for errors (F12)
2. Verify Firebase connection in console
3. Ensure ESP32 is sending correct data format

## 📈 Future Enhancements

Possible additions:
- Historical data charts
- Alert system for parameter thresholds
- Data export to CSV
- Multiple device support
- Custom water quality thresholds

## 🎓 How It Works

```
ESP32 → Firebase Realtime DB → Dashboard REST API → Live Display
         (stores data)         (fetches data)       (shows UI)
```

## ✨ Features Highlight

✅ Real-time updates every 5 seconds
✅ Beautiful underwater ocean theme
✅ Animated bubbles, fish, seaweed, waves
✅ Glassmorphism UI effects
✅ Mobile-responsive design
✅ Automatic WQI calculation
✅ AI-powered suggestions
✅ Connection status indicator
✅ No external dependencies (except Firebase)
✅ Production-ready code

---

**Start monitoring your water quality now!** 🌊

Open `index-rest.html` and watch your parameters update in real-time!
