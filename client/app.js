let $inventory = $(".inventory");
let $inventory2 = $(".inventory2");
let $mainContainer = $(".mainContainer");
let $addTableButton = $(".addTableButton");
$inventory2.hide();
let $tablesList = $(".tablesList");
let $searchResults = $(".searchResults");
let $mainItemsList = $('.mainItemsList').toggle();
let $addItemButton = $('#addItemButton');
let $addItemModal = $('#addItemModal');
$addItemModal.hide();
$mainContainer.append($mainItemsList);
let $addItemForm = $('#addItemForm');
let $toggleModal = $('.toggleModal');

$.get("/api/main").then((data) => {

  for (let key in data[0]){
    if (key !="name" && key != "total"){
      let $tables = $(`<div class="tables" id="${key}Total"><div>`);
      let $tablesForModal = $(`
      <div>
        # in ${key}:
        <input type="number" name="${key}" id="${key}Count" min="0" class="addItemInputs">
      </div>`);
      $tablesList.append($tables);
      $addItemForm.append($tablesForModal);
      $tables.text(`${key} ⋮`);
    }
  }

  for(items of data){

    let $itemsInMainList = $('<div class="item"></div>');
    $itemsInMainList.html(`${items.name} total: ${items.total} <br>`);
    for (let key in items){
      if (key !="name" && key != "total"){
        // console.log(key);
        // console.log($itemsInMainList.html());
        $itemsInMainList.html(($itemsInMainList.html()).concat(`&nbsp&nbsp&nbsp&nbsp&nbsp${key}: ${items[key]} <br>`));
      }
    }
    $mainItemsList.append($itemsInMainList);
  }

});


$inventory.click(() => {
  $inventory2.show();
  $('.tablesList').hide(100);
  $('.mainItemsList').show(100);
  $searchResults.empty();
  $inventory.hide();
  $addTableButton.detach();
})

$inventory2.click(() => {
  $inventory.show();
  $('.tablesList').show(100);
  $('.mainItemsList').hide(100);
  $searchResults.empty();
  $inventory2.hide();
  $mainContainer.append($addTableButton);
})

let $searchArea = $(".searchArea");
let $searchBar = $("#searchBar");
$searchArea.submit((event) => {
  event.preventDefault();
  $('.tablesList').hide(100);
  $('.mainItemsList').hide(100);
  $searchResults.empty();
  $inventory.hide();
  $inventory2.show();
  $addTableButton.detach();

  if ($searchBar.val() === '' || $searchBar.val() === null) {
    $searchResults.html("<h5>Nothing found!</h5>");
  }

  $.get(`/api/items/${$searchBar.val()}`).then((data) => {
    console.log(data.length);
    console.log(data);
    for(items of data){
      let $resultingItem = $('<div class="searchedItem"></div>');
      $resultingItem.html(`${items.name} total: ${items.total} <br>`);
      for (let key in items){
        if (key !="name" && key != "total"){
          // console.log(key);
          // console.log($resultingItem.html());
          $resultingItem.html(($resultingItem.html()).concat(`&nbsp&nbsp&nbsp&nbsp&nbsp${key}: ${items[key]} <br>`));
        }
      }
      $searchResults.hide().show(100);
      $searchResults.append($resultingItem);
    }
  })
})

$addItemButton.click(() => {
  let $modalBackdrop = $('.modal-backdrop');
  let $addItemInputs = $('.addItemInputs');
  let $addItemName = $('#addItemName');


  /* what am i trying to do
  1) since my input fields are dynamically generated, i have to find a way to get the ids of each input fields

  2) when they click "save change" button, gotta do post request for all count boxes
  2.1) if val is null, 0
  3) append results to main inventory menu

  */

  // let postRequestBody = {};
  // for (inputFields of $addItemInputs){
  //   let idAlsoKey =
  //   postRequestBody.inputFields = 0;
  //   console.log(inputFields);
  // }
  console.log(postRequestBody);
  // for ($addItemInputs.length)
  $addItemName.val(null);
  $addItemInputs.val(null);
  $toggleModal.click(() => {
    $addItemName.val(null);
    $addItemInputs.val(null);
  });
});
