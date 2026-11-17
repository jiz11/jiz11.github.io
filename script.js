document.addEventListener('DOMContentLoaded', function () {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    setupMobileMenu();
    setupSmoothScroll();
    loadHonors();
    loadPublications();
});

function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Update active link state
                document.querySelectorAll('.academic-nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function getDataPath(fileName) {
    return window.location.pathname.includes('/pages/') ? `../data/${fileName}` : `data/${fileName}`;
}

function getTagIcon(text) {
    const lower = String(text || '').toLowerCase();
    if (lower.includes('pdf') || lower.includes('paper')) return 'far fa-file-pdf';
    if (lower.includes('code') || lower.includes('github')) return 'fab fa-github';
    if (lower.includes('doi') || lower.includes('link')) return 'fas fa-external-link-alt';
    if (lower.includes('slide')) return 'far fa-file-powerpoint';
    if (lower.includes('data') || lower.includes('dataset')) return 'fas fa-database';
    return 'fas fa-link';
}

function loadHonors() {
    const container = document.getElementById('honors-container');
    if (!container) return;

    fetch(getDataPath('honors.json'))
        .then(res => res.json())
        .then(items => {
            container.innerHTML = items.slice(0, 6).map(item => `
                <div class="honor-item-row">
                    <div>
                        <span class="font-medium text-slate-800">${item.title}</span>
                        ${item.org ? `<span class="text-xs text-slate-500 block sm:inline sm:ml-2">(${item.org})</span>` : ''}
                    </div>
                    <span class="font-mono text-xs font-semibold text-blue-600 ml-4 whitespace-nowrap bg-blue-50 px-2 py-0.5 rounded border border-blue-100">${item.date}</span>
                </div>
            `).join('');
        })
        .catch(err => console.error('Error loading honors:', err));
}

function loadPublications() {
    const container = document.getElementById('featured-publications-container');
    if (!container) return;

    fetch(getDataPath('publications.json'))
        .then(res => res.json())
        .then(publications => {
            const featured = publications.filter(p => p.showOnHomepage !== false);
            container.innerHTML = featured.map(pub => {
                const tagsHtml = pub.tags && pub.tags.length ? `
                    <div class="flex flex-wrap gap-2 pt-1">
                        ${pub.tags.map(tag => `
                            <a href="${tag.link}" target="_blank" rel="noopener noreferrer" class="pub-action-btn">
                                <i class="${getTagIcon(tag.text)}"></i> ${tag.text}
                            </a>
                        `).join('')}
                    </div>
                ` : '';

                const thumbHtml = pub.thumbnail ? `
                    <div class="pub-teaser-box">
                        <img src="${pub.thumbnail}" alt="${pub.title} teaser" loading="lazy">
                    </div>
                ` : '';

                return `
                    <div class="pub-card-item">
                        ${thumbHtml}
                        <div class="flex-1 space-y-1.5 min-w-0">
                            <h4 class="pub-title">${pub.displayTitle || pub.title}</h4>
                            <p class="pub-authors">${pub.authors}</p>
                            <div class="pub-venue">
                                <span>${pub.venue}</span>
                                ${pub.venueTag ? `<span class="pub-venue-badge">${pub.venueTag}</span>` : ''}
                            </div>
                            ${tagsHtml}
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(err => console.error('Error loading publications:', err));
}
