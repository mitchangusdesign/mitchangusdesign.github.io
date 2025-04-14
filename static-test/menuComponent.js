async function populate() {
  const requestURL = "https://github.com/mitchangusdesign/mitchangusdesign.github.io/blob/main/static-test/items.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  
  const menuItemsText = await response.text();

  const menuItems = JSON.parse(menuItemsText);
  
      populateMenu(menuItems);
  
     }
     
     
      function populateMenu(obj) {
      const menu = 
document.querySelector('menu-items')
      const items = obj.cocktails;
      
      

      for ( const item of items ) {
      const item = document.createElement('div');
        div.classList.add('item-wrapper');
      const name = document.createElement('h3');
        div.classList.add('name');
      const desc = document.createElement('p');
        div.classList.add('description');
      const price = document.createElement('p');
        div.classList.add('price');
        
        
        name.textContent = cocktails.name;
        desc.textContent = cocktails.description;
        price.textContent = `$ ${cocktails.price}`;
      };
     
}
    populate();