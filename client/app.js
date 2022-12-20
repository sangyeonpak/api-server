const $roomsList = $(".roomsList");
const $mainContainer = $(".mainContainer");
const $addRoomButton = $(".addRoomButton");
const $mainItemsList = $('.mainItemsList');
$mainItemsList.hide();

const $areYouSureAlert = $('#areYouSureAlert');
$areYouSureAlert.hide();

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
        <input type="number" name="${key}" id="${key}Input" min="0" class="addItemInputs">
      </div>`);
      $(".roomsList").append($rooms);
      $('#modalBody').append($roomsForModal);
      $rooms.text(`${key} ⋮`);
    }
  }
  for(items of data){ // appends items items list (dynamic; pulls items from DB)
    const $itemsInMainList = $(`<div class="item" id="${items.name}Main" name="${items.name}"></div>`);
    $itemsInMainList.html(`${items.name} total: <span class="${items.name}Total">${items.total}</span><button class="deleteButton" name=${items.name}>x</button><br>`);
    for (let key in items){
      if (key !="name" && key != "total"){
        $itemsInMainList.html(($itemsInMainList.html()).concat(`<div id=${items.name}At${key}>&nbsp&nbsp&nbsp&nbsp&nbsp${key}: <span class="${items.name}CountAt${key}" value="${key}">${items[key]}</span><button class="patchButton" name="${items.name}" value="${key}">+</button><button class="patchButton" name="${items.name}" value="${key}">-</button><br></div>`));
      }
    }
    $(".mainItemsList").append($itemsInMainList);
  }
  whichDeleteButton(`.deleteButton`);
});



//============================================== inventory and inventory2 buttons have slightly different functionality ===============================
const $inventory = $(".inventory");
const $inventory2 = $(".inventory2");
$inventory2.hide();

const $searchArea = $(".searchArea");
const $searchBar = $("#searchBar");
const $itemAlreadyExists = $('.itemAlreadyExists');
const $searchResults = $(".searchResults");
$searchResults.hide();

$inventory.click(() => {
  $inventory2.show();
  $roomsList.hide(100);
  $mainItemsList.show(100);
  $searchResults.empty();
  $searchResults.hide();
  $inventory.hide();
  $addRoomButton.detach();
  $itemAlreadyExists.hide();
  whichPatchButton($(`.patchButton`));
})

function showMainMenu(){
  $inventory.show();
  $roomsList.show(100);
  $mainItemsList.hide(100);
  $searchResults.empty();
  $inventory2.hide();
  $searchResults.hide();
  $mainContainer.append($addRoomButton);
  $itemAlreadyExists.hide();
  $('.patchButton').unbind('click');
}

$inventory2.click(() => {
  showMainMenu();
})

//========================================== do GET request of search query, then append items to search results div ==================================
$searchArea.submit((event) => {
  event.preventDefault();
  $searchResults.show();
  $searchResults.empty();
  $roomsList.hide(100);
  $mainItemsList.hide(100);
  $inventory.hide();
  $inventory2.show();
  $itemAlreadyExists.hide();
  $addRoomButton.detach();
  $('.patchButtonSearch').unbind('click');
  let $noInput = $(`<div id="noInput"></div>`);
  $noInput.html(`Nothing found!`);
  $searchResults.append($noInput);
  if ($searchBar.val() === '' || $searchBar.val() === null) {
    $searchResults.html(`<div id="blankInput">Type something to search!</div>`).hide().show(100);
    $noInput.hide();
  }
  $.get(`/api/items/${$searchBar.val()}`).then((data) => {
    $noInput.hide();
    $searchResults.append($(`<div id="searchedFor">Searched for: ${$searchBar.val()}.</div>`))
    for(items of data){
      const $resultingItem = $(`<div class="searchedItem" id=${items.name}Searched name="${items.name}"></div>`);
      $resultingItem.html(`${items.name} total: <span class="${items.name}Total">${items.total}</span></div><br>`);
      for (let key in items){
        if (key !="name" && key != "total"){
          $resultingItem.html(($resultingItem.html()).concat(`&nbsp&nbsp&nbsp&nbsp&nbsp${key}: <span class="${items.name}CountAt${key}" value="${key}">${items[key]}</span><button class="patchButtonSearch" name="${items.name}" value="${key}">+</button><button class="patchButtonSearch" name="${items.name}" value="${key}">-</button><br>`)); //&nbsp ftw
        }
      }
      $searchResults.hide().show();
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
  $(`.patchButton`).unbind('click');
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
    }).then((response) => {
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
      $itemAddedAlert.show(100);
      setTimeout(() => $itemAddedAlert.hide(100), "1750");
      const $itemsInMainList = $('<div class="item"></div>');
      let total = 0;
      for (let key in requestBody){
        if (key !="name" && key != "total") {
          total += Number(requestBody[key]);
        }
      }
      $itemsInMainList.html(`${requestBody.name} total: <span class="${requestBody.name}Total">${total}</span> <br>`); // gotta find a way later
      for (let key in requestBody){
        if (key !="name" && key != "total"){
          $itemsInMainList.html(($itemsInMainList.html()).concat(`&nbsp&nbsp&nbsp&nbsp&nbsp${key}: <span class="${requestBody.name}CountAt${key}" value="${key}">${requestBody[key]}</span> <br>`));
        }
      }
      $(".mainItemsList").append($itemsInMainList);
    });
  whichPatchButton($(`.patchButton`));
  $form.unbind('submit'); // removes event listener at the end to not have duplicate input later
  })
})

function whichPatchButton (patchButton) {
  $(patchButton).click((event)=>{
    let requestBody = {
      "name": event.target.name,
      "location": event.target.value,
      "operator": event.target.textContent
    }
    fetch(`/api/items/${requestBody.name}`, {
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      method: "PATCH",
      body: JSON.stringify(requestBody)
    }).then((response) => {
      return response.json();
    }).then((response) => {
      console.log(response);
      for (let key in response){
        if (key !="name" && key != "total"){
          $(`.${response.name}CountAt${key}`).text(response[key]);
          $(`.${response.name}Total`).text(response.total);
        }
      }
    })
  })
}

function whichDeleteButton(deleteButton){
  $(deleteButton).click((event) => {
    $areYouSureAlert.html(`Are you sure you want to delete <u>${event.target.name}</u>?<button id="closeAlert">x</button><br><button id="deleteForReal">Yes</button>`)
    let requestBody = {
      "name": event.target.name
    }
    $('#deleteForReal').click(() => {
      $areYouSureAlert.hide();
      fetch(`/api/items/${requestBody.name}`, {
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        method: "DELETE",
        body: JSON.stringify(requestBody)
      })
      $(`#${requestBody.name}Main`).remove();
      $(`#${requestBody.name}Searched`).remove();
    })
    $('#closeAlert').click(() => {
      $areYouSureAlert.hide(100);
    })
    $areYouSureAlert.show(100);
  })
}