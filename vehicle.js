console.log("Vehicle javascript loaded");

import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://kuuytbqwexjmsqlacure.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dXl0YnF3ZXhqbXNxbGFjdXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDg2MDUsImV4cCI6MjA2MTk4NDYwNX0.OCeaKRrIqb-HMmuXA_FPZBnvFhaueqrPJatQ6qhIxgY';
const db = createClient(supabaseUrl,supabaseKey);

const vehicleForm = document.querySelector("#vehicle-search-form");
const regBox = document.querySelector("#rego");
const messageBox = document.querySelector("#message");
const resultsBox = document.querySelector("#results");

vehicleForm.addEventListener("submit",vehicleSearch);

async function vehicleSearch(event)
{
    event.preventDefault();
    const rego = regBox.value.trim();
    clearEverything();
    if(!rego)
    {
        messageHelper("Please enter a valid registration number :");
        return;
    }
    
    const returnedRegList = await regQuery(rego);
    if(returnedRegList.length ===0)
    {
        messageHelper("No result found");
        return;
    }

    messageHelper(`Search successful ->There are ${returnedRegList.length} results for that query `);
    showReg(returnedRegList);

}


async function regQuery(reg) 
{
    const {data,error} = await db
        .from("vehicles")
        .select("*")
        .ilike("VehicleID",`%${reg}%`);
   if (error) {
            messageHelper("Error:" + error.message);
            console.log("Error:" + error.message);
            return [];
        }

    return data;
}
function clearEverything()
{
    messageBox.textContent = "";
    resultsBox.textContent = "";
}
function messageHelper(text)
{
    messageBox.textContent = text;
}

async function showReg(regList)
{

    for (const x of regList)
    {
        let vehicleOwner = "Unknown";
        let ownerReturned = null;
        if(x.OwnerID)
        {
            const {data:data,error }  = await db
            .from("people")
            .select("Name , LicenseNumber")
            .eq("PersonID",x.OwnerID)
            .single();
            ownerReturned = data;
        }
        if(ownerReturned)
        {
            vehicleOwner = `${ownerReturned.Name} - ${ownerReturned.LicenseNumber}`;

        }
        else{
            vehicleOwner = "Owner Unknown";
        }
        const regResult = document.createElement("div");
        regResult.textContent = `${x.VehicleID} - ${x.Make} - ${x.Model} - ${x.Colour} - Owner: ${vehicleOwner}`;
        resultsBox.appendChild(regResult);

    }
}