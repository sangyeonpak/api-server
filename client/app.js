let $inventory = $(".inventory");
let $inventory2 = $(".inventory2");
let $mainContainer = $(".mainContainer");
let $addTableButton = $(".addTableButton");
$inventory2.hide();
let $tablesList = $(".tablesList");
let $searchResults = $(".searchResults");
let $mainItemsList = $('.mainItemsList').toggle();
$mainContainer.append($mainItemsList);

$.get("/api/main").then((data) => {

  for (let key in data[0]){
    if (key !="name" && key != "total"){
      let $table = $(`<div class="table" id="${key}"><div>`);
      $tablesList.append($table);
      $table.text(`${key} ⋮`);
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

let $searchArea = $("#searchArea");
let $searchBar = $("#searchBar");
$searchArea.submit((event) => {
  event.preventDefault();
  $('.tablesList').hide(100);
  $('.mainItemsList').hide(100);
  $searchResults.empty();
  $inventory.hide();
  $inventory2.show();
  $addTableButton.detach();
  console.log($searchBar.val());
  if ($searchBar.val() === '' || $searchBar.val() === null) {
    console.log('here');
    $searchResults.html("<h5>Nothing found!</h5>");
  }

  $.get(`/api/items/${$searchBar.val()}`).then((data) => {
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
      $searchResults.append($resultingItem);
    }
  })
})