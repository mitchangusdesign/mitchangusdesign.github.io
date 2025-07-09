var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos ||  window.pageYOffset < 50) {
        document.getElementById("header").style.top = "0";
        document.getElementById("header").style.opacity = "1";
    } else {
        document.getElementById("header").style.top = "-150px";
        document.getElementById("header").style.opacity = "0";
    }
    prevScrollpos = currentScrollPos;
    } 
///* ---- old js to hide header on scroll (ios don't like)*/
  /* var prevScrollpos = window.pageYOffset;
      window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          document.getElementById("header").style.top = "0";
          document.getElementById("header").style.opacity = "1";
        } else {
          document.getElementById("header").style.top = "-100px";
          document.getElementById("header").style.opacity = "0";
        }
        prevScrollpos = currentScrollPos;
      } */