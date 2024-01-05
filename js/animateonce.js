if (window.sessionStorage.getItem('animated') === null) { 
    document.getElementById('line1').classList.add('animation');
    window.sessionStorage.setItem('animated' ,1);
} 