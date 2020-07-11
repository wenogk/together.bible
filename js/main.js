
window.onload = () => {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  var elem = document.querySelector('#bible-language-list');
  var msnry = new Masonry( elem, {
  itemSelector: '.grid-item',
  columnWidth: 200
  });

}
