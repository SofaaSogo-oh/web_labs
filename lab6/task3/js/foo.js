$(function () {
  let docs = [];

  $(".tabs a").click(function(e) {
    e.preventDefault();

    const tabId = $(this).data("tab");

    $(".tab-content").hide();
    $("#" + tabId).show();

    $(".tabs a").removeClass("active");
    $(this).addClass("active");
  });
  $(".tabs a:first").click();

  $("#add-document-form").submit(function(event) {
    event.preventDefault();
    const new_doc = {
      "title": $("#title").val(),
      "author": $("#author").val(),
      "date": $("#date").val(),
      "type": $("#type").val()
    };
    docs.push(new_doc);
    console.log(docs);
    $("#add-document-form")[0].reset();
  });
})