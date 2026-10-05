document.addEventListener('DOMContentLoaded', function () {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    setupMobileMenu();
    setupSmoothScroll();
    loadNews();
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
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function getDataPath(fileName) {
    return window.location.pathname.includes('/pages/') ? `../data/${fileName}` : `data/${fileName}`;
}

function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    fetch(getDataPath('news.json'))
        .then(res => res.json())
        .then(items => {
            container.innerHTML = items.slice(0, 6).map(item => `
                <div class="news-item">
                    <span class="news-date">${item.date}</span>
                    <span class="text-sm text-slate-700">${item.content}</span>
                </div>
            `).join('');
        })
        .catch(err => console.error('Error loading news:', err));
}

function loadHonors() {
    const container = document.getElementById('honors-container');
    if (!container) return;

    fetch(getDataPath('honors.json'))
        .then(res => res.json())
        .then(items => {
            container.innerHTML = items.slice(0, 6).map(item => `
                <div class="flex justify-between items-baseline py-2 border-b border-slate-100 last:border-none text-sm">
                    <span class="font-medium text-slate-800">${item.title} <span class="text-xs text-slate-400 font-normal">(${item.org})</span></span>
                    <span class="text-accent font-semibold text-xs ml-4">${item.date}</span>
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
            const featured = publications.filter(p => p.showOnHomepage);
            container.innerHTML = featured.map(pub => `
                <div class="pub-list-item">
                    <div class="flex-1 space-y-2">
                        <div class="flex flex-wrap items-center gap-2">
                            <h3 class="font-semibold text-slate-900 text-base leading-snug">${pub.displayTitle || pub.title}</h3>
                            ${pub.venueTag ? `<span class="pub-venue-tag">${pub.venueTag}</span>` : ''}
                        </div>
                        <p class="text-sm text-slate-600">${pub.authors}</p>
                        <p class="text-xs text-slate-500 italic">${pub.venue}</p>
                        
                        ${pub.tags && pub.tags.length ? `
                            <div class="flex flex-wrap gap-2 pt-1">
                                ${pub.tags.map(tag => `
                                    <a href="${tag.link}" target="_blank" rel="noopener noreferrer" class="pub-link-btn">${tag.text}</a>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    ${pub.thumbnail ? `
                        <div class="pub-thumbnail-box hidden sm:block">
                            <img src="${pub.thumbnail}" alt="${pub.title} preview" loading="lazy">
                        </div>
                    ` : ''}
                </div>
            `).join('');
        })
        .catch(err => console.error('Error loading publications:', err));
}
