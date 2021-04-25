const FAV_ITEMS = "http://localhost:8085/shop/favItems";

$(document).ready(async function () {
  const res = await axios.get(FAV_ITEMS);
  const data = res.data.result;

  if (data.length === 0) {
    $(".product-list .row").text("NO FAVORITE ITEMS FOUND");
  }

  for (var i = 0; i < data.length; ++i) {
    $(".product-list .row").append(
      "\
      <div class='card col-md-6 col-lg-4 mt-4'>\
      <div class='content'>\
      <div class='inner-content coleql_height'>\
      <small class='d-block mb-2'> By " +
        data[i].creator.name +
        "</small>\
      <div class='embed-responsive embed-responsive-1by1'>\
      <div class='full-img'>\
      <img src='" +
        data[i].product.imageUrl +
        "'> alt=''/>\
      </div>\
      </div>\
      <div class='overlay'>\
        <p>" +
        data[i].product.name +
        "</p>\
        <ul>\
          <li>$" +
        data[i].product.price +
        "</li>\
          <li><div name='" +
        data[i].product._id +
        "'class='fav-btn btn btn-primary'>REMOVE FROM FAVOURITE</div></li>\
        </ul>\
      </div>\
    </div>\
  </div>\
  </div> "
    );
  }

  $(".fav-btn").click(async (event) => {
    try {
      const productID = event.currentTarget.attributes.name.value;
      const res = await axios.post(FAV_ITEMS, { productId: productID });
    } catch (error) {
      console.log(error);
    }
    window.location.replace("/favorites");
  });
});
