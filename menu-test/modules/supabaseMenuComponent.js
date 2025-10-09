const supabasePublicClient = supabase.createClient("https://smwkypyopkqyrzqwfoyq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtd2t5cHlvcGtxeXJ6cXdmb3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDUwMDgsImV4cCI6MjA1ODE4MTAwOH0.WLto0_jltEz4jUER2nkTJvnAudfTRYlgj5InEDnP30w", {
       db: {
           schema: "public"
       }
   });

   // Appetizer Menu
async function populateApps()  {
    const menu = document.querySelector('.menulistApps');
    const { data: items } = await supabasePublicClient
    .from('menu')
    .select('id, name, description, price, photo')
    .eq('category', 'appetizers')
    .order('id', { ascending: true });

    if (!items) {
    return console.error('No items found');
    }

    console.log(items);
   
    for ( const item of items ) {
    const row = document.createElement('div');
          row.classList.add('item-wrapper');
    const name = document.createElement('h3');
          name.classList.add('name');
    const description = document.createElement('p');
          description.classList.add('description');
    const price = document.createElement('p');
          price.classList.add('price');
    const photo = document.createElement('photo');
          photo.classList.add('photo');
          
    name.textContent = item.name;
    description.textContent = item.description;
    price.textContent = item.price;
    photo.textContent = item.photo;

    row.appendChild(name); 
    row.appendChild(description);
    row.appendChild(price);
    row.appendChild(photo); 
          
    menu.appendChild(row);      
    };
};

// Lunch Menu
async function populateLunch()  {
    const menu = document.querySelector('.menulistLunch');
    const { data: items } = await supabasePublicClient
    .from('menu')
    .select('id, name, description, price')
    .eq('category', 'lunch')
    .order('id', { ascending: true });

    if (!items) {
    return console.error('No items found');
    }

    console.log(items);
    
    for ( const item of items ) {
    const row = document.createElement('div');
        row.classList.add('item-wrapper');
    const name = document.createElement('h3');
        name.classList.add('name');
    const description = document.createElement('p');
        description.classList.add('description');
    const price = document.createElement('p');
        price.classList.add('price');
        
    name.textContent = item.name;
    description.textContent = item.description;
    price.textContent = item.price;

    row.appendChild(name); 
    row.appendChild(description);
    row.appendChild(price); 
        
    menu.appendChild(row);      
    };
};

// Dinner Menu
async function populateDinner()  {
    const menu = document.querySelector('.menulistDinner');
    const { data: items } = await supabasePublicClient
    .from('menu')
    .select('id, name, description, price')
    .eq('category', 'dinner')
    .order('id', { ascending: true });

    if (!items) {
    return console.error('No items found');
    }

    console.log(items);
    
    for ( const item of items ) {
    const row = document.createElement('div');
        row.classList.add('item-wrapper');
    const name = document.createElement('h3');
        name.classList.add('name');
    const description = document.createElement('p');
        description.classList.add('description');
    const price = document.createElement('p');
        price.classList.add('price');
        
    name.textContent = item.name;
    description.textContent = item.description;
    price.textContent = item.price;

    row.appendChild(name); 
    row.appendChild(description);
    row.appendChild(price); 
        
    menu.appendChild(row);      
    };
};
// Soft Drinks Menu
async function populateSodas()  {
    const menu = document.querySelector('.menulistSodas');
    const { data: items } = await supabasePublicClient
    .from('menu')
    .select('id, name, description, price')
    .eq('category', 'softdrinks')
    .order('id', { ascending: true });

    if (!items) {
    return console.error('No items found');
    }

    console.log(items);
    
    for ( const item of items ) {
    const row = document.createElement('div');
        row.classList.add('item-wrapper');
    const name = document.createElement('h3');
        name.classList.add('name');
    const description = document.createElement('p');
        description.classList.add('description');
    const price = document.createElement('p');
        price.classList.add('price');
        
    name.textContent = item.name;
    description.textContent = item.description;
    price.textContent = item.price;

    row.appendChild(name); 
    row.appendChild(description);
    row.appendChild(price); 
        
    menu.appendChild(row);      
    };
};

   //Cocktail Menu
async function populateCocktails() {
    const menu = document.querySelector('.menulistCocktails');
    const { data: items } = await supabasePublicClient
    .from('menu')
    .select('id, name, description, price')
    .eq('category', 'cocktails')
    .order('id', { ascending: true });

    if (!items) {
    return console.error('No items found');
    }

    console.log(items);
    
    for ( const item of items ) {
    const row = document.createElement('div');
        row.classList.add('item-wrapper');
    const name = document.createElement('h3');
        name.classList.add('name');
    const description = document.createElement('p');
        description.classList.add('description');
    const price = document.createElement('p');
        price.classList.add('price');
        
    name.textContent = item.name;
    description.textContent = item.description;
    price.textContent = item.price;

    row.appendChild(name); 
    row.appendChild(description);
    row.appendChild(price); 
        
    menu.appendChild(row);      
    };
};

populateApps();
populateLunch();
populateDinner();
populateSodas();
populateCocktails();