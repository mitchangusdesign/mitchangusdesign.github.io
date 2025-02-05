const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
   console.log(entry)
   if (entry.isIntersecting) {
    entry.target.classList.add('wiggleOn');
    } else {
      entry.target.classList.remove('wiggleOn'); 
    }
  });
});

const wiggleElements = document.querySelectorAll('img.hello-card-box');   
  wiggleElements.forEach((el) => observer.observe(el));