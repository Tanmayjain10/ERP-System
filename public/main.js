
// Displaying modal-from when Add people button is clicked
document.getElementById("add-btn").addEventListener("click", () => {
  document.querySelector(".modal-form").style.display = "block";
});

// Removing modal-from when close button is clicked
document.querySelector(".close-button").addEventListener("click", () => {

  //Reset the form
  const form = document.getElementById("data-form");
  form.reset();
  document.querySelector(".modal-form").style.display = "none";
  document.querySelector(".err").style.display = "none";
});

// Removing modal-form when we click on window while modal is open
window.onclick = function(event) {
  const modalForm = document.querySelector(".modal-form");
  const updateForm = document.querySelector(".update-form");
  if(event.target == modalForm || event.target == updateForm) {
    const form = document.getElementById("data-form");
    form.reset();
    event.target.style.display="none";
    document.querySelector(".err").style.display = "none";
  }
}

// Update button
const update = document.querySelectorAll(".update-btn");
update.forEach(item => {
  item.addEventListener("click", () => {
    document.getElementById("email").value = item.value;
    document.querySelector(".update-form").style.display="block";
  });
});

// Close button of Update form
document.querySelector(".close-button-update").addEventListener("click", () => {
  document.querySelector(".update-form").style.display = "none";
})

//Send button
function sendCheckbox() {
  let checkboxes = document.getElementsByName("personCheckbox");
  let list = [];
  for(var checkbox of checkboxes) {
    if(checkbox.checked) {
      list.push(checkbox.value);
    }
    console.log(checkbox.value);
  }
  document.getElementById("send-email-btn").value = list;
}
