(() => {
    "use strict";

    /* ==========================================
       GSAP + SCROLLTRIGGER
       ========================================== */

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined"
    ) {

        gsap.registerPlugin(ScrollTrigger);

        const projectCards =
            gsap.utils.toArray(".project-card");


        /* ==========================================
           PROJECT CARD SCROLL ANIMATION
           ========================================== */

        if (!prefersReducedMotion && projectCards.length) {

            gsap.from(projectCards, {

                y: 90,

                opacity: 0,

                scale: 0.94,

                rotateX: 8,

                transformOrigin: "center bottom",

                duration: 0.9,

                ease: "power3.out",

                stagger: 0.14,

                scrollTrigger: {

                    trigger: "#projects",

                    start: "top 78%",

                    once: true

                }

            });


            /* ==========================================
               PROJECT IMAGE ANIMATION
               ========================================== */

            projectCards.forEach((card) => {

                const image =
                    card.querySelector(".project-img");

                if (!image) return;

                gsap.from(image, {

                    scale: 1.12,

                    duration: 1.15,

                    ease: "power2.out",

                    scrollTrigger: {

                        trigger: card,

                        start: "top 88%",

                        once: true

                    }

                });

            });


            /* ==========================================
               PROJECT CARD HOVER
               ========================================== */

            projectCards.forEach((card) => {

                const image =
                    card.querySelector(".project-img");


                card.addEventListener("mouseenter", () => {

                    gsap.to(card, {

                        y: -8,

                        duration: 0.28,

                        ease: "power2.out",

                        overwrite: true

                    });


                    if (image) {

                        gsap.to(image, {

                            scale: 1.045,

                            duration: 0.45,

                            ease: "power2.out",

                            overwrite: true

                        });

                    }

                });


                card.addEventListener("mouseleave", () => {

                    gsap.to(card, {

                        y: 0,

                        duration: 0.35,

                        ease: "power2.out",

                        overwrite: true

                    });


                    if (image) {

                        gsap.to(image, {

                            scale: 1,

                            duration: 0.45,

                            ease: "power2.out",

                            overwrite: true

                        });

                    }

                });

            });

        }

    }


    /* ==========================================
       RETRO JOYSTICK
       ========================================== */

    const controller =
        document.querySelector(".retro-scroll-controller");

    const stick =
        document.querySelector(".joystick-stick");

    const upButton =
        document.querySelector(".joystick-up");

    const downButton =
        document.querySelector(".joystick-down");

    const status =
        document.querySelector(".joystick-status");


    if (!controller || !stick) return;


    const STEP = 420;

    const MAX_Y = 18;

    let dragging = false;

    let pointerStartY = 0;


    /* ==========================================
       STATUS
       ========================================== */

    const setStatus = (text) => {

        if (status) {

            status.textContent = text;

        }

    };


    /* ==========================================
       SCROLL FUNCTION
       ========================================== */

    const scrollPage = (amount) => {

        window.scrollBy({

            top: amount,

            behavior: prefersReducedMotion
                ? "auto"
                : "smooth"

        });

    };


    /* ==========================================
       RESET JOYSTICK
       ========================================== */

    const resetStick = () => {

        stick.style.transform =
            "translate(-50%, -50%)";

    };


    /* ==========================================
       MOVE JOYSTICK
       ========================================== */

    const moveStick = (offsetY) => {

        const clamped =
            Math.max(
                -MAX_Y,
                Math.min(MAX_Y, offsetY)
            );

        stick.style.transform =
            `translate(-50%, calc(-50% + ${clamped}px))`;

    };


    /* ==========================================
       UP BUTTON
       ========================================== */

    upButton?.addEventListener("click", () => {

        scrollPage(-STEP);

        setStatus("UP");

        setTimeout(() => {

            setStatus("READY");

        }, 350);

    });


    /* ==========================================
       DOWN BUTTON
       ========================================== */

    downButton?.addEventListener("click", () => {

        scrollPage(STEP);

        setStatus("DOWN");

        setTimeout(() => {

            setStatus("READY");

        }, 350);

    });


    /* ==========================================
       DRAG JOYSTICK
       ========================================== */

    stick.addEventListener(
        "pointerdown",
        (event) => {

            dragging = true;

            pointerStartY =
                event.clientY;

            stick.setPointerCapture?.(
                event.pointerId
            );

            setStatus("PLAY");

        }
    );


    stick.addEventListener(
        "pointermove",
        (event) => {

            if (!dragging) return;


            const delta =
                event.clientY -
                pointerStartY;


            moveStick(delta * 0.65);


            scrollPage(
                delta * 0.35
            );


            pointerStartY =
                event.clientY;


            setStatus(
                delta > 0
                    ? "DOWN"
                    : "UP"
            );

        }
    );


    /* ==========================================
       RELEASE JOYSTICK
       ========================================== */

    const releaseStick = () => {

        dragging = false;

        resetStick();

        setStatus("READY");

    };


    stick.addEventListener(
        "pointerup",
        releaseStick
    );

    stick.addEventListener(
        "pointercancel",
        releaseStick
    );

    stick.addEventListener(
        "lostpointercapture",
        releaseStick
    );


    /* ==========================================
       KEYBOARD CONTROL
       ========================================== */

    stick.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "ArrowUp") {

                event.preventDefault();

                scrollPage(-STEP);

                setStatus("UP");

            }


            if (event.key === "ArrowDown") {

                event.preventDefault();

                scrollPage(STEP);

                setStatus("DOWN");

            }

        }
    );


})();