let events = JSON.parse(localStorage.getItem("events")) || []

document.getElementById("eventForm").addEventListener("submit", function(e){
  e.preventDefault()

  let title = document.getElementById("title").value
  let category = document.getElementById("category").value
  let duration = document.getElementById("duration").value
  let price = document.getElementById("price").value
  let info = document.getElementById("info").value

  let message = document.getElementById("message")

  if(title === "" || category === "" || duration === "" || price === ""){
    message.innerHTML = "Please fill all required fields"
    message.style.color = "red"
    return
  }

  let event = {
    id: Date.now(),
    title,
    category,
    duration,
    price,
    info
  }


  events.push(event)
  localStorage.setItem("events", JSON.stringify(events))

  message.innerHTML = "Event added successfully!"
  message.style.color = "green"

  displayEvents()
  document.getElementById("eventForm").reset()
})

function displayEvents(){
  let table = document.getElementById("eventTable")
  table.innerHTML = ""

  events.forEach((e, index)=>{
    table.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.title}</td>
        <td>${e.category}</td>
        <td>${e.duration}</td>
        <td>${e.price}</td>
        <td>${e.info}</td>
        <td>
          <button onclick="editEvent(${index})">Edit</button>
          <button onclick="deleteEvent(${index})">Delete</button>
        </td>
      </tr>
    `
  })
}

function deleteEvent(index){
  events.splice(index,1)
  localStorage.setItem("events", JSON.stringify(events))
  displayEvents()
}

function editEvent(index){
  let e = events[index]

  document.getElementById("title").value = e.title
  document.getElementById("category").value = e.category
  document.getElementById("duration").value = e.duration
  document.getElementById("price").value = e.price
  document.getElementById("info").value = e.info

  events.splice(index,1)
  displayEvents()
}

$("#search").on("keyup", function(){
  let value = $(this).val().toLowerCase()

  $("#eventTable tr").filter(function(){
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  })
})

displayEvents()
