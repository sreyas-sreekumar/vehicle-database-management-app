console.log("JavaScript loaded");

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://kuuytbqwexjmsqlacure.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dXl0YnF3ZXhqbXNxbGFjdXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDg2MDUsImV4cCI6MjA2MTk4NDYwNX0.OCeaKRrIqb-HMmuXA_FPZBnvFhaueqrPJatQ6qhIxgY';
const db = createClient(supabaseUrl, supabaseKey);
const formPeople = document.querySelector("#people-search-form");
const nameBox = document.querySelector("#name");
const messageBox = document.querySelector("#message");
const resultsBox = document.querySelector("#results");

formPeople.addEventListener("submit", peopleSearch);

async function peopleSearch(event)
{
    event.preventDefault();
    const name = nameBox.value.trim();


    clearEverything();
    if(!name)
    {
        messageHelper("Please enter a name to begin searching :");
        return;

    }

    const returnedPeopleList = await nameQuery(name);
    if(returnedPeopleList.length === 0)
    {
        messageHelper("No result found");
        return;
    }
    messageHelper("Search successful");
    showNames(returnedPeopleList);

}

function messageHelper(text)
{
    messageBox.textContent = text;

}
function clearEverything()
{
    messageBox.textContent = "";
    resultsBox.textContent = "";
}

async function nameQuery(person)
{
    const { data, error } = await db
        .from("people")
        .select("*")
        .ilike("Name", `%${person}%`);
    if (error) {
        messageHelper("Error:" + error.message);
        console.log("Error:" + error.message);
        return [];
    }

    return data;
}


function showNames(peopleList)
{
    for (const person of peopleList)
    {
        const personResult = document.createElement("div");
        personResult.textContent = `${person.Name} - ${person.LicenseNumber}`;
        resultsBox.appendChild(personResult);

    }
}