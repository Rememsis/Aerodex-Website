const THEME_STORAGE_KEY = 'aerodexTheme';
const THEME_PRESET_STORAGE_KEY = 'aerodexThemePreset';
const THEME_ACCENT_STORAGE_KEY = 'aerodexThemeAccent';
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');

const THEME_PRESETS = {
    'midnight-tokyo': {
        label: 'Midnight Tokyo',
        mode: 'dark',
        bg: '#061018',
        surface: 'rgba(8, 12, 20, 0.82)',
        surfaceElevated: 'rgba(16, 22, 34, 0.92)',
        text: '#edf7ff',
        textMuted: 'rgba(237, 247, 255, 0.72)',
        accent: '#7fe9ff',
        accentStrong: '#59c5ff',
        border: 'rgba(255,255,255,0.12)',
        shadow: '0 38px 120px rgba(2, 6, 13, 0.42)',
        backgroundImage: "url('bg3.jpg'), radial-gradient(circle at top left, rgba(124, 85, 255, 0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(42, 211, 191, 0.12), transparent 28%), linear-gradient(180deg, rgba(5,8,21,0.16) 0%, rgba(7,16,37,0.14) 35%, rgba(12,22,48,0.18) 100%)"
    },
    'sunrise-beach': {
        label: 'Sunrise Beach',
        mode: 'light',
        bg: '#fff2e6',
        surface: 'rgba(255,255,255,0.7)',
        surfaceElevated: 'rgba(255,248,241,0.9)',
        text: '#1c1b24',
        textMuted: 'rgba(28, 27, 36, 0.74)',
        accent: '#ff8a65',
        accentStrong: '#ff6b57',
        border: 'rgba(76, 62, 49, 0.14)',
        shadow: '0 35px 100px rgba(241, 129, 79, 0.18)',
        backgroundImage: "radial-gradient(circle at top left, rgba(255, 210, 138, 0.8), transparent 20%), radial-gradient(circle at bottom right, rgba(255, 117, 106, 0.3), transparent 26%), linear-gradient(180deg, rgba(255,241,228,0.96) 0%, rgba(255,224,190,0.78) 100%)"
    },
    'violet-dusk': {
        label: 'Violet Dusk',
        mode: 'dark',
        bg: '#120d17',
        surface: 'rgba(27, 19, 38, 0.82)',
        surfaceElevated: 'rgba(35, 26, 49, 0.92)',
        text: '#f9f3ff',
        textMuted: 'rgba(249, 243, 255, 0.7)',
        accent: '#ba8cff',
        accentStrong: '#8b5cf6',
        border: 'rgba(255,255,255,0.12)',
        shadow: '0 36px 110px rgba(37, 22, 55, 0.38)',
        backgroundImage: "radial-gradient(circle at top left, rgba(165, 123, 255, 0.40), transparent 28%), radial-gradient(circle at bottom right, rgba(255, 129, 168, 0.22), transparent 28%), linear-gradient(180deg, rgba(18,13,23,0.9) 0%, rgba(28,18,38,0.92) 100%)"
    },
    'forest-mist': {
        label: 'Forest Mist',
        mode: 'dark',
        bg: '#091b18',
        surface: 'rgba(8, 27, 22, 0.8)',
        surfaceElevated: 'rgba(12, 32, 28, 0.9)',
        text: '#ecfff7',
        textMuted: 'rgba(236,255,247,0.72)',
        accent: '#6fe7c8',
        accentStrong: '#20c38b',
        border: 'rgba(255,255,255,0.12)',
        shadow: '0 30px 100px rgba(8, 52, 42, 0.3)',
        backgroundImage: "radial-gradient(circle at top left, rgba(70, 175, 130, 0.32), transparent 24%), radial-gradient(circle at bottom right, rgba(102, 194, 255, 0.22), transparent 28%), linear-gradient(180deg, rgba(9,27,24,0.95) 0%, rgba(18,48,44,0.9) 100%)"
    }
};

const isThemePreset = (value) => Object.prototype.hasOwnProperty.call(THEME_PRESETS, value);

const getSavedPreset = () => {
    try {
        const saved = window.localStorage.getItem(THEME_PRESET_STORAGE_KEY);
        return isThemePreset(saved) ? saved : 'midnight-tokyo';
    } catch (err) {
        return 'midnight-tokyo';
    }
};

const getSavedAccent = () => {
    try {
        const saved = window.localStorage.getItem(THEME_ACCENT_STORAGE_KEY);
        return /^#[0-9a-fA-F]{3,6}$/.test(saved || '') ? saved : null;
    } catch (err) {
        return null;
    }
};

const getInteractiveInk = (color) => {
    const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(color || '');
    if (!match) return '#f8fbff';
    const hex = match[1].length === 3
        ? match[1].split('').map((part) => part + part).join('')
        : match[1];
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    return (red * 299 + green * 587 + blue * 114) / 1000 > 155 ? '#101820' : '#f8fbff';
};

const getAccentStrong = (color) => {
    const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(color || '');
    if (!match) return color;
    const hex = match[1].length === 3
        ? match[1].split('').map((part) => part + part).join('')
        : match[1];
    const channels = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    const luminance = (channels[0] * 299 + channels[1] * 587 + channels[2] * 114) / 1000;
    const adjusted = channels.map((channel) => luminance > 160
        ? Math.round(channel * 0.72)
        : Math.round(channel + (255 - channel) * 0.38));
    return `#${adjusted.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

const getThemePreference = () => {
    try {
        const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
        return ['light', 'dark', 'system', ...Object.keys(THEME_PRESETS)].includes(saved) ? saved : 'midnight-tokyo';
    } catch (err) {
        return 'midnight-tokyo';
    }
};

let themePreference = getThemePreference();
let currentPreset = getSavedPreset();
let currentAccent = getSavedAccent();

const applyThemePalette = (presetKey = currentPreset, accent = currentAccent) => {
    const preset = THEME_PRESETS[presetKey] || THEME_PRESETS['midnight-tokyo'];
    const accentColor = accent || preset.accent;
    const normalizedAccent = /^#[0-9a-fA-F]{3,6}$/.test(accentColor || '') ? accentColor : preset.accent;
    const normalizedAccentStrong = accent ? getAccentStrong(normalizedAccent) : (preset.accentStrong || normalizedAccent);
    window.currentPreset = presetKey;
    window.currentAccent = normalizedAccent;

    document.documentElement.dataset.themePreset = presetKey;
    document.documentElement.dataset.theme = preset.mode;
    document.documentElement.style.colorScheme = preset.mode;
    document.documentElement.style.setProperty('--bg', preset.bg);
    document.documentElement.style.setProperty('--surface', preset.surface);
    document.documentElement.style.setProperty('--surface-elevated', preset.surfaceElevated);
    document.documentElement.style.setProperty('--text', preset.text);
    document.documentElement.style.setProperty('--text-muted', preset.textMuted);
    document.documentElement.style.setProperty('--accent', normalizedAccent);
    document.documentElement.style.setProperty('--accent-strong', normalizedAccentStrong);
    document.documentElement.style.setProperty('--accent-soft', `${normalizedAccent}22`);
    document.documentElement.style.setProperty('--studio-lime', normalizedAccent);
    document.documentElement.style.setProperty('--studio-ice', normalizedAccentStrong);
    document.documentElement.style.setProperty('--interactive-ink', getInteractiveInk(normalizedAccent));
    document.documentElement.style.setProperty('--border', preset.border);
    document.documentElement.style.setProperty('--card-border', preset.border);
    document.documentElement.style.setProperty('--shadow', preset.shadow);
    document.documentElement.style.setProperty('--cursor-glow-color', `${normalizedAccent}aa`);
    document.documentElement.style.setProperty('--cursor-glow-inner', `${normalizedAccent}55`);

    if (document.body) {
        document.body.style.backgroundImage = preset.backgroundImage;
        document.body.style.backgroundColor = preset.bg;
    }

    document.querySelectorAll('[data-theme-select]').forEach((select) => {
        select.value = 'custom';
    });

    const statusText = document.querySelector('[data-theme-status]');
    if (statusText) {
        statusText.textContent = preset.label;
    }
    const currentThemeText = document.querySelector('[data-theme-current]');
    if (currentThemeText) currentThemeText.textContent = preset.label;
    const accentInput = document.getElementById('siteAccentColor');
    if (accentInput) accentInput.value = normalizedAccent;

    const themeButtons = document.querySelectorAll('[data-theme-preset]');
    themeButtons.forEach((button) => {
        const isActive = button.dataset.themePreset === presetKey;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
};

window.applyThemePalette = applyThemePalette;

const applyThemePreference = () => {
    if (isThemePreset(themePreference)) {
        currentPreset = themePreference;
        applyThemePalette(currentPreset, currentAccent);
        return;
    }

    const resolvedTheme = themePreference === 'system'
        ? (themeMediaQuery.matches ? 'light' : 'dark')
        : themePreference;
    window.currentPreset = themePreference;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    document.documentElement.dataset.themePreset = 'system';
    const basicPalette = resolvedTheme === 'light'
        ? {
            bg: '#f3f6f3', surface: 'rgba(255,255,255,0.82)', surfaceElevated: '#ffffff',
            text: '#17251e', textMuted: 'rgba(23,37,30,0.7)', accent: '#187986',
            accentStrong: '#4d7527', accentSoft: 'rgba(24,121,134,0.14)',
            border: 'rgba(30,53,43,0.16)', cardBorder: 'rgba(30,53,43,0.12)',
            shadow: '0 18px 48px rgba(31,54,42,0.12)'
        }
        : {
            bg: '#061018', surface: 'rgba(7,11,19,0.78)', surfaceElevated: 'rgba(12,16,30,0.92)',
            text: '#f8fbff', textMuted: 'rgba(248,251,255,0.72)', accent: '#9fd2fc',
            accentStrong: '#2dd4bf', accentSoft: 'rgba(125,225,255,0.18)',
            border: 'rgba(255,255,255,0.12)', cardBorder: 'rgba(255,255,255,0.08)',
            shadow: '0 36px 110px rgba(0,0,0,0.24)'
        };
    document.documentElement.style.setProperty('--bg', basicPalette.bg);
    document.documentElement.style.setProperty('--surface', basicPalette.surface);
    document.documentElement.style.setProperty('--surface-elevated', basicPalette.surfaceElevated);
    document.documentElement.style.setProperty('--text', basicPalette.text);
    document.documentElement.style.setProperty('--text-muted', basicPalette.textMuted);
    const basicAccent = currentAccent || basicPalette.accent;
    window.currentAccent = basicAccent;
    document.documentElement.style.setProperty('--accent', basicAccent);
    const basicAccentStrong = currentAccent ? getAccentStrong(basicAccent) : basicPalette.accentStrong;
    document.documentElement.style.setProperty('--accent-strong', basicAccentStrong);
    document.documentElement.style.setProperty('--accent-soft', currentAccent ? `${basicAccent}22` : basicPalette.accentSoft);
    document.documentElement.style.setProperty('--studio-lime', basicAccent);
    document.documentElement.style.setProperty('--studio-ice', basicAccentStrong);
    document.documentElement.style.setProperty('--interactive-ink', getInteractiveInk(basicAccent));
    document.documentElement.style.setProperty('--border', basicPalette.border);
    document.documentElement.style.setProperty('--card-border', basicPalette.cardBorder);
    document.documentElement.style.setProperty('--shadow', basicPalette.shadow);
    document.documentElement.style.setProperty('--cursor-glow-color', `${basicAccent}aa`);
    document.documentElement.style.setProperty('--cursor-glow-inner', `${basicAccent}55`);
    if (document.body) {
        document.body.style.removeProperty('background-image');
        document.body.style.removeProperty('background-color');
    }
    document.querySelectorAll('.theme-choice[data-theme-preset]').forEach((button) => {
        button.classList.remove('is-active');
        button.setAttribute('aria-pressed', 'false');
    });
    const currentThemeText = document.querySelector('[data-theme-current]');
    if (currentThemeText) {
        currentThemeText.textContent = themePreference === 'system' ? 'System' : `${resolvedTheme[0].toUpperCase()}${resolvedTheme.slice(1)}`;
    }
    const accentInput = document.getElementById('siteAccentColor');
    if (accentInput) accentInput.value = basicAccent;
    document.querySelectorAll('[data-theme-select]').forEach((select) => {
        select.value = themePreference;
    });
};

applyThemePreference();
window.applyThemeAccent = (accent) => {
    if (!/^#[0-9a-fA-F]{3,6}$/.test(accent || '')) return;
    currentAccent = accent;
    if (isThemePreset(themePreference)) {
        applyThemePalette(currentPreset, currentAccent);
    } else {
        applyThemePreference();
    }
};
themeMediaQuery.addEventListener('change', () => {
    if (themePreference === 'system') applyThemePreference();
});
window.addEventListener('storage', (event) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    themePreference = ['light', 'dark', 'system', ...Object.keys(THEME_PRESETS)].includes(event.newValue) ? event.newValue : 'midnight-tokyo';
    applyThemePreference();
});

window.addEventListener('storage', (event) => {
    if (event.key === THEME_PRESET_STORAGE_KEY) {
        currentPreset = getSavedPreset();
        themePreference = currentPreset;
        applyThemePalette(currentPreset, currentAccent);
    }
    if (event.key === THEME_ACCENT_STORAGE_KEY) {
        currentAccent = getSavedAccent();
        if (isThemePreset(themePreference)) applyThemePalette(currentPreset, currentAccent);
    }
});

const initThemeSelectors = () => {
    document.querySelectorAll('[data-theme-select]').forEach((select) => {
        select.value = isThemePreset(themePreference) ? 'custom' : themePreference;
        select.addEventListener('change', () => {
            themePreference = select.value;
            if (isThemePreset(themePreference)) {
                currentPreset = themePreference;
                try {
                    window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, currentPreset);
                    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
                } catch (err) {
                }
                applyThemePalette(currentPreset, currentAccent);
                return;
            }
            try {
                window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
            } catch (err) {
            }
            applyThemePreference();
        });
    });

    document.querySelectorAll('.theme-choice[data-theme-preset]').forEach((button) => {
        button.addEventListener('click', () => {
            const preset = button.dataset.themePreset;
            if (!isThemePreset(preset)) return;
            currentPreset = preset;
            themePreference = preset;
            try {
                window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, preset);
                window.localStorage.setItem(THEME_STORAGE_KEY, preset);
                window.localStorage.removeItem(THEME_ACCENT_STORAGE_KEY);
            } catch (err) {
            }
            currentAccent = null;
            applyThemePalette(currentPreset, currentAccent);
        });
    });

    const resetThemeButton = document.getElementById('resetSiteTheme');
    resetThemeButton?.addEventListener('click', () => {
        currentPreset = 'midnight-tokyo';
        currentAccent = null;
        themePreference = currentPreset;
        try {
            window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, currentPreset);
            window.localStorage.setItem(THEME_STORAGE_KEY, currentPreset);
            window.localStorage.removeItem(THEME_ACCENT_STORAGE_KEY);
        } catch (err) {
        }
        applyThemePalette(currentPreset, currentAccent);
    });

};

const initCheckoutFlow = () => {
    const checkoutModal = document.getElementById('checkout-modal');
    if (!checkoutModal || checkoutModal.dataset.initialized === 'true') return;

    const checkoutClose = document.getElementById('checkout-close');
    const checkoutCancel = document.getElementById('cancel-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemName = document.getElementById('checkout-item-name');
    const checkoutItemDescription = document.getElementById('checkout-item-description');
    const checkoutPrice = document.getElementById('checkout-price');
    const checkoutRobux = document.getElementById('checkout-robux');
    const checkoutStatus = document.getElementById('checkout-status');

    const openCheckout = (button) => {
        if (!checkoutModal || !button) return;
        const card = button.closest('.gamepass-card');
        const title = card?.querySelector('h4')?.textContent?.trim() || 'Selected item';
        const description = card?.querySelector('p')?.textContent?.trim() || 'Premium asset from AeroDex Games.';
        const priceText = card?.querySelector('.gamepass-price')?.textContent?.trim() || '$0.00';
        const robuxText = priceText.includes('/') ? priceText.split('/')[1].trim() : '0 robux';

        checkoutItemName.textContent = title;
        checkoutItemDescription.textContent = description;
        checkoutPrice.textContent = priceText.split('/')[0].trim();
        checkoutRobux.textContent = robuxText;
        checkoutStatus.textContent = 'Thanks for supporting AeroDex Games. Fill in your details and complete the purchase.';
        checkoutStatus.className = 'checkout-status';
        checkoutModal.classList.add('visible');
        checkoutModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('checkout-open');
    };

    const closeCheckout = () => {
        if (!checkoutModal) return;
        checkoutModal.classList.remove('visible');
        checkoutModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('checkout-open');
        if (checkoutForm) checkoutForm.reset();
        if (checkoutStatus) {
            checkoutStatus.textContent = 'Choose an item and confirm your details.';
            checkoutStatus.className = 'checkout-status';
        }
    };

    document.addEventListener('click', (event) => {
        const button = event.target.closest('.gamepass-card .btn');
        if (button) {
            event.preventDefault();
            event.stopPropagation();
            openCheckout(button);
        }
    });

    checkoutClose?.addEventListener('click', closeCheckout);
    checkoutCancel?.addEventListener('click', closeCheckout);
    checkoutModal?.addEventListener('click', (event) => {
        if (event.target === checkoutModal) {
            closeCheckout();
        }
    });

    checkoutForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const submitButton = checkoutForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
        }

        window.setTimeout(() => {
            if (checkoutStatus) {
                checkoutStatus.textContent = 'Purchase request received. Your order will be reviewed shortly.';
                checkoutStatus.className = 'checkout-status success';
            }
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Complete Purchase';
            }
        }, 900);
    });

    checkoutModal.dataset.initialized = 'true';
};

initCheckoutFlow();

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');
    const header = document.querySelector('header');
    const robloxSignedIn = document.querySelector('.roblox-signed-in');
    initThemeSelectors();

    const createPageLoader = () => {
        if (document.getElementById('page-loader')) return;
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="page-loader__spinner">
                <div class="page-loader__ring"></div>
                <div class="page-loader__ring"></div>
                <div class="page-loader__ring"></div>
                <div class="page-loader__orb"></div>
            </div>
            <p class="page-loader__text">Loading</p>
        `;
        document.body.appendChild(loader);
    };

    const showPageLoader = () => {
        document.body.classList.add('page-loading');
        const loader = document.getElementById('page-loader');
        if (!loader) return;
        loader.style.display = 'flex';
        loader.classList.remove('fading-out');
        window.requestAnimationFrame(() => loader.classList.add('visible'));
    };

    const hidePageLoader = () => {
        document.body.classList.remove('page-loading');
        const loader = document.getElementById('page-loader');
        if (!loader) return;
        loader.classList.remove('visible');
        loader.classList.add('fading-out');
        window.setTimeout(() => {
            loader.classList.remove('fading-out');
            loader.style.display = 'none';
        }, 420);
    };

    const setupLinkTransitions = () => {
        const internalLinks = Array.from(document.querySelectorAll('a[href]'))
            .filter(link => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
                if (link.target === '_blank') return false;
                try {
                    const url = new URL(href, window.location.href);
                    return url.origin === window.location.origin;
                } catch (err) {
                    return false;
                }
            });

        internalLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (!href) return;
                const url = new URL(href, window.location.href);
                if (url.href === window.location.href) return;
                event.preventDefault();
                showPageLoader();
                document.body.classList.add('page-exit');
                window.setTimeout(() => {
                    window.location.href = url.href;
                }, 550);
            });
        });
    };

    const setupScrollReveal = () => {
        const revealSelectors = ['header', 'main', 'main > *', '.welcome', '.slideshow-container', '.sometext', '.information', '.information2', '.feature-grid', '.feature-grid div', '.gamepass-grid', '.gamepass-card', '.wrapper', '.profile-card', '.roblox-signed-in', '.more-content', '.navigation a', '.Logo', '.site-footer > *'];
        const revealElements = revealSelectors
            .flatMap(selector => Array.from(document.querySelectorAll(selector)))
            .filter((el, index, self) => self.indexOf(el) === index);

        if (!revealElements.length) return;

        revealElements.forEach(el => el.classList.add('reveal'));

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            revealElements.forEach(el => observer.observe(el));
        } else {
            revealElements.forEach((el, index) => {
                window.setTimeout(() => el.classList.add('active'), index * 120);
            });
        }
    };

    const setupScrollParallax = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const layers = [
            { selector: 'main > .welcome, main > .slideshow-container', speed: 0.1 },
            { selector: 'main > .sometext, main > .information, main > .information2, main > .feature-grid, main > .gamepass-grid, main > .wrapper, main > .profile-card, main > .roblox-signed-in, .profile-hero, .auth-hero, .legal-page, .games-grid-section, .gamepass-grid-section, .more-content, .customizer-shell, .site-footer', speed: 0.06 },
            { selector: '.feature-grid > div, .gamepass-card, .game-card', speed: 0.035 },
            { selector: '.game-card .game-header', speed: 0.085 }
        ];
        const elements = [];

        layers.forEach(({ selector, speed }) => {
            document.querySelectorAll(selector).forEach((element) => {
                if (element.dataset.parallaxReady) return;
                element.dataset.parallaxReady = 'true';
                element.dataset.parallaxSpeed = String(speed);
                element.classList.add('parallax-layer');
                elements.push(element);
            });
        });

        if (!elements.length) return;

        let frameScheduled = false;
        const updateParallax = () => {
            const viewportCenter = window.innerHeight * 0.5;
            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const speed = Number(element.dataset.parallaxSpeed) || 0;
                const offset = Math.max(-56, Math.min(56, (viewportCenter - (rect.top + rect.height * 0.5)) * speed));
                element.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
            });
            frameScheduled = false;
        };

        const scheduleParallaxUpdate = () => {
            if (frameScheduled) return;
            frameScheduled = true;
            window.requestAnimationFrame(updateParallax);
        };

        window.addEventListener('scroll', scheduleParallaxUpdate, { passive: true });
        window.addEventListener('resize', scheduleParallaxUpdate, { passive: true });
        scheduleParallaxUpdate();
    };

    const setupTypedHero = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const welcome = document.querySelector('.welcome');
        if (!welcome || welcome.dataset.typedInitialized) return;
        const fullText = welcome.textContent.trim();
        if (!fullText) return;

        welcome.textContent = '';
        const typedSpan = document.createElement('span');
        typedSpan.className = 'typed-text';
        const cursor = document.createElement('span');
        cursor.className = 'typed-cursor';

        welcome.appendChild(typedSpan);
        welcome.appendChild(cursor);
        welcome.dataset.typedInitialized = '1';

        let currentIndex = 0;
        const typeNext = () => {
            if (currentIndex < fullText.length) {
                typedSpan.textContent += fullText[currentIndex];
                currentIndex += 1;
                const delay = fullText[currentIndex - 1] === ' ' ? 60 : 45;
                window.setTimeout(typeNext, delay);
            }
        };

        window.setTimeout(typeNext, 280);
    };

    const initPageAnimations = () => {
        createPageLoader();
        hidePageLoader();
        const cursorGlow = document.getElementById('aerodex-cursor-glow') || (() => {
            const glow = document.createElement('div');
            glow.id = 'aerodex-cursor-glow';
            glow.style.opacity = '0';
            glow.style.left = '50vw';
            glow.style.top = '50vh';
            glow.style.transform = 'translate3d(-50%, -50%, 0)';
            document.body.appendChild(glow);
            return glow;
        })();
        const floatingCursorEnabled = getStoredCursorEnabled();
        window.applyCursorGlowSettings = window.applyCursorGlowSettings || ((colorValue, isEnabled = getStoredCursorEnabled()) => {
            const fallback = '#7fe9ff';
            const safeColor = /^#[0-9a-fA-F]{3,6}$/.test(colorValue || '') ? colorValue : fallback;
            document.documentElement.style.setProperty('--cursor-glow-color', hexToRgba(safeColor, 0.55));
            document.documentElement.style.setProperty('--cursor-glow-inner', hexToRgba(safeColor, 0.28));
            const cursorGlow = document.getElementById('aerodex-cursor-glow');
            if (cursorGlow) {
                cursorGlow.style.background = `radial-gradient(circle, ${hexToRgba(safeColor, 0.55)}, ${hexToRgba(safeColor, 0.28)} 35%, transparent 70%)`;
                cursorGlow.style.opacity = isEnabled ? '0.85' : '0';
            }
            try {
                window.localStorage.setItem('aerodexCursorColor', safeColor);
                window.localStorage.setItem('aerodexCursorEnabled', String(!!isEnabled));
            } catch (err) {
                // Ignore storage errors in restricted contexts.
            }
            return safeColor;
        });
        window.applyCursorGlowSettings(getStoredCursorColor(), floatingCursorEnabled);
        // Start page at opacity 0
        document.body.style.opacity = '0';
        document.body.classList.remove('page-exit');
        // Fade in page and loader fades out simultaneously (no gap)
        window.requestAnimationFrame(() => {
            document.body.style.opacity = '1';
            window.requestAnimationFrame(() => document.body.classList.add('page-loaded'));
        });
        setupLinkTransitions();
        setupScrollReveal();
        setupScrollParallax();
        let scrollUpdateScheduled = false;
        const updateScrollState = () => {
            const isScrolled = window.scrollY > 30;
            const scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const scrollProgress = scrollableHeight ? Math.min(1, window.scrollY / scrollableHeight) : 0;
            header?.classList.toggle('scrolled', isScrolled);
            document.body.classList.toggle('scrolling', isScrolled);
            document.documentElement.style.setProperty('--scroll-offset', `${window.scrollY}px`);
            document.documentElement.style.setProperty('--nav-scroll-progress', String(scrollProgress));
            scrollUpdateScheduled = false;
        };

        const scheduleScrollStateUpdate = () => {
            if (!scrollUpdateScheduled) {
                scrollUpdateScheduled = true;
                window.requestAnimationFrame(updateScrollState);
            }
        };

        window.addEventListener('scroll', scheduleScrollStateUpdate, { passive: true });
        window.addEventListener('resize', scheduleScrollStateUpdate, { passive: true });
        updateScrollState();

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            let pointerUpdateScheduled = false;
            let pointerX = 0;
            let pointerY = 0;
            let floatingCursorState = floatingCursorEnabled;
            const updatePointerMotion = () => {
                const glowPaddingX = 140;
                const glowPaddingY = 140;
                const safePointerX = Math.min(Math.max(pointerX, glowPaddingX), Math.max(glowPaddingX, window.innerWidth - glowPaddingX));
                const safePointerY = Math.min(Math.max(pointerY, glowPaddingY), Math.max(glowPaddingY, window.innerHeight - glowPaddingY));
                const offsetX = (safePointerX / window.innerWidth - 0.5) * 36;
                const offsetY = (safePointerY / window.innerHeight - 0.5) * 36;
                document.documentElement.style.setProperty('--bg-offset-x', `${offsetX}px`);
                document.documentElement.style.setProperty('--bg-offset-y', `${offsetY}px`);
                document.documentElement.style.setProperty('--particle-offset-x', `${-offsetX * 0.55}px`);
                document.documentElement.style.setProperty('--particle-offset-y', `${-offsetY * 0.55}px`);
                if (cursorGlow) {
                    cursorGlow.style.left = `${safePointerX}px`;
                    cursorGlow.style.top = `${safePointerY}px`;
                    cursorGlow.style.opacity = floatingCursorState ? '0.85' : '0';
                }
                pointerUpdateScheduled = false;
            };

            const setFloatingCursorState = (enabled) => {
                floatingCursorState = !!enabled;
                if (cursorGlow) {
                    cursorGlow.style.opacity = floatingCursorState ? '0.85' : '0';
                }
            };

            window.addEventListener('mousemove', (event) => {
                if (!floatingCursorState) return;
                pointerX = Math.min(Math.max(event.clientX, 0), window.innerWidth);
                pointerY = Math.min(Math.max(event.clientY, 0), window.innerHeight);
                if (!pointerUpdateScheduled) {
                    pointerUpdateScheduled = true;
                    window.requestAnimationFrame(updatePointerMotion);
                }
            }, { passive: true });
            window.addEventListener('mouseleave', () => {
                if (cursorGlow) cursorGlow.style.opacity = '0';
            });
            window.addEventListener('blur', () => {
                if (cursorGlow) cursorGlow.style.opacity = '0';
            });
            window.addEventListener('storage', (event) => {
                if (event.key === 'aerodexCursorEnabled') {
                    setFloatingCursorState(event.newValue !== 'false');
                }
            });
        }
    };

    const hexToRgba = (hex, alpha) => {
        const clean = hex.replace('#', '');
        const normalized = clean.length === 3
            ? clean.split('').map(char => char + char).join('')
            : clean;
        const bigint = parseInt(normalized, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getStoredCursorEnabled = () => {
        try {
            const stored = window.localStorage.getItem('aerodexCursorEnabled');
            if (stored === null) return true;
            return stored === 'true';
        } catch (err) {
            return true;
        }
    };

    const getStoredCursorBrightness = () => {
        try {
            const stored = Number(window.localStorage.getItem('aerodexCursorBrightness'));
            if (!Number.isFinite(stored)) return 100;
            return Math.min(100, Math.max(20, stored));
        } catch (err) {
            return 100;
        }
    };

    const applyCursorGlowSettings = (colorValue, isEnabled = getStoredCursorEnabled(), brightnessPercent = getStoredCursorBrightness()) => {
        const fallback = '#7fe9ff';
        const safeColor = /^#[0-9a-fA-F]{3,6}$/.test(colorValue || '') ? colorValue : fallback;
        const brightnessRatio = Math.max(0.2, brightnessPercent / 100);
        const glowColorAlpha = 0.55 * brightnessRatio;
        const glowInnerAlpha = 0.28 * brightnessRatio;
        document.documentElement.style.setProperty('--cursor-glow-color', hexToRgba(safeColor, glowColorAlpha));
        document.documentElement.style.setProperty('--cursor-glow-inner', hexToRgba(safeColor, glowInnerAlpha));
        const cursorGlow = document.getElementById('aerodex-cursor-glow');
        if (cursorGlow) {
            cursorGlow.style.background = `radial-gradient(circle, ${hexToRgba(safeColor, glowColorAlpha)}, ${hexToRgba(safeColor, glowInnerAlpha)} 35%, transparent 70%)`;
            cursorGlow.style.opacity = isEnabled ? '0.85' : '0';
        }
        try {
            window.localStorage.setItem('aerodexCursorColor', safeColor);
            window.localStorage.setItem('aerodexCursorEnabled', String(!!isEnabled));
            window.localStorage.setItem('aerodexCursorBrightness', String(brightnessPercent));
        } catch (err) {
            // Ignore storage access errors in restricted or private contexts.
        }
        return safeColor;
    };

    const getStoredCursorColor = () => {
        try {
            const saved = window.localStorage.getItem('aerodexCursorColor');
            if (saved && /^#[0-9a-fA-F]{3,6}$/.test(saved)) return saved;
        } catch (err) {
            // Ignore storage access errors in restricted or private contexts.
        }
        return '#7fe9ff';
    };

    window.applyCursorGlowSettings = applyCursorGlowSettings;
    window.getStoredCursorColor = getStoredCursorColor;

    const setCookie = (name, value, days) => {
        const encodedName = encodeURIComponent(name);
        const encodedValue = encodeURIComponent(value);
        let cookieText = `${encodedName}=${encodedValue}; Path=/; SameSite=Lax`;
        if (typeof days === 'number') {
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            cookieText += `; Expires=${expires.toUTCString()}`;
        }
        document.cookie = cookieText;
    };

    const getCookie = (name) => {
        const encodedName = encodeURIComponent(name) + '=';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(encodedName) === 0) {
                return decodeURIComponent(cookie.substring(encodedName.length));
            }
        }
        return null;
    };

    const deleteCookie = (name) => {
        setCookie(name, '', -1);
    };

    const usernameFromEmail = (email) => {
        if (!email) return '';
        return email.split('@')[0].trim() || email;
    };

    const isUserLoggedIn = () => {
        return getCookie('asparkLoggedIn') === '1' || getCookie('robloxAuth') === '1' || window.localStorage.getItem('asparkUsername') !== null;
    };

    const getStoredUsername = () => {
        return getCookie('asparkUsername') || window.localStorage.getItem('asparkUsername');
    };

    const setLoginState = (usernameValue, days) => {
        setCookie('asparkUsername', usernameValue, days);
        setCookie('asparkLoggedIn', '1', days);
        window.localStorage.setItem('asparkUsername', usernameValue);
    };

    const clearLoginState = () => {
        deleteCookie('asparkUsername');
        deleteCookie('asparkLoggedIn');
        deleteCookie('robloxAuth');
        window.localStorage.removeItem('asparkUsername');
    };

    let logoutVisible = false;

    const renderAccountMenu = () => {
        if (!navLogin) return null;
        let menu = document.getElementById('nav-account-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'nav-account-menu';
            menu.className = 'nav-account-menu';
            const profileLink = document.createElement('a');
            profileLink.id = 'nav-profile';
            profileLink.href = '/profile.html';
            profileLink.textContent = 'Profile';
            menu.appendChild(profileLink);
            const logoutLink = document.createElement('a');
            logoutLink.id = 'nav-logout';
            logoutLink.href = '/logout';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                clearLoginState();
                window.location.href = '/logout';
            });
            menu.appendChild(logoutLink);
            navLogin.insertAdjacentElement('afterend', menu);
        }
        return menu;
    };

    const showAccountMenu = () => {
        const menu = renderAccountMenu();
        if (menu) {
            menu.classList.add('visible');
            logoutVisible = true;
        }
    };

    const hideAccountMenu = () => {
        const menu = document.getElementById('nav-account-menu');
        if (menu) {
            menu.classList.remove('visible');
        }
        logoutVisible = false;
    };

    const attachAccountClick = () => {
        if (!navLogin || navLogin.dataset.accountClickAttached === '1') return;
        navLogin.addEventListener('click', (event) => {
            event.preventDefault();
            if (logoutVisible) {
                hideAccountMenu();
            } else {
                showAccountMenu();
            }
        });
        document.addEventListener('click', (event) => {
            const menu = document.getElementById('nav-account-menu');
            if (!menu || !logoutVisible) return;
            if (navLogin.contains(event.target) || menu.contains(event.target)) return;
            hideAccountMenu();
        });
        navLogin.dataset.accountClickAttached = '1';
    };

    const applyUsername = (name) => {
        if (!navLogin || !name) return;
        navLogin.removeAttribute('href');
        navLogin.textContent = name;
        navLogin.classList.add('btnLogin-popup');
        navLogin.style.pointerEvents = 'auto';
        navLogin.style.cursor = 'pointer';
        hideAccountMenu();
        attachAccountClick();
    };

    const applyLoggedOut = () => {
        if (!navLogin) return;
        hideAccountMenu();
        navLogin.href = 'roblox-auth.html';
        navLogin.textContent = 'Login';
        navLogin.classList.add('btnLogin-popup');
        navLogin.style.pointerEvents = 'auto';
        navLogin.style.cursor = 'pointer';
    };

    const params = new URLSearchParams(window.location.search);
    const robloxAuthLink = document.getElementById('roblox-auth-link');
    if (robloxAuthLink) {
        const returnUrl = params.get('returnUrl') || '/index.html';
        if (!robloxAuthLink.getAttribute('href')?.startsWith('/auth/roblox')) { robloxAuthLink.href = `roblox-auth.html?returnUrl=${encodeURIComponent(returnUrl)}`; }
    }
    const username = params.get('username');
    const loggedIn = params.get('loggedIn');
    let navLogin = document.getElementById('nav-login');
    if (!navLogin) {
        navLogin = Array.from(document.querySelectorAll('nav.navigation a')).find(a => {
            const href = (a.getAttribute('href') || '').trim();
            return a.textContent.trim() === 'Login' || href === 'login.html' || href === '/login.html' || href.endsWith('/login.html');
        });
    }

    const loginForm = document.querySelector('.form-box.login form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Skip email login and go directly to Roblox authenticator
            const returnUrl = params.get('returnUrl') || '/index.html';
            window.location.href = `/auth/roblox?returnUrl=${encodeURIComponent(returnUrl)}`;
        });
    }

    const initMobileNavToggle = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav.navigation');
        if (!header || !nav || document.querySelector('.mobile-nav-toggle')) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'mobile-nav-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'site-navigation');
        toggle.setAttribute('aria-label', 'Toggle navigation menu');

        if (!nav.id) {
            nav.id = 'site-navigation';
        }

        const bar = document.createElement('span');
        toggle.appendChild(bar);
        header.insertBefore(toggle, nav);

        const closeMobileNav = () => {
            header.classList.remove('mobile-nav-open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        const openMobileNav = () => {
            header.classList.add('mobile-nav-open');
            toggle.setAttribute('aria-expanded', 'true');
        };

        toggle.addEventListener('click', () => {
            if (header.classList.contains('mobile-nav-open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        document.addEventListener('click', (event) => {
            if (!header.classList.contains('mobile-nav-open')) return;
            if (header.contains(event.target)) return;
            closeMobileNav();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1080) {
                closeMobileNav();
            }
        });

        const closeOnMobileScroll = () => {
            if (window.innerWidth <= 860 && header.classList.contains('mobile-nav-open')) {
                closeMobileNav();
            }
        };

        window.addEventListener('scroll', closeOnMobileScroll, { passive: true });
        window.addEventListener('touchmove', closeOnMobileScroll, { passive: true });
        window.addEventListener('wheel', closeOnMobileScroll, { passive: true });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1080) {
                    closeMobileNav();
                }
            });
        });
    };

    initMobileNavToggle();

    const addFooterVersion = () => {
        document.querySelectorAll('.site-footer .footer-copy').forEach((footerCopy) => {
            if (footerCopy.querySelector('.footer-version')) return;
            const version = document.createElement('a');
            version.className = 'footer-version';
            version.href = 'updates.html';
            version.textContent = 'Version 2.0';
            version.setAttribute('aria-label', 'View the updates page');
            footerCopy.append(' ', version);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addFooterVersion, { once: true });
    } else {
        addFooterVersion();
    }

    const loggedInCookie = isUserLoggedIn();
    const storedUsername = loggedInCookie ? getStoredUsername() : null;
    if (!loggedInCookie) {
        window.localStorage.removeItem('asparkUsername');
    }

    if (loggedIn === 'roblox' && username) {
        setCookie('robloxAuth', '1', 30);
        setLoginState(username, 30);
        applyUsername(username);
    } else if (loggedInCookie && storedUsername) {
        applyUsername(storedUsername);
    } else if (loggedInCookie) {
        applyUsername('Account');
    } else {
        applyLoggedOut();
    }

    if (loggedIn === 'roblox' && robloxSignedIn && wrapper) {
        wrapper.style.display = 'none';
        robloxSignedIn.style.display = 'block';

        if (username) {
            const message = robloxSignedIn.querySelector('p');
            if (message) {
                message.textContent = `Welcome back, ${username}! Your Roblox account is connected to the site.`;
            }
        }
    }

    initPageAnimations();

    let slideIndex = 0;
    let slideTimer;

    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');

    function showSlides(n) {
        if (!slides.length || !dots.length) return;

        if (n !== undefined) slideIndex = n;

        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;

        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
            dots[i].classList.remove('active-dot');
        }

        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active-dot');

        clearTimeout(slideTimer);
        slideTimer = setTimeout(() => {
            slideIndex += 1;
            showSlides();
        }, 5000);
    }

    window.plusSlides = function(n) {
        slideIndex += n;
        showSlides(slideIndex);
    };

    window.currentSlide = function(n) {
        slideIndex = n - 1;
        showSlides(slideIndex);
    };

    if (slides.length && dots.length) {
        showSlides();
    }
});

// =========================================================
// Modern AeroDex loading screen and page transitions
// =========================================================
(() => {
    const ensureLoader = () => {
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.setAttribute('aria-live', 'polite');
            loader.setAttribute('aria-label', 'Loading AeroDex Games');
            loader.innerHTML = `
                <div class="loader-card">
                    <div class="loader-orb-wrap" aria-hidden="true">
                        <span class="loader-orb loader-orb-one"></span>
                        <span class="loader-orb loader-orb-two"></span>
                        <span class="loader-orb loader-orb-three"></span>
                    </div>
                    <p class="loader-kicker">AeroDex Games</p>
                    <h1>Loading Experience</h1>
                    <div class="loader-progress" aria-hidden="true"><span></span></div>
                    <p class="loader-status">Preparing assets...</p>
                </div>`;
            document.body.prepend(loader);
        }
        return loader;
    };

    const hideLoader = () => {
        const loader = ensureLoader();
        window.setTimeout(() => {
            loader.classList.add('is-hidden');
            document.body.classList.remove('page-transitioning');
        }, 420);
    };

    const showLoader = () => {
        const loader = ensureLoader();
        loader.classList.remove('is-hidden');
        document.body.classList.add('page-transitioning');
    };

    document.addEventListener('DOMContentLoaded', () => {
        ensureLoader();

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (link.target === '_blank' || link.hasAttribute('download')) return;

            let url;
            try {
                url = new URL(href, window.location.href);
            } catch (_) {
                return;
            }

            if (url.origin !== window.location.origin || url.href === window.location.href) return;

            event.preventDefault();
            showLoader();
            document.body.classList.add('page-exiting');
            window.setTimeout(() => {
                window.location.href = url.href;
            }, 360);
        }, true);
    });

    window.addEventListener('load', hideLoader);
    window.addEventListener('pageshow', hideLoader);
})();



// loaderForceHideNetlify: safety fallback for static Netlify deploys
(function () {
  const hide = () => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
    document.body.classList.add('page-loaded');
  };
  window.addEventListener('load', () => setTimeout(hide, 350));
  setTimeout(hide, 2500);
})();


/* ===== Loader unstuck safety patch ===== */
(function () {
  function hideAeroDexLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('hidden');
    loader.classList.add('is-hidden');
    document.body.classList.add('page-loaded');
    document.body.classList.remove('page-transitioning');
    document.body.classList.remove('page-exiting');
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(hideAeroDexLoader, 350);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(hideAeroDexLoader, 700);
  });

  window.addEventListener('load', function () {
    setTimeout(hideAeroDexLoader, 350);
  });

  window.addEventListener('pageshow', function () {
    setTimeout(hideAeroDexLoader, 250);
  });

  // Final fallback: prevents a stuck loading screen even if an image or script fails.
  setTimeout(hideAeroDexLoader, 2200);
})();
