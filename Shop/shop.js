const SHOP_SERVER = "http://localhost:8085/product";
const SINGLE_PRODUCT_SERVER = "http://localhost:8085/product/single";
const FAV_ITEMS = "http://localhost:8085/shop/favItems";
let productID;
$(document).ready(async function () {
  $(".search-btn").click(async () => {
    const productName = $(".search-input").val();

    $(".loading").show();
    try {
      const res = await axios.get(SINGLE_PRODUCT_SERVER, {
        params: {
          name: productName,
        },
      });


      if (res.data.product.length === 0) {
        $(".user-message.user-message--error").text("NO PRODUCTS FOUND");
        setTimeout(() => {
          $(".user-message.user-message--error").text("");
        }, 3000);
      } else {
        $(".product-list .row").text("");
        const products = res.data.product;
        for (let i = 0; i < products.length; ++i) {
          $(".product-list .row").append(
            "\
            <div class='card col-md-6 col-lg-4 mt-4'>\
            <div class='content'>\
            <div class='inner-content coleql_height'>\
            <small class='d-block mb-2'> By " +
              products[i].creator.name +
              "</small>\
            <div class='embed-responsive embed-responsive-1by1'>\
            <div class='full-img'>\
            <img src='" +
              products[i].imageUrl +
              "'> alt=''/>\
            </div>\
            </div>\
            <div class='overlay'>\
              <p>" +
              products[i].name +
              "</p>\
              <ul>\
                <li>$" +
              products[i].price +
              "</li>\
                <li  '><div name='" +
              products[i]._id +
              "' class='fav-btn btn btn-primary'>ADD TO FAVOURITE</div></li>\
              </ul>\
            </div>\
          </div>\
        </div>\
        </div> "
          );
        }
      }
    } catch (err) {}
    $(".loading").hide();
  });

  const res = await axios.get(SHOP_SERVER);
  const products = res.data.products;
  for (var i = 0; i < products.length; ++i) {
    $(".product-list .row").append(
      "\
    <div class='card col-md-6 col-lg-4 mt-4'>\
    <div class='content'>\
    <div class='inner-content coleql_height'>\
    <small class='d-block mb-2'> By " +
        products[i].creator.name +
        "</small>\
    <div class='embed-responsive embed-responsive-1by1'>\
    <div class='full-img'>\
    <img src='" +
        products[i].imageUrl +
        "'> alt=''/>\
    </div>\
    </div>\
    <div class='overlay'>\
      <p>" +
        products[i].name +
        "</p>\
      <ul>\
        <li>$" +
        products[i].price +
        "</li>\
        <li><div name='" +
        products[i]._id +
        "'class='fav-btn btn btn-primary'>ADD TO FAVOURITE</div></li>\
      </ul>\
    </div>\
  </div>\
</div>\
</div> "
    );
  }

  $(".fav-btn").click((event) => {
    productID = event.currentTarget.attributes.name.value;
    $(".modal").addClass("open");
    $(".backdrop").addClass("open");
  });

  $(".modal__action--negative").click(() => {
    $(".modal").removeClass("open");
    $(".backdrop").removeClass("open");
  });
  // add to fav
  $(".modal__action").click(async (event) => {
    $(".model-loading").show();
    try {
      const res = await axios.post(FAV_ITEMS, { productId: productID });
    } catch (error) {
      console.log(error);
    }

    $(".model-loading").hide();

    $(".modal").removeClass("open");
    $(".backdrop").removeClass("open");
  });



});

