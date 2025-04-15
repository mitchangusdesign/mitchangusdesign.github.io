async function populate() {

  const requestURL = "https://github.com/mitchangusdesign/mitchangusdesign.github.io/blob/main/static-test/items.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const menuItemsText = await response.text();

  const menuItems = JSON.parse(menuItemsText);
  populateMenu(menuItems);

}
     
function populateMenu(obj) {
  const menu = document.getElementById('menulist');
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
populate();
