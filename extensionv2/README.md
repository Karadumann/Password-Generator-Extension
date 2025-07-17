# 🔐 Secure Password Generator Extension

A modern, user-friendly, and highly secure password generator Chrome extension that helps you create strong passwords instantly.

## ✨ Features

- **🔒 Highly Secure**: Uses cryptographically secure random number generation
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **⚙️ Customizable**: Adjustable password length (8-64 characters)
- **🔧 Flexible Options**: Choose character types (uppercase, lowercase, numbers, symbols)
- **🚫 Exclusion Support**: Exclude specific characters if needed
- **📊 Strength Indicator**: Real-time password strength analysis
- **📋 One-Click Copy**: Copy passwords to clipboard instantly
- **📜 Password History**: View recently generated passwords
- **💾 Settings Persistence**: Your preferences are saved automatically
- **⌨️ Keyboard Shortcuts**: Ctrl+C to copy, Ctrl+R to refresh

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. Download or clone this repository
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your browser toolbar

### Method 2: Install from Chrome Web Store (Coming Soon)

*This extension will be available on the Chrome Web Store soon.*

## 🎯 Usage

1. **Click the extension icon** in your browser toolbar
2. **Adjust settings**:
   - Use the slider to set password length (8-64 characters)
   - Check/uncheck character types as needed
   - Optionally exclude specific characters
3. **Generate password** by clicking the "Generate Password" button
4. **Copy password** by clicking the copy button or pressing Ctrl+C
5. **View history** by clicking the "History" button

## 🔧 Configuration

### Password Length
- **Minimum**: 8 characters
- **Maximum**: 64 characters
- **Default**: 16 characters

### Character Types
- **Uppercase Letters**: A-Z
- **Lowercase Letters**: a-z
- **Numbers**: 0-9
- **Symbols**: !@#$%^&*()_+-=[]{}|;:,.<>?

### Security Features
- Cryptographically secure random number generation
- Ensures at least one character from each selected type
- Password strength analysis
- No data sent to external servers

## 🛡️ Security

This extension prioritizes security:

- **Local Generation**: All passwords are generated locally in your browser
- **No Data Collection**: No passwords or personal data are transmitted
- **Secure Random**: Uses `crypto.getRandomValues()` for true randomness
- **No Storage**: Passwords are not stored permanently (only recent history)
- **Open Source**: Code is transparent and auditable

## 🎨 UI Features

- **Responsive Design**: Works on different screen sizes
- **Smooth Animations**: Pleasant user experience
- **Color-coded Strength**: Visual password strength indicators
- **Modern Icons**: Clean, intuitive interface
- **Dark Mode Ready**: Adapts to system preferences

## 🔧 Technical Details

- **Manifest Version**: 3 (Latest Chrome extension standard)
- **Permissions**: None required (works entirely locally)
- **Storage**: Uses localStorage for settings and history
- **Compatibility**: Chrome, Edge, and other Chromium-based browsers

## 🚀 Development

### Project Structure
```
extensionv2/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI
├── popup.css             # Styles
├── popup.js              # Main functionality
├── icons/                # Extension icons
└── README.md             # This file
```

### Building
No build process required! This is a pure HTML/CSS/JavaScript extension.

### Testing
1. Load the extension in developer mode
2. Test all features:
   - Password generation
   - Copy functionality
   - Settings persistence
   - History feature
   - Keyboard shortcuts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better password security
- Designed for user privacy and security

---

**🔐 Stay secure, stay safe!** 