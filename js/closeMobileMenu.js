
document.querySelectorAll(".menu li a").forEach(function(elem) {
    elem.addEventListener('click', function(ev) {
    document.getElementById("side-menu").checked = false;
    });

    })