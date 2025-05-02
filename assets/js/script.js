// File: assets/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const languageSwitcher = document.querySelector('.language-switcher');
    const langFlags = document.querySelectorAll('.lang-flag');
    const htmlTag = document.documentElement; // Tag <html>
    const translatableElements = document.querySelectorAll('[data-translate]');
    const yearSpan = document.getElementById('year');

    let currentLanguage = 'id'; // Bahasa default
    let translations = {}; // Objek untuk menyimpan terjemahan yang dimuat

    // Fungsi untuk memuat file JSON bahasa
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json?v=${Date.now()}`); // Tambahkan cache buster
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            translations = await response.json();
            applyTranslations(lang);
            updateActiveFlag(lang);
            // Simpan bahasa terpilih di localStorage
            localStorage.setItem('preferredLanguage', lang);
        } catch (error) {
            console.error("Could not load language file:", error);
            // Mungkin tampilkan pesan error ke pengguna atau fallback ke bahasa default
            if (lang !== 'id') { // Coba fallback ke ID jika gagal load EN
               console.warn("Falling back to Indonesian (id).");
               loadLanguage('id');
            }
        }
    }

    // Fungsi untuk menerapkan terjemahan ke elemen HTML
    function applyTranslations(lang) {
        htmlTag.setAttribute('lang', lang); // Update atribut lang di <html>

        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                // Cek apakah elemen adalah input atau meta tag
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key]; // Ganti placeholder
                } else if (element.tagName === 'META' && element.name === 'description') {
                     element.content = translations[key]; // Ganti content meta description
                } else if (element.tagName === 'TITLE') {
                     document.title = translations[key]; // Ganti title dokumen
                }
                else {
                    // Gunakan textContent untuk keamanan, kecuali jika Anda *memang* perlu memasukkan HTML
                    element.textContent = translations[key];
                }
            } else {
                console.warn(`Translation key "${key}" not found for language "${lang}".`);
            }
        });

        // Update tahun di footer (jika ada)
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
            // Pastikan teks footer lainnya juga diupdate jika key-nya ada
             const footerGreeting = document.querySelector('footer [data-translate="hero_greeting"]');
             const footerRights = document.querySelector('footer [data-translate="footer_text"]');
             if (footerGreeting && translations.hero_greeting) footerGreeting.textContent = translations.hero_greeting;
             if (footerRights && translations.footer_text) footerRights.textContent = translations.footer_text;
        }
    }

    // Fungsi untuk menandai bendera yang aktif
    function updateActiveFlag(lang) {
        langFlags.forEach(flag => {
            if (flag.getAttribute('data-lang') === lang) {
                flag.classList.add('active-lang');
            } else {
                flag.classList.remove('active-lang');
            }
        });
    }

    // Event listener untuk tombol bendera
    languageSwitcher.addEventListener('click', (event) => {
        const clickedFlag = event.target.closest('.lang-flag');
        if (clickedFlag) {
            const selectedLang = clickedFlag.getAttribute('data-lang');
            if (selectedLang !== currentLanguage) {
                currentLanguage = selectedLang;
                loadLanguage(currentLanguage);
            }
        }
    });

    // Fungsi untuk mengatur bahasa awal saat halaman dimuat
    function setInitialLanguage() {
        const preferredLang = localStorage.getItem('preferredLanguage');
        const browserLang = navigator.language.split('-')[0]; // Ambil bagian awal (misal: 'en' dari 'en-US')

        if (preferredLang && (preferredLang === 'id' || preferredLang === 'en')) {
            currentLanguage = preferredLang;
        } else if (browserLang === 'en') {
             currentLanguage = 'en';
        } else {
            currentLanguage = 'id'; // Default ke Indonesia jika tidak ada preferensi atau browser bukan EN
        }
        loadLanguage(currentLanguage);
    }

    // --- INISIALISASI ---
    setInitialLanguage();

});
