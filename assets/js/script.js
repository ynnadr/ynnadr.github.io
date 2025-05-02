// File: assets/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Fungsi sederhana untuk menyapa di console (opsional)
    console.log("Landing page script loaded successfully!");

    // Update tahun di footer secara otomatis
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Tambahkan fungsionalitas lain di sini jika diperlukan
    // Contoh: smooth scroll, animasi, dll.
});
