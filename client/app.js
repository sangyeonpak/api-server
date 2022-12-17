let $inventory = $(".inventory");
// $inventory.click(() => {
//   fetch("/api/items")
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data);
//   });
// })

let $itemsList = $('.itemsList').toggle();
  $('.mainContainer').append($itemsList);
  $.get("/api/items").then((data) => {

    for(items of data){
      let $itemResult = $('<div class="itemDiv"></div>');
      $itemsList.append($itemResult);
      $itemResult.text(`${items.name} total: ${items.total}`);
    }

  });

$inventory.click(() => {
  $('.kitchen').toggle(100);
  $('.bathroom').toggle(100);
  $('.itemsList').toggle(100);
})