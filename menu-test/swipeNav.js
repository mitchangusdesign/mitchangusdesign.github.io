document.addEventListener('DOMContentLoaded', () => {
    const tabsWrapper = document.querySelector('.menu-container');
    const tabButtons = document.querySelectorAll('.no-buttons-made'); //keeping in case I add buttons later
    let startX = 0;
    let dist = 0;
    const threshold = 80; // Minimum distance for a swipe to be registered

    function next() {
        let mtablinks = document.querySelector(".menu-tab-links.active-link");
        let mtabcontents = document.querySelector(".menu-tab-contents.active-tab");
        // Get the next element sibling
        const nextSiblingTitle = mtablinks.nextElementSibling;
        const nextSiblingElement = mtabcontents.nextElementSibling;

        // Check if a next sibling element exists and then get its ID
        if (nextSiblingElement && nextSiblingTitle) {

            const nextSiblingTitleId = nextSiblingTitle.id;
            const nextSiblingId = nextSiblingElement.id;
                mtablinks.classList.remove("active-link");
                mtabcontents.classList.remove("active-tab");
                document.getElementById(nextSiblingTitleId).classList.add("active-link");
                document.getElementById(nextSiblingId).classList.add("active-tab");

            // console.log("ID of the next title sibling:", nextSiblingTitleId);
            } else {
            console.log("No next element sibling found.");
        };
    };
    function prev() {
        let mtablinks = document.querySelector(".menu-tab-links.active-link");
        let mtabcontents = document.querySelector(".menu-tab-contents.active-tab");
        // Get the previous element sibling
        const previousSiblingTitle = mtablinks.previousElementSibling;
        const previousSiblingElement = mtabcontents.previousElementSibling;

        // Check if a previous sibling element exists and then get its ID
        if (previousSiblingElement && previousSiblingTitle) {

            const previousSiblingTitleId = previousSiblingTitle.id;
            const previousSiblingId = previousSiblingElement.id;
                mtablinks.classList.remove("active-link");
                mtabcontents.classList.remove("active-tab");
                document.getElementById(previousSiblingTitleId).classList.add("active-link");
                document.getElementById(previousSiblingId).classList.add("active-tab");

            // console.log("ID of the previous title sibling:", previousSiblingTitleId);
            } else {
            console.log("No previous element sibling found.");
        };
    };

    // Touch event handlers for swiping
    tabsWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    tabsWrapper.addEventListener('touchmove', (e) => {
        dist = e.touches[0].clientX - startX;
    });

    tabsWrapper.addEventListener('touchend', () => {
        if (dist > threshold) {
            // Swiped right
        //   console.log("swiped right");
            prev();
        } else if (dist < -threshold) {
            // Swiped left
        //   console.log("swiped left");
            next();
        }

        // Reset values
        dist = 0;
        startX = 0;
    });
});