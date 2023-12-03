var itemCounter = 0;
var windowStart = 0;
var windowEnd = 12;
var maxItem = 7;

const getCategories = async () => {
  checkLoggedIn();
  categoriesUrl = url + "/api/Category";
  const resp = await fetch(categoriesUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  const data = await resp.json();
  // Insert into Navbar
  data.map((cat, key) => {
    document
      .querySelector(".navbar .categories")
      .insertAdjacentHTML(
        "beforeend",
        `<span 
        onclick=createNewSearch("category",${cat.categoryId})
        class="item ${key < maxItem ? "" : "hidden"}">${
          cat.categoryName
        }</span>`
      );
  });
  console.log(data);
};
