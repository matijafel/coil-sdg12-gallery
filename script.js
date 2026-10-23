"use strict";

// GALLERY RENDERING
const grid = document.getElementById('photo-grid');
for (const photo of galleryPhotos) {
    const card = document.createElement('article');
    card.className = 'photo-card';
    card.dataset.category = photo.category;

    const btn = document.createElement('button');
    btn.className = 'photo-open';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open ' + photo.title);

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.description;
    img.loading = 'lazy';
    btn.append(img);
    btn.addEventListener('click', () => openPhoto(photo));

    const info = document.createElement('div');
    info.className = 'info';
    const author = document.createElement('span');
    author.textContent = 'By ' + photo.author;
    const heading = document.createElement('h3');
    heading.textContent = photo.title;
    const desc = document.createElement('p');
    desc.textContent = photo.description;

    info.append(author, heading, desc);
    card.append(btn, info);
    grid.append(card);
}

// GALLERY FILTERS
for (const filter of document.querySelectorAll('.filter')) {
    filter.addEventListener('click', () => {
        const choice = filter.dataset.filter;
        for (const f of document.querySelectorAll('.filter')) {
            f.classList.toggle('active', f === filter);
            f.setAttribute('aria-pressed', String(f === filter));
        }
        for (const c of document.querySelectorAll('.photo-card')) {
            c.hidden = choice !== 'all' && c.dataset.category !== choice;
        }
    });
}

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
let previousFocus = null;

function openPhoto(photo) {
    previousFocus = document.activeElement;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.description;
    document.getElementById('lightbox-caption').textContent = `${photo.title} — ${photo.description} (Photo: ${photo.author})`;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lightbox-close').focus();
}

function closePhoto() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
}

document.getElementById('lightbox-close').addEventListener('click', closePhoto);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closePhoto(); });
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) closePhoto();
});

// QUIZ FOR SDG 15
const questions = [
    {
        q: 'What percentage of the Earth’s land surface is covered by forests?',
        options: ['Around 10%', 'Around 30%', 'Around 60%'],
        answer: 1,
        explanation: 'Forests cover nearly 30% of Earth’s land area, providing habitats for millions of species.'
    },
    {
        q: 'Why are native plants vital for local ecosystems?',
        options: ['They require artificial fertilizers', 'They support native wildlife and pollinators', 'They grow faster than all other plants'],
        answer: 1,
        explanation: 'Native plants provide essential food and habitat for local pollinators and wildlife.'
    },
    {
        q: 'What is a main cause of soil degradation and biodiversity loss?',
        options: ['Deforestation and land misuse', 'Planting trees in urban parks', 'Using recycled paper'],
        answer: 0,
        explanation: 'Deforestation and unsustainable land conversion are primary drivers of habitat loss worldwide.'
    }
];

let qi = 0, score = 0, answered = false;
const qtext = document.getElementById('quiz-question');
const qopts = document.getElementById('quiz-options');
const feedback = document.getElementById('quiz-feedback');
const next = document.getElementById('quiz-next');

function showQuestion() {
    answered = false;
    const q = questions[qi];
    document.getElementById('quiz-progress').textContent = `Question ${qi + 1} of ${questions.length}`;
    document.getElementById('quiz-score').textContent = `Score: ${score}`;
    document.getElementById('quiz-bar').style.width = `${(qi / questions.length) * 100}%`;
    qtext.textContent = q.q;
    qopts.replaceChildren();
    feedback.textContent = '';
    next.hidden = true;

    questions[qi].options.forEach((option, index) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = option;
        b.addEventListener('click', () => choose(index));
        qopts.append(b);
    });
}

function choose(index) {
    if (answered) return;
    answered = true;
    const q = questions[qi];
    if (index === q.answer) score++;

    [...qopts.children].forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) b.classList.add('correct');
        else if (i === index) b.classList.add('wrong');
    });

    feedback.textContent = (index === q.answer ? 'Correct! ' : 'Not quite. ') + q.explanation;
    document.getElementById('quiz-score').textContent = `Score: ${score}`;
    next.hidden = false;
    next.textContent = qi === questions.length - 1 ? 'See my results →' : 'Next question →';
}

next.addEventListener('click', () => {
    qi++;
    if (qi < questions.length) {
        showQuestion();
    } else {
        qtext.hidden = true;
        qopts.hidden = true;
        next.hidden = true;
        feedback.textContent = '';
        document.getElementById('quiz-bar').style.width = '100%';
        document.getElementById('quiz-finish').hidden = false;
        document.getElementById('quiz-result').textContent = `You scored ${score} out of ${questions.length}!`;
    }
});

document.getElementById('quiz-restart').addEventListener('click', () => {
    qi = 0; score = 0;
    qtext.hidden = false; qopts.hidden = false;
    document.getElementById('quiz-finish').hidden = true;
    showQuestion();
});

showQuestion();

// SURVEY LOGIC
const key = 'coil-sdg15-poll-demo-v1';
const choices = ['Trees', 'Clean', 'Support'];
let votes;

try {
    votes = JSON.parse(localStorage.getItem(key)) || { Trees: 0, Clean: 0, Support: 0 };
} catch {
    votes = { Trees: 0, Clean: 0, Support: 0 };
}

for (const c of choices) {
    if (!Number.isFinite(votes[c]) || votes[c] < 0) votes[c] = 0;
}

function drawVotes() {
    const total = choices.reduce((s, c) => s + votes[c], 0);
    const target = document.getElementById('poll-bars');
    target.replaceChildren();

    const labels = { Trees: 'Plant trees & flora', Clean: 'Forest cleanups', Support: 'Sustainable paper/wood' };

    for (const c of choices) {
        const percent = total ? Math.round((votes[c] / total) * 100) : 0;
        const row = document.createElement('div');
        row.className = 'poll-row';

        const label = document.createElement('div');
        label.className = 'poll-row-top';

        const name = document.createElement('span');
        name.textContent = labels[c];

        const amount = document.createElement('span');
        amount.textContent = `${votes[c]} vote(s) · ${percent}%`;

        label.append(name, amount);

        const track = document.createElement('div');
        track.className = 'poll-track';
        const fill = document.createElement('div');
        fill.className = 'poll-fill';
        fill.style.width = percent + '%';

        track.append(fill);
        row.append(label, track);
        target.append(row);
    }
}

document.getElementById('poll-vote').addEventListener('click', () => {
    const selected = document.querySelector('input[name="poll"]:checked');
    if (!selected) {
        alert('Please select an option first.');
        return;
    }
    votes[selected.value]++;
    try { localStorage.setItem(key, JSON.stringify(votes)); } catch {}
    document.getElementById('poll').hidden = true;
    document.getElementById('poll-results').hidden = false;
    drawVotes();
});

document.getElementById('poll-reset').addEventListener('click', () => {
    votes = { Trees: 0, Clean: 0, Support: 0 };
    try { localStorage.removeItem(key); } catch {}
    document.getElementById('poll').hidden = false;
    document.getElementById('poll-results').hidden = true;
    document.querySelectorAll('input[name="poll"]').forEach(x => x.checked = false);
});

// NAVIGATION TOGGLE
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('navlinks');

toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
});

for (const a of nav.querySelectorAll('a')) {
    a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    });
}
