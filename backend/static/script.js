



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
// function addTaskToDOM(messageObj) {
//   const { id, content, completed } = messageObj;
//   const messagesContainer = document.getElementById('messagesContainer');
//   const completedContainer = document.getElementById('completedTasksContainer');

//   const taskDiv = document.createElement('div');
//   taskDiv.style.display = 'flex';
//   taskDiv.style.alignItems = 'center';
//   taskDiv.style.marginBottom = '8px';

//   const taskText = document.createElement('span');
//   taskText.textContent = content;
//   taskText.style.flexGrow = '1';

//   const taskButton = document.createElement('button');
//   taskButton.style.marginLeft = '10px';

//   if (completed) {
//     // Already completed: disable button and move to completed container
//     taskButton.textContent = 'Completada';
//     taskButton.disabled = true;
//     completedContainer.appendChild(taskDiv);
//   } else {
//     // Not completed: normal button
//     taskButton.textContent = 'Completar';
//     messagesContainer.appendChild(taskDiv);

//     taskButton.addEventListener('click', () => {
//       fetch(`/complete-task/${id}`, { method: 'POST' })
//         .then(response => {
//           if (!response.ok) throw new Error('Failed to mark completed');
    
//           // Move task to completed container and update button state
//           completedContainer.appendChild(taskDiv);
//           taskButton.disabled = true;
//           taskButton.textContent = 'Completada';
    
//           // Fetch updated vidas from backend and re-render hearts
//           fetch('/get_vidas')
//             .then(res => res.json())
//             .then(data => {
//               const vidas = data.vidas || 0;
//               const heartsContainer = document.getElementById('heartscontainers');
//               heartsContainer.innerHTML = ''; // Clear existing hearts
//               for (let i = 0; i < vidas && i < frames.length; i++) {
//                 const img = document.createElement('img');
//                 img.src = frames[i];
//                 img.alt = 'Heart animation frame';
//                 img.style.marginRight = '5px';
//                 heartsContainer.appendChild(img);
//               }
//               imagesShown = vidas;
//               currentFrame = vidas % frames.length;
//             });
//         })
//         .catch(() => alert('Error marking task as completed'));
//     });
    
//   }

//   taskDiv.appendChild(taskText);
//   taskDiv.appendChild(taskButton);
// }

// // Load existing tasks from backend, do NOT add hearts here for completed tasks


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
//     // Fetch messages again to get the new task with ID and completed=0
//     fetch('/messages')
//       .then(response => response.json())
//       .then(data => {
//         // Clear tasks to avoid duplicates, then re-add all
//         document.getElementById('messagesContainer').innerHTML = '';
//         document.getElementById('completedTasksContainer').innerHTML = '';
//         imagesShown = 0; // reset hearts count on reload
//         currentFrame = 0;
//         data.messages.forEach(msg => {
//           addTaskToDOM(msg);
//         });
//       });
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

// Function to update hearts display based on backend vidas
function updateHearts() {
  fetch('/get_vidas')
    .then(res => res.json())
    .then(data => {
      const vidas = data.vidas || 0;
      const heartsContainer = document.getElementById('heartscontainers');
      heartsContainer.innerHTML = ''; // Clear old hearts

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
    .catch(err => console.error('Error fetching vidas:', err));
}

// Function to add a task to DOM with complete/edit/delete options
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

  taskDiv.appendChild(taskText);

  if (!completed) {
    // Create Complete button
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Completar';
    completeButton.style.marginLeft = '10px';

    // Create Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.style.marginLeft = '10px';

    // Create Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.style.marginLeft = '10px';

    taskDiv.appendChild(completeButton);
    taskDiv.appendChild(editButton);
    taskDiv.appendChild(deleteButton);

    // Complete button handler
    completeButton.addEventListener('click', () => {
      fetch(`/complete-task/${id}`, { method: 'POST' })
        .then(response => {
          if (!response.ok) throw new Error('Failed to mark completed');

          // Move task to completed container, remove buttons
          taskDiv.innerHTML = '';
          taskText.textContent = content;
          taskDiv.appendChild(taskText);
          completedContainer.appendChild(taskDiv);

          updateHearts();
        })
        .catch(() => alert('Error marking task as completed'));
    });

    // Edit button handler
    editButton.addEventListener('click', () => {
      const newContent = prompt('Editar tarea:', taskText.textContent);
      if (newContent !== null && newContent.trim() !== '') {
        fetch(`/edit-task/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newContent.trim() }),
        })
        .then(response => {
          if (!response.ok) throw new Error('Error editing task');
          taskText.textContent = newContent.trim();
        })
        .catch(() => alert('Error editing task'));
      }
    });

    // Delete button handler
    deleteButton.addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        fetch(`/delete-task/${id}`, { method: 'DELETE' })
          .then(response => {
            if (!response.ok) throw new Error('Error deleting task');
            taskDiv.remove();
          })
          .catch(() => alert('Error deleting task'));
      }
    });

    messagesContainer.appendChild(taskDiv);
  } else {
    // Completed tasks: no buttons, just text in completed container
    completedContainer.appendChild(taskDiv);
  }
}

// Load existing tasks and hearts on page load
window.addEventListener('DOMContentLoaded', () => {
  fetch('/messages')
    .then(response => response.json())
    .then(data => {
      document.getElementById('messagesContainer').innerHTML = '';
      document.getElementById('completedTasksContainer').innerHTML = '';
      imagesShown = 0;
      currentFrame = 0;

      data.messages.forEach(msg => addTaskToDOM(msg));
    })
    .catch(() => console.error('Error loading messages'));

  updateHearts();
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
    // Reload tasks to get correct IDs and status
    fetch('/messages')
      .then(response => response.json())
      .then(data => {
        document.getElementById('messagesContainer').innerHTML = '';
        document.getElementById('completedTasksContainer').innerHTML = '';
        imagesShown = 0;
        currentFrame = 0;
        data.messages.forEach(msg => addTaskToDOM(msg));
      });
    input.value = '';
  })
  .catch(() => alert('Error sending message'));
});
