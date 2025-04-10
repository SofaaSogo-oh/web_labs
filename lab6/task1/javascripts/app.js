var main = function () {
  "use strict";
  var toDos = [
    "Закончить писать эту книгу",
    "Вывести Грейси на прогулку в парк",
    "Ответить на электронные письма",
    "Подготовиться к лекции в понедельник",
    "Обновить несколько новых задач",
    "Купить продукты"
  ];
  $(".tabs a span").each(function (index, element) {
    $(element).on("click", function () {
      var $element = $(element),
        $content;
      $(".tabs>a>span").removeClass("active");
      $element.addClass("active");
      $("main .content").empty();
      if ($element.parent().is(":nth-child(1)")) {
        $content = $("<ul>").prepend(...toDos.map(x => $("<li>").text(x)));
      } else if ($element.parent().is(":nth-child(2)")) {
        $content = $("<ul>").append(...toDos.map(x => $("<li>").text(x)));
      } else if ($element.parent().is(":nth-child(3)")) {
        console.log("Pressed tag key");
        var organizedByTag = [
          {
            "name": "покупки",
            "toDos": ["Купить продукты "]
          },
          {
            "name": "рутина",
            "toDos": ["Купить продукты", "Вывести Грейси на прогулку в парк "]
          },
          /* и т. д. */
        ];
        organizedByTag.forEach(tag => {
          let $tag_name = $("<h3>").text(tag.name),
            $content = $("<ul>").append(...tag.toDos.map(x => $("<li>").text(x)));
          $("main .content").append($tag_name);
          $("main .content").append($content);
        });
      } else if ($element.parent().is(":nth-child(4)")) {
        $content = $("<div>");
        $content.append($("<p>").text("Добавьте новую задачу"));
        var $input = $("<input>"),
          $button = $("<button>");
        $content.append($input);
        $content.append($button.text("+"));
        var addTaskFromInputBox = function () {
          if ($input.val() !== "") {
            toDos.push($input.val());
            $input.val("");
          }
        };
        $button.on("click", function (event) {
          addTaskFromInputBox();
        });
        $input.on("keypress", function (event) {
          if (event.keyCode === 13) {
            addTaskFromInputBox();
          }
        });
      }
      $("main .content").append($content);
      return false;
    });
  });
  $(".tabs a:first-child span").trigger("click");
};
// $(document).ready(main);
$(main);