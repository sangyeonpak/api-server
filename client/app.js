let $inventory = $(".inventory");
let $inventory2 = $(".inventory2");
$inventory2.hide();
let $tablesList = $(".tablesList");
let $searchResults = $(".searchResults");
let $mainItemsList = $('.mainItemsList').toggle();
$('.mainContainer').append($mainItemsList);

$.get("/api/items").then((data) => {

  for (let key in data[0]){
    if (key !="name" && key != "total"){
      let $table = $(`<div class="table" id="${key}"><div>`);
      $tablesList.append($table);
      $table.text(`${key} ⋮`);
    }
  }

  for(items of data){

    let $itemResult = $('<div class="item"></div>');
    $itemResult.html(`${items.name} total: ${items.total} <br>`);
    for (let key in items){
      if (key !="name" && key != "total"){
        // console.log(key);
        // console.log($itemResult.html());
        $itemResult.html(($itemResult.html()).concat(`&nbsp&nbsp&nbsp&nbsp&nbsp${key}: ${items[key]} <br>`));
      }
    }
    $mainItemsList.append($itemResult);
  }

});

let state = false;
$inventory.click(() => {
  $inventory2.show();
  state = !state;
  $('.tablesList').hide(100);
  $('.mainItemsList').show(100);
  $searchResults.empty();
  $inventory.hide();
})

$inventory2.click(() => {
  $inventory.show();
  state = !state;
  $('.tablesList').show(100);
  $('.mainItemsList').hide(100);
  $searchResults.empty();
  $inventory2.hide();
})

let $searchArea = $("#searchArea");
let $searchBar = $("#searchBar");
$searchArea.submit((event) => {
  event.preventDefault();
  $('.tablesList').hide(100);
  $('.mainItemsList').hide(100);
  $inventory.hide();
  $inventory2.show();
  console.log($searchBar.val());
  if ($searchBar.val() === '' || $searchBar.val() === null) {
    console.log('here');
    $searchResults.html("<h5>Nothing found!</h5>");
  }
  $.get(`/api/items/${$searchBar.val()}`).then((data) => {
    console.log(data);

  })
})