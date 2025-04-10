$(function () {
  function load_template(name, callback) {
    $.get(`templates/${name}.html`, function (template) {
      callback(template);
    }).fail(function (jqXHR, textStatus, error) {
      console.error(`Template load error: ${name}: ${textStatus}, ${error}`);
      alert(`Template ${name} load failed. Check out the console`)
    });
  }
  function load_data() {
    $.getJSON("data.json", function (data) {
      documents = data;
    }).fail(function (jqXHR, textStatus, error) {
      console.error("Ошибка загрузки JSON: " + textStatus + ", " + error);
      alert("Не удалось загрузить данные. Проверьте консоль.");
    });
  }

  let content = $("main>#content");
  let documents = [];

  function disp_document(document) {
    let res = $("<div class='document'>");
    res.append([
      $("<h3>").text(document.title),
      $("<p>").text(document.author),
      $("<p>").text(document.date),
      $("<p>").text(document.type.join(', '))
    ]);
    return res;
  }

  function tab_btn_act(callback) {
    return function (e) {
      e.preventDefault();
      $(".tabs a").removeClass("active");
      $(this).addClass("active");
      content.empty();
      callback();
    }
  }

  function groupBooksByType(books) {
    const groupedBooks = {};

    for (const book of books) {
      for (const type of book.type) {
        if (groupedBooks[type]) {
          groupedBooks[type].push(book);
        } else {
          groupedBooks[type] = [book];
        }
      }
    }

    return groupedBooks;
  }

  $(".tabs a[data-tab='add']").click(tab_btn_act(() => {
    load_template("add", function (template) {
      content.append(template);

      $("#add-document-form").submit(function (event) {
        event.preventDefault();

        const newDocument = {
          "title": $("#title").val(),
          "author": $("#author").val(),
          "date": $("#date").val(),
          "type": $("#type").val()
        };

        documents.push(newDocument);
        console.log(documents);
        $("#add-document-form")[0].reset();
      });
    })
  }));
  $(".tabs a[data-tab='old']").click(tab_btn_act(() => {
    content.append($("<h2>").text("Старые документы"));
    let docs_disp = $("<div>");
    documents.forEach((doc, inx) => {
      docs_disp.append(disp_document(doc));
    });
    content.append(docs_disp);
  }));
  $(".tabs a[data-tab='new']").click(tab_btn_act(() => {
    content.append($("<h2>").text("Новые документы"));
    let docs_disp = $("<div>");
    documents.forEach((doc, inx) => {
      docs_disp.prepend(disp_document(doc));
    });
    content.append(docs_disp);
  }))
  $(".tabs a[data-tab='by-type']").click(tab_btn_act(() => {
    content.append($("<h2>").text("По типу"));
    let docs_disp = $("<div>");
    let gropued_docs = groupBooksByType(documents);
    for (const type in gropued_docs) {
      let type_div = $("<div class='type-group'>");
      type_div.append($("<h3>").text(type))
      for (const doc of gropued_docs[type]) {
        type_div.append(disp_document(doc));
      }
      docs_disp.append(type_div);
    }
    content.append(docs_disp);
  }))
  $(".tabs a[data-tab='by-author-date']").click(tab_btn_act(()=>{
    content.append($("<h2>").text("По автору/дате"));

    const group_by_author_date = {};
    documents.forEach(function(doc) {
      const key = `${doc.author}-${doc.date}`;
      if (group_by_author_date[key])
        group_by_author_date[key].push(doc);
      else
        group_by_author_date[key] = [doc];
    });

    let type_for_disp = $("<div>");
    for (const key in group_by_author_date) {
      const [author, date] = key.split('-');
      let type_div = $("<div class='author-date-group'>")
      type_div.append($("<h3>").text(`Автор: ${author}, Дата: ${date}`));

      group_by_author_date[key].forEach(function(doc){
        type_div.append(disp_document(doc));
      });
      type_for_disp.append(type_div);
    }
    content.append(type_for_disp);
  }));
  load_data();
  console.log(groupBooksByType(documents));
  $(".tabs a[data-tab='add']").click();
})