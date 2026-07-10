/**
 * Lesse Studio Inspired Portfolio Controller
 * Controls preloader, light/dark theme toggles, coordinate mouse tracking cursor, automatic carousel, timezone clock, and expanding rows
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Preloader Animation ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 1600); // Matches progress fill timing
    }

    // --- 2. Custom Coordinates Crosshair Cursor ---
    const crosshair = document.getElementById('cursor-crosshair');
    const coords = document.getElementById('cursor-coords');
    let isTouch = false;

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        isTouch = true;
        if (crosshair) crosshair.style.display = 'none';
        if (coords) coords.style.display = 'none';
        document.body.style.cursor = 'default';
        const style = document.createElement('style');
        style.innerHTML = '* { cursor: auto !important; }';
        document.head.appendChild(style);
    }

    if (!isTouch && crosshair && coords) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            // Move crosshair directly
            crosshair.style.left = `${x}px`;
            crosshair.style.top = `${y}px`;

            // Position and format coordinates badge
            coords.style.left = `${x}px`;
            coords.style.top = `${y}px`;
            
            const padX = String(Math.round(x)).padStart(3, '0');
            const padY = String(Math.round(y)).padStart(3, '0');
            coords.textContent = `X: ${padX} Y: ${padY}`;
        });

        // Hide crosshair when mouse leaves page
        document.addEventListener('mouseleave', () => {
            crosshair.style.opacity = '0';
            coords.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            crosshair.style.opacity = '1';
            coords.style.opacity = '0.85';
        });
    }

    // --- 5. Horizontal Editorial Showcase (Carousel) ---
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator-bar');
    let currentSlide = 0;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;

        // Reset progress fill animation end listener
        const activeFill = indicators[index].querySelector('.progress-fill');
        if (activeFill) {
            // Remove listener from previous fills to avoid duplicate runs
            indicators.forEach(ind => {
                const fill = ind.querySelector('.progress-fill');
                if (fill) fill.replaceWith(fill.cloneNode(true));
            });
            
            // Re-select fresh element
            const newActiveFill = indicators[index].querySelector('.progress-fill');
            newActiveFill.addEventListener('animationend', () => {
                let next = currentSlide + 1;
                if (next >= slides.length) next = 0;
                showSlide(next);
            }, { once: true });
        }
    };

    if (slides.length > 0 && indicators.length > 0) {
        showSlide(0);

        // Click indicators directly
        indicators.forEach((indicator, idx) => {
            indicator.addEventListener('click', () => {
                showSlide(idx);
            });
        });
    }

    // --- 6. Collapsible Capabilities Outline Grid ---
    const gridRows = document.querySelectorAll('.grid-row');
    
    gridRows.forEach(row => {
        const header = row.querySelector('.row-header');
        const content = row.querySelector('.row-content');
        const indicator = row.querySelector('.row-indicator i');
        
        header.addEventListener('click', () => {
            const isExpanded = row.classList.contains('expanded');
            
            // Close other rows to match Lesse Studio flow
            gridRows.forEach(otherRow => {
                otherRow.classList.remove('expanded');
                otherRow.querySelector('.row-content').style.maxHeight = '0px';
                const otherIcon = otherRow.querySelector('.row-indicator i');
                if (otherIcon) {
                    otherIcon.className = 'fa-solid fa-plus';
                }
            });

            if (!isExpanded) {
                row.classList.add('expanded');
                content.style.maxHeight = `${content.scrollHeight}px`;
                if (indicator) {
                    indicator.className = 'fa-solid fa-minus';
                }
            } else {
                row.classList.remove('expanded');
                content.style.maxHeight = '0px';
                if (indicator) {
                    indicator.className = 'fa-solid fa-plus';
                }
            }
        });
    });

    // --- 7. Dock Highlight Navigation Link ---
    const dockLinks = document.querySelectorAll('.dock-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let activeId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            const height = sec.clientHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                activeId = sec.getAttribute('id');
            }
        });

        dockLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 8. Connect Form Submissions ---
    const connectForm = document.getElementById('studio-connect-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    window.collab_submitted = false;

    if (connectForm) {
        connectForm.addEventListener('submit', () => {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin icon-right"></i>';
        });
    }

    window.handleCollabSuccess = () => {
        if (formStatus) {
            formStatus.textContent = "Your concept was sent successfully. We'll be in touch.";
            formStatus.className = "form-status success";
        }
        if (submitBtn) {
            submitBtn.innerHTML = 'Message Sent <i class="fa-solid fa-check icon-right"></i>';
        }
        if (connectForm) {
            connectForm.reset();
        }
        window.collab_submitted = false;

        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right icon-right"></i>';
            }
            if (formStatus) {
                formStatus.textContent = "";
                formStatus.className = "form-status";
            }
        }, 5000);
    };

    // Dynamic dot animation inside Bottom Dock matrix icon
    const dockBtn = document.querySelector('.dock-action-btn');
    const matrixDots = document.querySelectorAll('.matrix-dot');
    
    if (dockBtn && matrixDots.length > 0) {
        dockBtn.addEventListener('mouseenter', () => {
            matrixDots.forEach(dot => {
                const index = parseInt(dot.style.getPropertyValue('--i'));
                // Asymmetric scales mimicking tech grid matrix transitions
                dot.style.transform = `scale(1.3) translate(${(index % 3 - 1) * 3}px, ${(Math.floor(index / 3) - 1) * 3}px)`;
            });
        });
        dockBtn.addEventListener('mouseleave', () => {
            matrixDots.forEach(dot => {
                dot.style.transform = 'none';
            });
        });
    }

    // --- 9. Clean Page transitions & bfcache recovery ---
    const transitionOverlay = document.getElementById('transition-overlay');
    const transitionLinks = document.querySelectorAll('.transition-link');

    if (transitionOverlay) {
        transitionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                if (target && !target.startsWith('#')) {
                    e.preventDefault();
                    transitionOverlay.classList.remove('slide-out');
                    transitionOverlay.classList.add('active');
                    
                    setTimeout(() => {
                        window.location.href = target;
                    }, 600); // matches CSS cubic-bezier transition time
                }
            });
        });
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted && transitionOverlay) {
            transitionOverlay.classList.remove('active');
            transitionOverlay.classList.add('slide-out');
        }
    });
});
