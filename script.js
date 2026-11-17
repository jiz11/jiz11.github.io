document.addEventListener('DOMContentLoaded', function () {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    setupSmoothScroll();
    loadHonors();
    loadPublications();
    loadCourses();
});

function setupSmoothScroll() {
    document.querySelectorAll('#header a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });

                document.querySelectorAll('#header a').forEach(link => link.classList.remove('active'));
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
            container.innerHTML = items.map(item => `
                <section class="gitfolio-card">
                    <div class="section_title">${item.title}</div>
                    <div class="about_section">
                        <span>${item.org || 'Award / Honor'}</span>
                    </div>
                    <div class="bottom_section">
                        <span><i class="fas fa-calendar-alt"></i> ${item.date}</span>
                        <span><i class="fas fa-award"></i> Honor</span>
                        ${item.tags && item.tags.length ? item.tags.map(tag => `
                            <a href="${tag.link}" target="_blank" rel="noopener noreferrer" class="gitfolio-tag-btn">
                                <i class="${getTagIcon(tag.text)}"></i> ${tag.text}
                            </a>
                        `).join('') : ''}
                    </div>
                </section>
            `).join('');
        })
        .catch(err => console.error('Error loading honors:', err));
}

function loadCourses() {
    const container = document.getElementById('courses-container')
        || document.getElementById('all-courses-container');
    if (!container) return;

    fetch(getDataPath('courses.json'))
        .then(res => {
            if (!res.ok) throw new Error(`Failed to load courses: ${res.status}`);
            return res.json();
        })
        .then(courses => {
            container.innerHTML = courses.map(course => `
                <section class="gitfolio-card">
                    <div>
                        <div class="section_title">${course.title}</div>
                        <div class="about_section">
                            <p style="margin: 0 0 6px 0; color: #fff; font-weight: 600;">${course.institution}</p>
                            <p style="margin: 0; color: var(--text-secondary);">
                                Core Coursework: ${course.courses.join(', ')}
                            </p>
                        </div>
                    </div>
                    <div class="bottom_section">
                        <span><i class="fas fa-calendar-alt"></i> ${course.period}</span>
                        <span><i class="fas fa-book-open"></i> Coursework</span>
                    </div>
                </section>
            `).join('');
        })
        .catch(err => console.error('Error loading courses:', err));
}

function loadPublications() {
    const container = document.getElementById('featured-publications-container');
    if (!container) return;

    fetch(getDataPath('publications.json'))
        .then(res => res.json())
        .then(publications => {
            const featured = publications.filter(p => p.showOnHomepage !== false);
            container.innerHTML = featured.map(pub => {
                const tagsHtml = pub.tags && pub.tags.length ? pub.tags.map(tag => `
                    <a href="${tag.link}" target="_blank" rel="noopener noreferrer" class="gitfolio-tag-btn">
                        <i class="${getTagIcon(tag.text)}"></i> ${tag.text}
                    </a>
                `).join('') : '';

                const thumbHtml = pub.thumbnail ? `
                    <div class="pub-gitfolio-teaser">
                        <img src="${pub.thumbnail}" alt="${pub.title} preview" loading="lazy">
                    </div>
                ` : '';

                return `
                    <section class="gitfolio-card">
                        <div>
                            ${thumbHtml}
                            <div class="section_title">${pub.displayTitle || pub.title}</div>
                            <div class="about_section">
                                <p style="margin: 0 0 6px 0;">${pub.authors}</p>
                                <p style="margin: 0; color: #8b949e; font-size: 14px;">
                                    <em>${pub.venue}</em>
                                    ${pub.venueTag ? ` <span class="venue-tag-badge">${pub.venueTag}</span>` : ''}
                                </p>
                            </div>
                        </div>
                        <div class="bottom_section">
                            <span><i class="fas fa-calendar"></i> ${pub.year}</span>
                            ${tagsHtml}
                        </div>
                    </section>
                `;
            }).join('');
        })
        .catch(err => console.error('Error loading publications:', err));
}
