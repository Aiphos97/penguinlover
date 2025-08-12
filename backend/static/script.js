

// const frames = [
//   '/static/hearts.png',
//   '/static/hearts.png',
//   '/static/hearts.png',
//   '/static/hearts.png',
//   '/static/hearts.png',
// ];

// let currentFrame = 0;
// let imagesShown = 0;

// // Function to create a task div with complete button
// function addTaskToDOM(message) {
//   const messagesContainer = document.getElementById('messagesContainer');

//   const taskDiv = document.createElement('div');
//   taskDiv.style.display = 'flex';
//   taskDiv.style.alignItems = 'center';
//   taskDiv.style.marginBottom = '8px';

//   const taskText = document.createElement('span');
//   taskText.textContent = message;
//   taskText.style.flexGrow = '1';

//   const taskButton = document.createElement('button');
//   taskButton.textContent = 'Completar';
//   taskButton.style.marginLeft = '10px';

//   taskButton.addEventListener('click', () => {
//     // Remove the task from the list
//     taskDiv.remove();

//     // Add a heart only if less than 5 hearts shown
//     if (imagesShown < 5) {
//       const heartsContainer = document.getElementById('heartscontainers');
//       const img = document.createElement('img');
//       img.src = frames[currentFrame];
//       img.alt = 'Heart animation frame';
//       img.style.marginRight = '5px';
//       heartsContainer.appendChild(img);

//       currentFrame = (currentFrame + 1) % frames.length;
//       imagesShown++;
//     }
//   });

//   taskDiv.appendChild(taskText);
//   taskDiv.appendChild(taskButton);
//   messagesContainer.appendChild(taskDiv);
// }

// // Load existing tasks from backend, **do not add hearts here**
// window.addEventListener('DOMContentLoaded', () => {
//   fetch('/messages')
//     .then(response => response.json())
//     .then(data => {
//       data.messages.forEach(msg => {
//         addTaskToDOM(msg.content);
//       });
//     })
//     .catch(() => {
//       console.error('Error loading messages');
//     });
// });

// // Handle new task submissions
// document.getElementById('taskForm').addEventListener('submit', (event) => {
//   event.preventDefault();

//   const input = document.getElementById('inputMessage');
//   const message = input.value.trim();
//   if (message === "") return;

//   fetch('/button-click', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ message }),
//   })
//   .then(response => {
//     if (!response.ok) throw new Error('Network response was not ok');
//     return response.text();
//   })
//   .then(() => {
//     addTaskToDOM(message);
//     input.value = '';
//   })
//   .catch(() => {
//     alert('Error sending message');
//   });
// });


const frames = [
  '/static/hearts.png',
  '/static/hearts.png',
  '/static/hearts.png',
  '/static/hearts.png',
  '/static/hearts.png',
];

let currentFrame = 0;
let imagesShown = 0;

// Function to create a task div with complete button
function addTaskToDOM(messageObj) {
  const { id, content, completed } = messageObj;
  const messagesContainer = document.getElementById('messagesContainer');
  const completedContainer = document.getElementById('completedTasksContainer');

  const taskDiv = document.createElement('div');
  taskDiv.style.display = 'flex';
  taskDiv.style.alignItems = 'center';
  taskDiv.style.marginBottom = '8px';

  const taskText = document.createElement('span');
  taskText.textContent = content;
  taskText.style.flexGrow = '1';

  const taskButton = document.createElement('button');
  taskButton.style.marginLeft = '10px';

  if (completed) {
    // Already completed: disable button and move to completed container
    taskButton.textContent = 'Completada';
    taskButton.disabled = true;
    completedContainer.appendChild(taskDiv);
  } else {
    // Not completed: normal button
    taskButton.textContent = 'Completar';
    messagesContainer.appendChild(taskDiv);

    taskButton.addEventListener('click', () => {
      fetch(`/complete-task/${id}`, { method: 'POST' })
        .then(response => {
          if (!response.ok) throw new Error('Failed to mark completed');
    
          completedContainer.appendChild(taskDiv);
          taskButton.disabled = true;
          taskButton.textContent = 'Completada';
    
          // Fetch and render updated vidas (hearts)
          fetch('/get_vidas')
            .then(res => res.json())
            .then(data => {
              const vidas = data.vidas || 0;
              const heartsContainer = document.getElementById('heartscontainers');
              heartsContainer.innerHTML = ''; // clear previous hearts
    
              for (let i = 0; i < vidas && i < frames.length; i++) {
                const img = document.createElement('img');
                img.src = frames[i];
                img.alt = 'Heart animation frame';
                img.style.marginRight = '5px';
                heartsContainer.appendChild(img);
              }
    
              imagesShown = vidas;
              currentFrame = vidas % frames.length;
            });
        })
        .catch(() => alert('Error marking task as completed'));
    });
    
  }

  taskDiv.appendChild(taskText);
  taskDiv.appendChild(taskButton);
}

// Load existing tasks from backend, do NOT add hearts here for completed tasks
window.addEventListener('DOMContentLoaded', () => {
  // Existing: fetch tasks and add them
  fetch('/messages')
    .then(response => response.json())
    .then(data => {
      data.messages.forEach(msg => addTaskToDOM(msg));
    })
    .catch(() => console.error('Error loading messages'));

  // NEW: fetch vidas and render hearts
  fetch('/get_vidas')
    .then(res => res.json())
    .then(data => {
      const vidas = data.vidas || 0;
      const heartsContainer = document.getElementById('heartscontainers');
      heartsContainer.innerHTML = ''; // clear old hearts

      for (let i = 0; i < vidas && i < frames.length; i++) {
        const img = document.createElement('img');
        img.src = frames[i];
        img.alt = 'Heart animation frame';
        img.style.marginRight = '5px';
        heartsContainer.appendChild(img);
      }

      imagesShown = vidas;
      currentFrame = vidas % frames.length;
    })
    .catch(err => {
      console.error('Error fetching vidas:', err);
    });
});


// Handle new task submissions
document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const input = document.getElementById('inputMessage');
  const message = input.value.trim();
  if (message === "") return;

  fetch('/button-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
  })
  .then(() => {
    // Fetch messages again to get the new task with ID and completed=0
    fetch('/messages')
      .then(response => response.json())
      .then(data => {
        // Clear tasks to avoid duplicates, then re-add all
        document.getElementById('messagesContainer').innerHTML = '';
        document.getElementById('completedTasksContainer').innerHTML = '';
        imagesShown = 0; // reset hearts count on reload
        currentFrame = 0;
        data.messages.forEach(msg => {
          addTaskToDOM(msg);
        });
      });
    input.value = '';
  })
  .catch(() => {
    alert('Error sending message');
  });
});
