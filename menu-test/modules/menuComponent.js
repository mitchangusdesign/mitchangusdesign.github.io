
      

// Old code to load menu items from a local JSON(items.json) file
      

async function populate() {

  const requestURL = "https://mitchangus.design/static-test/items.json";
  
  const request = new Request(requestURL);

  const response = await fetch(request);
  const menuItemsText = await response.text();

  const menuItems = JSON.parse(menuItemsText);
  populateDrinks(menuItems);
  populateFood(menuItems);

}
     
function populateDrinks(obj) {
  const menu = document.querySelector('.menulist');
  const items = obj.cocktails;

  for ( const item of items ) {
    const row = document.createElement('div');
          row.classList.add('item-wrapper');
    const name = document.createElement('h3');
          name.classList.add('name');
    const desc = document.createElement('p');
          desc.classList.add('description');
    const price = document.createElement('p');
          price.classList.add('price');
      
    name.textContent = item.name;
    desc.textContent = item.description;
    price.textContent = item.price;

    row.appendChild(name); 
    row.appendChild(desc);
    row.appendChild(price); 
        
    menu.appendChild(row);      
  }
}

function populateFood(obj) {
  const menu = document.querySelector('.menulistfood');
  const items = obj.dinners;

  for ( const item of items ) {
    const row = document.createElement('div');
          row.classList.add('item-wrapper');
    const name = document.createElement('h3');
          name.classList.add('name');
    const desc = document.createElement('p');
          desc.classList.add('description');
    const price = document.createElement('p');
          price.classList.add('price');
      
    name.textContent = item.name;
    desc.textContent = item.description;
    price.textContent = item.price;

    row.appendChild(name); 
    row.appendChild(desc);
    row.appendChild(price); 
        
    menu.appendChild(row);      
  }
}
populate();

