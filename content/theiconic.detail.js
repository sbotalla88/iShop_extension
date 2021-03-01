$(document).ready(() => {
    console.log("extension loaded");
    //user id will get from popup later on
    let userId = window.localStorage.getItem("userId");
    if (!userId) {
        const now = new Date().getTime();
        userId = now;
        window.localStorage.setItem("userId", now);
    }
    const save_icon = chrome.runtime.getURL("assets/icons/walah_icon.svg");
    const saveBtn = `<a href="#" class="ishop-detail-save"><span>Save item</span> <img src="${save_icon}" /><div class="ishop-loader"> </div></a>`;
    const ishopModal = `
        <div id="ishopModal" class="ishop-modal"> 
            <!-- Modal content -->
            <div class="ishop-modal-content">
                <!-- <span class="ishop-close">&times;</span> -->
                <iframe class="ishop-app-frame" src="" title="Add product" > </iframe>
                <!--
                <div class="text-field">
                    <div> 
                        <label>Brand Name: </label>
                        <span class="brand">...</span>
                    </div>
                </div>
                <div class="text-field">
                    <div> 
                        <label>Item Name: </label>
                        <span class="item-name">...</span>
                    </div>
                </div>
                <div class="text-field">
                    <div> 
                        <label>Item Price: </label>
                        <span class="item-price">...</span>
                    </div> 
                </div>
                -->
            </div>
        </div>`;
    $("body").append(ishopModal);
    $(".sticky-container").parent().prepend(saveBtn);
    $(".button-clear .ion-activatable").on("click", function () {
        console.log("close iframe");
    });
    $(".ishop-detail-save").on("click", async (e) => {
        e.preventDefault();
        console.log("iShop clicked");
        const target = $(e.target);
        let brand = $(".product-info .product-brand").text();
        brand = brand.replaceAll("&", "special_char_and");
        const item_name = $(".product-info .product-title").text();
        const item_price = $(".product-info .price").text();
        let item_img = $(".product-image-frame img").attr("src");
        item_img = item_img.split("http");
        item_img = item_img.pop();
        item_img = `http${item_img}`;
        item_img = decodeURIComponent(item_img);
        let item_url = window.location.href;
        item_url = item_url.split(".html");
        item_url = item_url[0] + ".html";
        $("#ishopModal .brand").html(brand);
        $("#ishopModal .item-name").html(item_name);
        $("#ishopModal .item-price").html(item_price);

        let item_id = item_url.split("?");
        item_id = item_id[0];
        item_id = item_id.split("-");
        item_id = item_id.pop();
        item_id = item_id.slice(0, -5);
        const itemData = {
            brand: brand,
            item_name: item_name,
            item_price: item_price,
        };
        let url_param = {
            title: item_name,
            vendor: brand,
            price: item_price,
            img_url: item_img,
            product_url: item_url,
        };
        let url_param_encoded = JSON.stringify(url_param);
        console.log(url_param_encoded);
        let new_url = `https://walah-b2156.firebaseapp.com/add-product/1?data=${url_param_encoded}`;
        // let new_url = `http://localhost:4200/add-product/1?data=${url_param_encoded}`;
        $("#ishopModal iframe").attr("src", new_url);

        // window.open(new_url, "_blank");
        $(target).find(".ishop-loader").addClass("ishop-loading");
        // await writeDB(userId, itemData); // function in content/firebase.ligb.js
        $(target).find(".ishop-loader").removeClass("ishop-loading");

        // let items = window.localStorage.getItem("items")
        //     ? JSON.parse(window.localStorage.getItem("items"))
        //     : [];
        // items.push(itemData);
        // window.localStorage.setItem("items", JSON.stringify(items));
        $("#ishopModal").css({ display: "block" });
    });

    window.addEventListener(
        "message",
        (event) => {
            const origin_host = "https://walah-b2156.firebaseapp.com";
            // const origin_host = "http://localhost:4200";
            if (event.origin != origin_host) {
                return;
            }
            if (event.data == "close_modal") {
                $("#ishopModal").css({ display: "none" });
            }
        },
        false
    );

    window.onclick = function (event) {
        const modal = document.getElementById("ishopModal");
        if (event.target == modal) {
            $("#ishopModal").css({ display: "none" });
        }
    };

    $(".ishop-close").click(() => {
        $("#ishopModal").css({ display: "none" });
    });

    let that;
    $(".product .pinboard")
        .hover(function () {
            that = this;
            $(".ishop-detail-save").removeClass("ishop-show");
            $(that).find(".ishop-detail-save").addClass("ishop-show");
        })
        .mouseout(() => {
            // $(".ishop-detail-save").removeClass("ishop-show");
        });
});

function onRequest(message, sender, reply) {
    switch (message.type) {
        case "1": {
            reply();
            break;
        }
        case "2": {
            reply(true);
            break;
        }
    }
    return true;
}

chrome.runtime.onMessage.addListener(onRequest);
