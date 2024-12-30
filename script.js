document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Handle scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let hasScrolled = false;

    // Hide scroll indicator on any scroll
    window.addEventListener('scroll', () => {
        if (!hasScrolled && scrollIndicator) {
            hasScrolled = true;
            scrollIndicator.classList.add('hidden');
        }
    }, { passive: true }); // Add passive flag for better performance

    // Initialize carousel
    const carousel = {
        currentSlide: 0,
        slides: document.querySelectorAll('.testimonial-card'),
        dots: document.querySelectorAll('.carousel-dot'),
        interval: null,

        init() {
            if (!this.slides.length || !this.dots.length) return;
            
            // Set up click handlers for dots
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            // Start autoplay
            this.startAutoplay();

            // Show first slide
            this.showSlide(this.currentSlide);
        },

        showSlide(index) {
            // Hide all slides
            this.slides.forEach(slide => slide.classList.remove('active'));
            this.dots.forEach(dot => dot.classList.remove('active'));

            // Show current slide
            this.slides[index].classList.add('active');
            this.dots[index].classList.add('active');
            this.currentSlide = index;
        },

        nextSlide() {
            const next = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(next);
        },

        goToSlide(index) {
            this.showSlide(index);
            this.restartAutoplay();
        },

        startAutoplay() {
            this.interval = setInterval(() => this.nextSlide(), 5000);
        },

        restartAutoplay() {
            clearInterval(this.interval);
            this.startAutoplay();
        }
    };

    // Initialize the carousel
    carousel.init();

    // Handle logo visibility on scroll down only
    const logo = document.querySelector('.logo');
    let scrollTimeout;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only hide logo when scrolling down past threshold
        if (scrollTop > 100) {
            logo.classList.add('hidden');
        } else {
            logo.classList.remove('hidden');
        }
    }

    // Add debounced scroll listener
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });

    // Waitlist Modal Functionality
    const waitlistModal = document.getElementById('waitlistModal');
    const waitlistForm = document.getElementById('waitlistForm');
    const modalClose = document.querySelector('.modal-close');
    const waitlistButtons = document.querySelectorAll('.primary-cta');
    const continueButtons = document.querySelectorAll('.continue-btn');

    // Open modal when any waitlist button is clicked
    waitlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            waitlistModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        waitlistModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal when clicking overlay
    waitlistModal.addEventListener('click', (e) => {
        if (e.target === waitlistModal || e.target.classList.contains('modal-overlay')) {
            waitlistModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Only run waitlist form code if we're on a page with the form
    if (waitlistForm) {
        // Set the form action to Formspree URL
        waitlistForm.action = 'https://formspree.io/f/xgveborr';
        waitlistForm.method = 'POST';

        // Initialize modal elements
        const modal = document.getElementById('waitlistModal');
        const modalContent = modal?.querySelector('.modal-content');
        const openModalBtn = document.getElementById('openModalBtn');
        const closeModalBtn = modal?.querySelector('.close-modal');
        const continueButtons = document.querySelectorAll('.continue-btn');
        const finishButton = document.querySelector('.finish-btn');
        const backButtons = document.querySelectorAll('.back-btn');
        const otherTeamCheckbox = document.getElementById('other-team');
        const otherTeamDescription = document.getElementById('other-team-description');
        const otherCgmInput = document.getElementById('otherCgmInput');
        const otherCgmRadio = document.querySelector('input[name="cgm_provider"][value="other"]');
        const otherCgmContainer = document.querySelector('.other-cgm-container');

        // Function to advance to next step
        function advanceStep(currentStepElement) {
            const currentStep = parseInt(currentStepElement.dataset.step);
            const continueBtn = currentStepElement.querySelector('.continue-btn, .finish-btn');
            if (continueBtn) {
                continueBtn.click();
            }
        }

        // Handle Enter key on inputs
        document.querySelectorAll('.step-content').forEach(stepContent => {
            const inputs = stepContent.querySelectorAll('input[type="email"], input[type="text"], textarea');
            inputs.forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        advanceStep(stepContent);
                    }
                });
            });
        });

        // Handle Enter key on radio buttons and checkboxes
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const stepContent = input.closest('.step-content');
                    if (stepContent) {
                        advanceStep(stepContent);
                    }
                }
            });
        });

        // Modal controls
        if (openModalBtn && modal) {
            openModalBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                // Track modal open
                gtag('event', 'modal_open', {
                    'event_category': 'Engagement',
                    'event_label': 'Waitlist Modal'
                });
            });
        }

        if (closeModalBtn && modal) {
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                // Track modal close
                gtag('event', 'modal_close', {
                    'event_category': 'Engagement',
                    'event_label': 'Waitlist Modal'
                });
                // Reset form when closing modal
                waitlistForm.reset();
                // Reset to first step
                const firstStep = document.querySelector('.step-content[data-step="1"]');
                const currentStep = document.querySelector('.step-content.active');
                if (firstStep && currentStep) {
                    currentStep.classList.remove('active');
                    firstStep.classList.add('active');
                }
                // Reset progress bar
                document.querySelectorAll('.progress-step').forEach(step => {
                    if (parseInt(step.dataset.step) > 1) {
                        step.classList.remove('active');
                    }
                });
                // Hide other input fields
                if (otherCgmContainer) {
                    otherCgmContainer.style.display = 'none';
                }
                if (otherTeamDescription) {
                    otherTeamDescription.style.display = 'none';
                }
            });
        }

        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Handle step navigation for continue buttons (steps 1-3)
        continueButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const currentStep = parseInt(button.closest('.step-content').dataset.step);
                
                // Track step completion
                gtag('event', 'step_complete', {
                    'event_category': 'Form Progress',
                    'event_label': `Step ${currentStep}`,
                    'value': currentStep
                });

                // Validation checks
                if (currentStep === 1) {
                    const emailInput = document.getElementById('email');
                    if (!emailInput?.value || !emailInput?.checkValidity()) {
                        emailInput?.classList.add('error');
                        return;
                    }
                }
                
                // Team selection validation for step 2
                if (currentStep === 2) {
                    const selectedTeams = document.querySelectorAll('input[name="teams[]"]:checked');
                    if (selectedTeams.length === 0) {
                        return;
                    }
                    
                    if (otherTeamCheckbox?.checked && !otherTeamDescription?.value.trim()) {
                        otherTeamDescription?.classList.add('error');
                        return;
                    }
                }

                // CGM selection validation for step 3
                if (currentStep === 3) {
                    const selectedCgm = document.querySelector('input[name="cgm_provider"]:checked');
                    if (!selectedCgm) {
                        return;
                    }

                    if (selectedCgm.value === 'other' && !otherCgmInput?.value.trim()) {
                        otherCgmInput?.classList.add('error');
                        return;
                    }
                }
                
                const nextStep = parseInt(button.dataset.next);
                navigateToStep(currentStep, nextStep);
            });
        });

        // Handle finish button (step 4)
        if (finishButton) {
            finishButton.addEventListener('click', async () => {
                console.log('Finish button clicked, submitting form...');
                await handleFormSubmit();
            });
        }

        // Handle back button navigation
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = parseInt(button.closest('.step-content').dataset.step);
                const prevStep = parseInt(button.dataset.prev);
                
                // Track step back
                gtag('event', 'step_back', {
                    'event_category': 'Form Progress',
                    'event_label': `From Step ${currentStep} to ${prevStep}`,
                    'value': prevStep
                });

                navigateToStep(currentStep, prevStep);
            });
        });

        // Handle Other Team input
        if (otherTeamCheckbox && otherTeamDescription) {
            // Initially hide the textarea
            otherTeamDescription.style.display = 'none';

            otherTeamCheckbox.addEventListener('change', () => {
                if (otherTeamCheckbox.checked) {
                    otherTeamDescription.style.display = 'block';
                    otherTeamDescription.removeAttribute('disabled');
                    setTimeout(() => otherTeamDescription.focus(), 0);
                } else {
                    otherTeamDescription.style.display = 'none';
                    otherTeamDescription.setAttribute('disabled', 'disabled');
                    otherTeamDescription.value = '';
                }
            });

            // Remove error class on input
            otherTeamDescription.addEventListener('input', function() {
                this.classList.remove('error');
            });
        }

        // Handle Other CGM input
        if (otherCgmRadio && otherCgmContainer && otherCgmInput) {
            // Show/hide other input based on selection
            document.querySelectorAll('input[name="cgm_provider"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio === otherCgmRadio) {
                        otherCgmContainer.style.display = 'block';
                        otherCgmInput.disabled = false;
                        otherCgmInput.focus();
                    } else {
                        otherCgmContainer.style.display = 'none';
                        otherCgmInput.disabled = true;
                        otherCgmInput.value = '';
                    }
                });
            });

            // Remove error class on input
            otherCgmInput.addEventListener('input', function() {
                this.classList.remove('error');
            });
        }

        // Remove error class on input
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                this.classList.remove('error');
            });
        }

        // Form submission handling
        async function handleFormSubmit() {
            try {
                const formData = new FormData(waitlistForm);
                
                // Add selected teams and handle "Other" team
                const selectedTeams = Array.from(document.querySelectorAll('input[name="teams[]"]:checked'))
                    .map(checkbox => {
                        if (checkbox.value === 'other') {
                            return {
                                type: 'other',
                                name: 'custom',
                                description: otherTeamDescription.value
                            };
                        }
                        return {
                            type: 'predefined',
                            name: checkbox.value
                        };
                    });
                formData.append('teams', JSON.stringify(selectedTeams));
                
                // Add CGM selection and handle "Other" CGM
                const selectedCgm = document.querySelector('input[name="cgm_provider"]:checked');
                if (selectedCgm) {
                    if (selectedCgm.value === 'other' && otherCgmInput?.value) {
                        formData.append('cgm_provider', JSON.stringify({
                            type: 'other',
                            name: otherCgmInput.value
                        }));
                    } else {
                        formData.append('cgm_provider', JSON.stringify({
                            type: 'predefined',
                            name: selectedCgm.value
                        }));
                    }
                }

                // Add additional information if provided
                const additionalInfo = document.getElementById('additionalInfo');
                if (additionalInfo?.value) {
                    formData.append('additional_info', additionalInfo.value);
                }

                console.log('Submitting form data:', Object.fromEntries(formData));
                
                const response = await fetch(waitlistForm.action, {
                    method: waitlistForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    console.log('Form submitted successfully');
                    
                    // Track successful form submission
                    gtag('event', 'form_submit', {
                        'event_category': 'Waitlist',
                        'event_label': 'Success',
                        'value': 1
                    });

                    // Track selected teams
                    const selectedTeams = Array.from(document.querySelectorAll('input[name="teams[]"]:checked'))
                        .map(checkbox => checkbox.value);
                    gtag('event', 'team_selection', {
                        'event_category': 'Form Data',
                        'event_label': 'Selected Teams',
                        'teams': selectedTeams
                    });

                    // Track CGM provider selection
                    const selectedCgm = document.querySelector('input[name="cgm_provider"]:checked');
                    if (selectedCgm) {
                        gtag('event', 'cgm_selection', {
                            'event_category': 'Form Data',
                            'event_label': 'CGM Provider',
                            'provider': selectedCgm.value
                        });
                    }

                    navigateToStep(4, 5);
                    waitlistForm.reset();
                    // Hide any visible "other" input fields
                    if (otherTeamDescription) {
                        otherTeamDescription.style.display = 'none';
                    }
                    if (otherCgmContainer) {
                        otherCgmContainer.style.display = 'none';
                    }
                } else {
                    // Track form submission error
                    gtag('event', 'form_error', {
                        'event_category': 'Waitlist',
                        'event_label': 'Submission Failed',
                        'value': 0
                    });

                    const data = await response.json();
                    console.error('Form submission error:', data);
                    if (Object.hasOwn(data, 'errors')) {
                        console.error("Form errors:", data.errors.map(error => error.message).join(", "));
                    } else {
                        throw new Error('Form submission failed');
                    }
                }
            } catch (error) {
                // Track form submission error
                gtag('event', 'form_error', {
                    'event_category': 'Waitlist',
                    'event_label': 'Network/System Error',
                    'value': 0
                });
                console.error('Error submitting form:', error);
            }
        }

        // Navigation helper function
        function navigateToStep(currentStep, nextStep) {
            // Update progress bar
            document.querySelectorAll('.progress-step').forEach(step => {
                if (parseInt(step.dataset.step) <= nextStep) {
                    step.classList.add('active');
                }
                if (parseInt(step.dataset.step) === currentStep && nextStep < currentStep) {
                    step.classList.remove('active');
                }
            });

            // Hide current step
            const currentContent = document.querySelector(`.step-content[data-step="${currentStep}"]`);
            if (currentContent) {
                currentContent.classList.remove('active');
            }
            
            // Show next step
            const nextContent = document.querySelector(`.step-content[data-step="${nextStep}"]`);
            if (nextContent) {
                nextContent.classList.add('active');
                
                // Trigger confetti on reaching confirmation
                if (nextStep === 5 && typeof createConfetti === 'function') {
                    setTimeout(createConfetti, 300);
                }
            }
        }
    }

    // Confetti Animation
    function createConfetti() {
        const colors = ['#e4ff3f', '#ffffff', '#ffeb3b'];
        const confettiCount = 50;
        const container = document.querySelector('.modal-container');

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.opacity = '0';

            container.appendChild(confetti);

            // Start animation
            setTimeout(() => {
                confetti.style.animation = 'confetti 2s ease-out forwards';
            }, 100);

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    // Share functionality
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.dataset.platform;
            const text = "I just joined the waitlist for Wearable Challenge - the community that turns CGM data into real accountability! 🎯";
            const url = window.location.href;

            let shareUrl;
            if (platform === 'twitter') {
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            } else if (platform === 'linkedin') {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            }

            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });

    // Close modal on done
    document.querySelector('.close-btn')?.addEventListener('click', () => {
        document.getElementById('waitlistModal').classList.remove('active');
        document.body.style.overflow = '';
    });
});
