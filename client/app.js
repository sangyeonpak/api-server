const $roomsList = $(".roomsList");
const $mainContainer = $(".mainContainer");
const $addRoomButton = $(".addRoomButton");
const $mainItemsList = $('.mainItemsList');
$mainItemsList.hide();

const $modalBody = $('#modalBody');
const $addItemModal = $('#addItemModal');
$addItemModal.hide();

//============================================ do GET request then append items to the main inventory div =============================================
$.get("/api/main").then((data) => {
  for (let key in data[0]){ // appends "rooms" (my columns) to the main screen (dynamic; pulls columns from DB)
    if (key !="name" && key != "total"){
      const $rooms = $(`<div class="rooms" id="${key}Total"></div>`);
      const $roomsForModal = $(`
      <div>
        # in ${key}:
        <input type="number" name="${key}" id="${key}Count" min="0" class="addItemInputs">
      </div>`);
      $(".roomsList").append($rooms);
      $('#modalBody').append($roomsForModal);
      $rooms.text(`${key} ⋮`);
    }
  }
  for(items of data){ // appends items items list (dynamic; pulls items from DB)
    const $itemsInMainList = $(`<div class="item" id="${items.name}Main" name="${items.name}"></div>`);
    $itemsInMainList.html(`${items.name} total: ${items.total} <br>`);
    for (let key in items){
      if (key !="name" && key != "total"){
        $itemsInMainList.html(($itemsInMainList.html()).concat(`<div id=${items.name}>&nbsp&nbsp&nbsp&nbsp&nbsp${key}: ${items[key]} <button class="btn patchButton" name="${items.name}" value="${key}">+</button><button class="btn patchButton" name="${items.name}" value="${key}">-</button><br></div>`));
      }
    }
    $(".mainItemsList").append($itemsInMainList);
  }
  whichPatchButton($(`.patchButton`));
});

//============================================== inventory and inventory2 buttons have slightly different functionality ===============================
const $inventory = $(".inventory");
const $inventory2 = $(".inventory2");
$inventory2.hide();

const $searchArea = $(".searchArea");
const $searchBar = $("#searchBar");
const $searchResults = $(".searchResults");
const $itemAlreadyExists = $('.itemAlreadyExists');

$inventory.click(() => {
  $inventory2.show();
  $roomsList.hide(100);
  $mainItemsList.show(100);
  $searchResults.empty();
  $inventory.hide();
  $addRoomButton.detach();
  $itemAlreadyExists.hide();
})

function showMainMenu(){
  $inventory.show();
  $roomsList.show(100);
  $mainItemsList.hide(100);
  $searchResults.empty();
  $inventory2.hide();
  $mainContainer.append($addRoomButton);
  $itemAlreadyExists.hide();
}

$inventory2.click(() => {
  showMainMenu();
})

//========================================== do GET request of search query, then append items to search results div ==================================
$searchArea.submit((event) => {
  event.preventDefault();
  $searchResults.empty();
  $roomsList.hide(100);
  $mainItemsList.hide(100);
  $inventory.hide();
  $inventory2.show();
  $itemAlreadyExists.hide();
  $addRoomButton.detach();
  if ($searchBar.val() === '' || $searchBar.val() === null) $searchResults.html("<h5>Type something to search!</h5>");
  $.get(`/api/items/${$searchBar.val()}`).then((data) => {
    if(data.length === 0) $searchResults.append("<h5>Nothing found!</h5>");
    for(items of data){
      const $resultingItem = $(`<div class="searchedItem" id=${items.name}Searched name="${items.name}"></div>`);
      $resultingItem.html(`${items.name} total: ${items.total} <br>`);
      for (let key in items){
        if (key !="name" && key != "total"){
          $resultingItem.html(($resultingItem.html()).concat(`&nbsp&nbsp&nbsp&nbsp&nbsp${key}: ${items[key]} <button class="btn patchButtonSearch" name="${items.name}" value="${key}">+</button><button class="btn patchButtonSearch" name="${items.name}" value="${key}">-</button><br>`)); //&nbsp ftw
        }
      }
      $searchResults.hide().show(100);
      $searchResults.append($resultingItem);
    }
    whichPatchButton($(`.patchButtonSearch`));
  })
})

//=================================== on click, trigger modal, do POST request, then append items to main inventory div ===============================
const $addItemButton = $('#addItemButton');
const $itemAddedAlert = $('#itemAddedAlert');
$itemAddedAlert.hide();
$addItemButton.click(() => {
  const $addItemInputs = $('.addItemInputs');
  const $addItemName = $('#addItemName');
  const $form = $('#addItemForm');
  $addItemName.val(null);
  $addItemInputs.val(null);
  $form.submit((event) => { // unfortunately gotta leave $form inside to reinitialize event listener
    event.preventDefault();
    let data = new FormData(event.target);
    let requestBody = {};
    for (var [key, value] of data.entries()) {
      requestBody[key] = value;
    }
    const $itemsInMainList = $('<div class="item"></div>');
    fetch(`/api/items`, {
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(requestBody)
    }).then((response, error) => {
      if (response.status !== 500) return response.json(); //! case 1
      else { //! case 2
        $itemAlreadyExists.empty();
        $itemAlreadyExists.append(`Item already exists: ${requestBody.name}`)
        $itemAlreadyExists.show();
        $roomsList.hide(100);
        $mainItemsList.hide(100);
        $addRoomButton.detach();
        $inventory.hide();
        $inventory2.show();
      }
    }).then((response) => {
      if (response === undefined) return; //! case 2, continue below for case 1
      showMainMenu();
      $itemAddedAlert.show();
      setTimeout(() => $itemAddedAlert.hide(100), "1000");
      const $itemsInMainList = $('<div class="item"></div>');
      let total = 0;
      for (let key in requestBody){
        if (key !="name" && key != "total") {
          total += Number(requestBody[key]);
        }
      }
      $itemsInMainList.html(`${requestBody.name} total: ${total} <br>`); // gotta find a way later
      for (let key in requestBody){
        if (key !="name" && key != "total"){
          $itemsInMainList.html(($itemsInMainList.html()).concat(`&nbsp&nbsp&nbsp&nbsp&nbsp${key}: ${requestBody[key]} <br>`));
        }
      }
      $(".mainItemsList").append($itemsInMainList);
    });
  $form.unbind('submit'); // removes event listener at the end to not have duplicate input later
  })
})

function patchRequest(){
  fetch(`/api/items`, {
    headers: {
      "Content-Type": "application/json",
      'Accept': 'application/json'
    },
    method: "PATCH",
    body: JSON.stringify(requestBody)
  })
}

function whichPatchButton (patchButton) {
  $(patchButton).click((event)=>{
    console.log(event.target.name);
    console.log(event.target.value);
    console.log(event.target.textContent);
  })
}
whichPatchButton($(`.patchButton`));