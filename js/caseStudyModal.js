function openModal() {
      document.getElementById("myModal").style.display = "flex";
    }
    
    function closeModal() {
      document.getElementById("myModal").style.display = "none";
    }

    function openToSlide(x) {
    var element = document.getElementById(x)
        element.scrollIntoView({ behavior: 'instant' })
    }

    // Modal Nav Button Horizontal Scroll Mechanism
  
    // Take the value of the left or right button and multiply by the width of container and scroll page by the result 
    function scrollNext(x, y) {
      const container = document.getElementById('scroll-wrap');
      const slideWidth = container.clientWidth;
      container.scrollBy({
      top: y,
      left:slideWidth * x,
      behavior: "smooth",
    });
    }

    // Get the modal
    var modal = document.getElementById('myModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }