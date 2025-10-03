import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://kuuytbqwexjmsqlacure.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dXl0YnF3ZXhqbXNxbGFjdXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDg2MDUsImV4cCI6MjA2MTk4NDYwNX0.OCeaKRrIqb-HMmuXA_FPZBnvFhaueqrPJatQ6qhIxgY';
const db = createClient(supabaseUrl,supabaseKey);

const addForm = document.querySelector("#add-vehicle-form");
addForm.addEventListener("submit",insertVehicleHelper);

const regBox = document.querySelector("#rego");
const makeBox = document.querySelector("#make");
const messageBox = document.querySelector("#message");
const checkOwnerBox = document.querySelector("#check-owner");
const modelBox = document.querySelector("#model");
const colourBox = document.querySelector("#colour");
const addButton = document.querySelector("#add-button");
const nameBox = document.querySelector("#owner");
const ownerResultsBox = document.querySelector("#owner-results");
const searchOwnerButton = document.querySelector("#search-owner-name");
const newNameBox = document.querySelector("#name");
const addressBox = document.querySelector("#address");
const DOBbox = document.querySelector("#dob");
const licenseBox = document.querySelector("#license");
const expiryBox = document.querySelector("#expire");
const newOwnerForm = document.querySelector("#new-owner-form");
const newOwnerButton = document.querySelector("#new-owner-btn");
const addOwnerButton = document.querySelector("#add-owner-btn");
const messageOwnerBox = document.querySelector("#message-owner");
const messageVehicleBox = document.querySelector("#message-vehicle");
searchOwnerButton.addEventListener("click",searchOwner);
let OwnerIdValid  = null;


async function insertVehicleHelper(event)
{
    event.preventDefault();
    clearInterface();
    const newReg = regBox.value.trim();
    const newMake = makeBox.value.trim();
    const newModel = modelBox.value.trim();
    const newColour = colourBox.value.trim();

    if(!newColour || !newReg || !newMake || !newModel || !OwnerIdValid)
    {
        messageHelper("Error :Incomplete fields -please check all fields are filled out.");
        return;
    }
    const result = await db
        .from("vehicles")
        .insert(
            {
                OwnerID: OwnerIdValid,
                VehicleID: newReg,
                Model: newModel,
                Make: newMake,
                Colour: newColour
            }
        )
        
    const error = result.error;
    if(error)
        {
            messageHelper("Error (Inserting):" + error.message);
            return;
        }
    messageVehicleBox.textContent = "Vehicle added successfully";
    addForm.reset();
    addButton.disabled = true;


}
async function addOwnerHelper(event)
{
    const newName = newNameBox.value.trim();
    const newAddress = addressBox.value.trim();
    const newDOB = DOBbox.value.trim();
    const newLicense = licenseBox.value.trim();
    const newExpiry = expiryBox.value.trim();

    if(!newName || !newAddress || !newDOB || !newLicense || !newExpiry)
    {
        messageOwnerBox.textContent = "Error :Incomplete fields -please check all fields are filled out.";
        return;
    }

    const first = await db
        .from("people")
        .select("PersonID")
        .eq("LicenseNumber", newLicense)
        .maybeSingle();
    const firstError = first.error;
    if(first.data)
    {
        messageOwnerBox.textContent = "Error (Check for Valid License): Already exists";
        return; 
    }
    
    const result = await db
        .from("people")
        .insert(
            {
                Name: newName,
                Address: newAddress,
                DOB: newDOB,
                LicenseNumber: newLicense,
                ExpiryDate: newExpiry
            }
        )
        .select()
        .single();
    const error = result.error;
    if(error)
    {
            messageOwnerBox.textContent = "Error (Inserting):" + error.message;
            return;
    }

    messageOwnerBox.textContent = "Owner added successfully";
    addButton.disabled = false;
    OwnerIdValid = result.data.PersonID;
    
}

function messageHelper(text)
{
    messageBox.textContent = text;
}
function clearInterface()
{
    messageBox.textContent = "";
    ownerResultsBox.textContent = "";
}

async function searchOwner()
{
    const nameValue = nameBox.value.trim();
    clearInterface();

    if(nameValue==="")
    {
        messageHelper("Please enter an owner name to search for");
        return;
    }
    const results = await db
            .from("people")
            .select("PersonID, Name, LicenseNumber")
            .ilike("Name", `%${nameValue}%`);
    const data = results.data
    const error = results.error;
    if(error)
    {
            messageHelper("Error (Searching):" + error.message);
            return;
    }

    if(data.length === 0)
    {
        messageHelper("No matching results found");
        return;
    }

    messageHelper("Search successful");
    for (const x of data)
    {
        const eachResult = document.createElement("div");
        const eachButton = document.createElement("button");

        eachResult.textContent = `Name : ${x.Name} License Number : ${x.LicenseNumber}`;
        eachButton.textContent = "Use";
        eachButton.addEventListener("click",() => {
            OwnerIdValid = x.PersonID;
            messageHelper(`Owner ${x.Name} verification succesfull ...`);
            addButton.disabled = false;
        });
        eachResult.appendChild(eachButton);
        ownerResultsBox.appendChild(eachResult);
    }


}

newOwnerButton.addEventListener("click", () => {
    newOwnerForm.style.display = "block";
  });

addOwnerButton.addEventListener("click",addOwnerHelper);