const pokedexEntryForm = document.querySelector('#pokedex-entry-form');
const submitButton = document.querySelector('#submit-button');
const cancelButton = document.querySelector('#cancel-button');
const resetButton = document.querySelector('#reset-button');
const pokedexDisplayContainer = document.querySelector('#pokedex-display');

//pokedex entry data
const nameInput = document.querySelector('#name-input');
const descInput = document.querySelector('#desc-input');
const heightInput_ft = document.querySelector('#height-input-feet');
const heightInput_in = document.querySelector('#height-input-inches');
const weightInput = document.querySelector('#weight-input');
const typeInput_1 = document.querySelector('#type-1-select');
const typeInput_2 = document.querySelector('#type-2-select');
const hpInput = document.querySelector('#hp-input');
const atkInput = document.querySelector('#atk-input');
const defInput = document.querySelector('#def-input');
const spatkInput = document.querySelector('#spatk-input');
const spdefInput = document.querySelector('#spdef-input');
const spdInput = document.querySelector('#spd-input');

let isEditing = false;
let editID = 0;

pokedexEntryForm.addEventListener('submit', () => addDexEntry());
cancelButton.addEventListener('click', () => CancelPokedexEdit());
resetButton.addEventListener('click', () => ResetDB());

RefreshDex();

//reloads the html view with what is returned from the database
function RefreshDex(){
    pokedexDisplayContainer.innerHTML = 
    '<h1>Pokedex</h1>';
    fetch('/api/items')
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const {id, name, desc, height_ft, height_in, weight, type1, type2, hp, atk, def, spatk, spdef, spd} = element

            //create the elements
            const dexEntry = document.createElement('div');
            dexEntry.classList += 'pokedex-entry'
            dexEntry.innerHTML = 
            `   <div  class="dex-no">
                    <h1>${DexNoFromId(id)}</h1>
                </div>
                <h2 class="dex-name">${name}</h2>

                <p class="dex-desc">${desc}</p>
                
                <div class="dex-height">
                    <h2>Height</h2> 
                    <p>${height_ft}' ${height_in}"</p>
                </div>
                <div class="dex-weight">
                    <h2>Weight</h2> 
                    <p>${weight} lbs</p>
                </div>
                <div class="dex-type">
                    <h2>Type</h2> <p>${type1},  ${type2}</p>
                </div>
                <div class="dex-bst">
                    <p>Hp: ${hp}</p>
                    <p>Atk: ${atk}</p>
                    <p>Def: ${def}</p>
                    <p>Sp. Atk: ${spatk}</p>
                    <p>Sp. Def: ${spdef}</p>
                    <p>Spd: ${spd}</p>
                </div>
                
                <Button class="dex-delete-button">Delete</Button>
                <Button class="dex-edit-button">Edit</Button>
                
                `;


            //deleteButton
            const deleteButton = dexEntry.querySelector('.dex-delete-button');
            deleteButton.id = id;
            deleteButton.addEventListener('click', (e) => DeleteButtonPressed(e));
            //editButton
            const editButton = dexEntry.querySelector('.dex-edit-button');
            editButton.id = id;
            editButton.addEventListener('click', (e) => EditButtonPressed(e));

            pokedexDisplayContainer.appendChild(dexEntry);

        });
    });
}

//changes the visuals of the ID to act as a pokedex number
function DexNoFromId(id){
    const idInt = parseInt(id);
    if(idInt < 10){
        return '00' + id;
    }else if(idInt < 100){
        return '0' + id;
    }else{
        return id;
    }
}

//adds a pokedex entry to the database
function AddDexEntry(){
    if(!isEditing){
        fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameInput.value,
                desc: descInput.value,
                height_ft: heightInput_ft.value,
                height_in: heightInput_in.value,
                weight: weightInput.value,
                type1: typeInput_1.options[typeInput_1.selectedIndex].text,
                type2: typeInput_2.options[typeInput_2.selectedIndex].text,
                hp: hpInput.value,
                atk: atkInput.value,
                def: defInput.value,
                spatk: spatkInput.value,
                spdef: spdefInput.value,
                spd: spdInput.value
            }),
        }).then(response => response.json()).then(data => console.log(data));
    }else if (isEditing && editID > 0)
    {
        console.log("Editing");
        fetch(`/api/items/${editID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameInput.value,
                desc: descInput.value,
                height_ft: heightInput_ft.value,
                height_in: heightInput_in.value,
                weight: weightInput.value,
                type1: typeInput_1.options[typeInput_1.selectedIndex].text,
                type2: typeInput_2.options[typeInput_2.selectedIndex].text,
                hp: hpInput.value,
                atk: atkInput.value,
                def: defInput.value,
                spatk: spatkInput.value,
                spdef: spdefInput.value,
                spd: spdInput.value
            }),
        }).then(response => response.json()).then(data => console.log(data));
        isEditing = false;
        editID = 0;
        submitButton.innerHTML = 'Add Pokedex Entry'
    }
}

//deletes a selected pokedex entry from the database
function DeleteButtonPressed(e){
    const id = e.target.id;
    fetch(`/api/items/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) return response.text();
        throw new Error('Item not found.');
    }).then(data => console.log(data));
    RefreshDex();
}

//deletes a selected pokedex entry from the database
function EditButtonPressed(e){
    const id = e.target.id;
    fetch(`/api/items/${id}`)
    .then(response => response.json())
    .then(data => {
        const {id, name, desc, height_ft, height_in, weight, type1, type2, hp, atk, def, spatk, spdef, spd} = data;
        nameInput.value = name;
        descInput.value = desc;
        heightInput_ft.value = height_ft;
        heightInput_in.value = height_in;
        weightInput.value = weight;
        typeInput_1.value = type1.toLowerCase();
        typeInput_2.value = type2.toLowerCase();
        hpInput.value = hp;
        atkInput.value = atk;
        defInput.value = def;
        spatkInput.value = spatk;
        spdefInput.value = spdef;
        spdInput.value = spd;

        submitButton.innerHTML = 'Edit Pokedex Entry'
        editID = id;
        isEditing = true;
    });
    cancelButton.style.visibility = "visible"
}

//cancels the editing of a pokedex entry if currently editing
function CancelPokedexEdit(){
    nameInput.value = "";
    descInput.value = "";
    heightInput_ft.value = "";
    heightInput_in.value = "";
    weightInput.value = "";
    typeInput_1.value = "";
    typeInput_2.value = "";
    hpInput.value = "";
    atkInput.value = "";
    defInput.value = "";
    spatkInput.value = "";
    spdefInput.value = "";
    spdInput.value = "";
    
    isEditing = false;
    editID = 0;
    submitButton.innerHTML = 'Submit Pokedex Entry'
}

function ResetDB(){
    fetch('/api/reset', {
        method: 'POST'
        }).then(response => {
           if (response.ok) return response.text();
           throw new Error('Failed to reset database.');
        }).then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}