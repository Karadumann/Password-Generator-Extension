class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.generatePassword();
    }

    initializeElements() {
        this.passwordOutput = document.getElementById('passwordOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.historyBtn = document.getElementById('historyBtn');
        
        this.passwordLength = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.uppercase = document.getElementById('uppercase');
        this.lowercase = document.getElementById('lowercase');
        this.numbers = document.getElementById('numbers');
        this.symbols = document.getElementById('symbols');
        this.excludeChars = document.getElementById('excludeChars');
        
        this.strengthIndicator = document.getElementById('strengthIndicator');
        this.strengthText = document.getElementById('strengthText');
        
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.passwordHistory = this.loadPasswordHistory();
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.refreshBtn.addEventListener('click', () => this.generatePassword());
        
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        
        this.passwordLength.addEventListener('input', (e) => {
            this.lengthValue.textContent = e.target.value;
            this.generatePassword();
        });
        
        [this.uppercase, this.lowercase, this.numbers, this.symbols].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.generatePassword());
        });
        
        this.excludeChars.addEventListener('input', () => this.generatePassword());
        
        this.historyBtn.addEventListener('click', () => this.showPasswordHistory());
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'c':
                        e.preventDefault();
                        this.copyPassword();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.generatePassword();
                        break;
                }
            }
        });
    }

    generatePassword() {
        try {
            const selectedSets = [];
            if (this.uppercase.checked) selectedSets.push(this.charSets.uppercase);
            if (this.lowercase.checked) selectedSets.push(this.charSets.lowercase);
            if (this.numbers.checked) selectedSets.push(this.charSets.numbers);
            if (this.symbols.checked) selectedSets.push(this.charSets.symbols);
            
            if (selectedSets.length === 0) {
                this.showError('Please select at least one character type.');
                return;
            }
            
            const length = parseInt(this.passwordLength.value);
            const excludeChars = this.excludeChars.value;
            
            const password = this.generateSecurePassword(selectedSets, length, excludeChars);
            
            this.passwordOutput.value = password;
            this.updateStrengthIndicator(password);
            this.addToHistory(password);
            this.saveSettings();
            
            this.passwordOutput.classList.add('password-generated');
            setTimeout(() => {
                this.passwordOutput.classList.remove('password-generated');
            }, 300);
            
        } catch (error) {
            console.error('Error generating password:', error);
            this.showError('Error generating password. Please try again.');
        }
    }

    generateSecurePassword(charSets, length, excludeChars) {
        let allChars = charSets.join('');
        
        if (excludeChars) {
            const excludeArray = excludeChars.split('');
            allChars = allChars.split('').filter(char => !excludeArray.includes(char)).join('');
        }
        
        if (allChars.length === 0) {
            throw new Error('No characters available after exclusions');
        }
        
        const password = [];
        
        charSets.forEach(charSet => {
            const filteredSet = excludeChars ? 
                charSet.split('').filter(char => !excludeChars.includes(char)).join('') : 
                charSet;
            if (filteredSet.length > 0) {
                password.push(this.getRandomChar(filteredSet));
            }
        });
        
        while (password.length < length) {
            password.push(this.getRandomChar(allChars));
        }
        
        return this.shuffleArray(password).join('');
    }

    getRandomChar(charSet) {
        const randomIndex = Math.floor(this.getSecureRandom() * charSet.length);
        return charSet[randomIndex];
    }

    getSecureRandom() {
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return array[0] / (0xffffffff + 1);
        }
        return Math.random();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(this.getSecureRandom() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateStrengthIndicator(password) {
        const strength = this.calculatePasswordStrength(password);
        
        this.strengthIndicator.className = 'strength-fill ' + strength.level;
        
        this.strengthText.textContent = `Strength: ${strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}`;
        
        const colors = {
            weak: '#ff6b6b',
            fair: '#ffa726',
            good: '#ffd54f',
            strong: '#66bb6a'
        };
        this.strengthText.style.color = colors[strength.level];
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const length = password.length;
        
        if (length >= 8) score += 1;
        if (length >= 12) score += 1;
        if (length >= 16) score += 1;
        if (length >= 20) score += 1;
        
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        let level;
        if (score <= 2) level = 'weak';
        else if (score <= 4) level = 'fair';
        else if (score <= 6) level = 'good';
        else level = 'strong';
        
        return { level, score };
    }

    async copyPassword() {
        try {
            const password = this.passwordOutput.value;
            if (!password) {
                this.showError('No password to copy');
                return;
            }
            
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(password);
            } else {
                this.passwordOutput.select();
                document.execCommand('copy');
            }
            
            this.showCopySuccess();
            
        } catch (error) {
            console.error('Error copying password:', error);
            this.showError('Failed to copy password');
        }
    }

    showCopySuccess() {
        const originalText = this.copyBtn.innerHTML;
        this.copyBtn.innerHTML = '<span class="copy-icon">✅</span>';
        this.copyBtn.classList.add('copy-success');
        
        setTimeout(() => {
            this.copyBtn.innerHTML = originalText;
            this.copyBtn.classList.remove('copy-success');
        }, 2000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 0.9rem;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    addToHistory(password) {
        const timestamp = new Date().toISOString();
        const entry = { password, timestamp };
        
        this.passwordHistory.unshift(entry);
        
        if (this.passwordHistory.length > 10) {
            this.passwordHistory = this.passwordHistory.slice(0, 10);
        }
        
        this.savePasswordHistory();
    }

    showPasswordHistory() {
        if (this.passwordHistory.length === 0) {
            this.showError('No password history available');
            return;
        }
        
        const historyText = this.passwordHistory
            .map((entry, index) => {
                const date = new Date(entry.timestamp).toLocaleString();
                return `${index + 1}. ${entry.password} (${date})`;
            })
            .join('\n');
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 12px;
            max-width: 400px;
            max-height: 300px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 0.9rem;
            white-space: pre-wrap;
        `;
        content.textContent = historyText;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', () => modal.remove());
    }

    loadSettings() {
        try {
            const settings = localStorage.getItem('passwordGeneratorSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.passwordLength.value = parsed.length || 16;
                this.lengthValue.textContent = this.passwordLength.value;
                this.uppercase.checked = parsed.uppercase !== false;
                this.lowercase.checked = parsed.lowercase !== false;
                this.numbers.checked = parsed.numbers !== false;
                this.symbols.checked = parsed.symbols !== false;
                this.excludeChars.value = parsed.excludeChars || '';
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                length: parseInt(this.passwordLength.value),
                uppercase: this.uppercase.checked,
                lowercase: this.lowercase.checked,
                numbers: this.numbers.checked,
                symbols: this.symbols.checked,
                excludeChars: this.excludeChars.value
            };
            localStorage.setItem('passwordGeneratorSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    loadPasswordHistory() {
        try {
            const history = localStorage.getItem('passwordHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error loading password history:', error);
            return [];
        }
    }

    savePasswordHistory() {
        try {
            localStorage.setItem('passwordHistory', JSON.stringify(this.passwordHistory));
        } catch (error) {
            console.error('Error saving password history:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
}); 