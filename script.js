const ideaForm = document.getElementById('ideaForm');
const ideaList = document.getElementById('ideaList');
const randomBtn = document.getElementById('randomBtn');
const randomIdeaBtn = document.getElementById('randomIdeaBtn');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('randomModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const randomIdeaDisplay = document.getElementById('randomIdeaDisplay');

let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
renderIdeas();

// Add idea
ideaForm.addEventListener('submit', e=>{
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const idea = { title, description, category };
  ideas.push(idea);
  localStorage.setItem('ideas', JSON.stringify(ideas));
  renderIdeas();
  ideaForm.reset();
});

// Render ideas
function renderIdeas(){
  ideaList.innerHTML='';
  ideas.forEach((idea,index)=>addIdeaToPage(idea,index));
}

// Add single idea
function addIdeaToPage(idea,index){
  const div = document.createElement('div');
  div.classList.add('idea');
  let categoryClass='';
  switch(idea.category){
    case 'Tech': categoryClass='small-tech'; break;
    case 'Travel': categoryClass='small-travel'; break;
    case 'Business': categoryClass='small-business'; break;
    case 'Personal': categoryClass='small-personal'; break;
  }
  div.innerHTML = `
    <h3>${idea.title} <small class="${categoryClass}">${idea.category}</small></h3>
    <p>${idea.description}</p>
    <button onclick="deleteIdea(${index})">Delete</button>
  `;
  ideaList.appendChild(div);
  setTimeout(()=>div.classList.add('show'),10);
}

// Delete idea
function deleteIdea(index){
  ideas.splice(index,1);
  localStorage.setItem('ideas',JSON.stringify(ideas));
  renderIdeas();
}

// Clear all
clearBtn.addEventListener('click', ()=>{
  if(confirm("Are you sure you want to delete all ideas?")){
    ideas=[];
    localStorage.removeItem('ideas');
    renderIdeas();
  }
});

// Random Local Idea Modal
randomBtn.addEventListener('click', ()=>{
  if(ideas.length===0){
    alert("No ideas yet! Add some ideas first.");
    return;
  }
  const randomIndex = Math.floor(Math.random()*ideas.length);
  const randomIdea = ideas[randomIndex];
  modalTitle.innerText = `💡 ${randomIdea.title} (${randomIdea.category})`;
  modalDesc.innerText = randomIdea.description;
  modal.classList.add('show');
});

// Close modal
closeModal.addEventListener('click', ()=> modal.classList.remove('show'));
window.addEventListener('click', e=>{ if(e.target==modal) modal.classList.remove('show'); });

// 🌐 Fetch random idea from external source (Bored API via CORS proxy)
randomIdeaBtn.addEventListener('click', async ()=>{
  randomIdeaDisplay.textContent = "Loading...";
  try{
    const response = await fetch('https://api.allorigins.win/raw?url=https://www.boredapi.com/api/activity/');
    const data = await response.json();
    randomIdeaDisplay.textContent = `💡 ${data.activity}`;
  }catch(err){
    randomIdeaDisplay.textContent = "Failed to fetch a random idea. Try again!";
    console.error(err);
  }
});
