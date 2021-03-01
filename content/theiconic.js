const ext = new Extension();

$(document).ready(() => {
    //user id will get from popup later on
    let userId = window.localStorage.getItem("userId");
    if (!userId) {
        const now = new Date().getTime();
        userId = now;
        window.localStorage.setItem("userId", now);
    }
    const saveBtn = `<a href="#" class="ishop-save">& Save <div class="ishop-loader"></div></a>`;
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
    const onRequest = (request) => {
        switch (request.action) {
            case "add_save_btn":
                let updateSaveBtn = () => {
                    setTimeout(() => {
                        if (!$("#loadingbar").hasClass("ng-hide")) {
                            updateSaveBtn();
                        } else {
                            $(".product .ishop-save").remove();
                            $(".product .pinboard .image-frame").parent().append(saveBtn);
                            $(".ishop-save").on("click", save_action);
                            $(".product .pinboard").hover(function () {
                                $(".ishop-save").removeClass("ishop-show");
                                $(this).find(".ishop-save").addClass("ishop-show");
                            });
                        }
                    }, 500);
                };
                updateSaveBtn();
                break;
            default:
                break;
        }
    };
    ext.runtime.onMessage.addListener(onRequest);
    const save_action = async (e) => {
        e.preventDefault();
        console.log("iShop clicked");
        const target = $(e.target);
        const itemDetail = $(target).parent().parent().find(".product-details");
        $("#ishopModal .brand").html($(itemDetail).children().eq(0).html());
        $("#ishopModal .item-name").html($(itemDetail).children().eq(1).html());
        $("#ishopModal .item-price").html($(itemDetail).children().eq(2).html());
        let item_img = $(target).parent().find(".image-frame img").attr("src");
        // let item_img = $(".product-image-frame img").attr("src");
        item_img = item_img.split("http");
        item_img = item_img.pop();
        item_img = `http${item_img}`;
        item_img = decodeURIComponent(item_img);
        console.log("item_img: ", item_img);

        let item_url = decodeURIComponent(
            "https://www.theiconic.com.au" + $(target).parent().attr("href")
        );

        item_url = item_url.split(".html");
        item_url = item_url[0] + ".html";

        item_id = item_url.split("-");
        item_id = item_id.pop();
        item_id = item_id.slice(0, -5);
        console.log("item_id: ", item_id);
        const itemData = {
            brand: $(itemDetail).children().eq(0).text(),
            item_name: $(itemDetail).children().eq(1).text(),
            item_price: $(itemDetail).children().eq(2).text(),
        };
        let url_param = {
            title: itemData.item_name,
            vendor: itemData.brand.replaceAll("&", "special_char_and"),
            price: itemData.item_price,
            img_url: item_img,
            product_url: item_url,
        };
        console.log(url_param);
        let url_param_encoded = JSON.stringify(url_param);
        let new_url = `http://localhost:4200/add-product/1?data=${url_param_encoded}`;
        $("#ishopModal iframe").attr("src", new_url);
        // window.open(new_url, "_blank");

        // $(target).find(".ishop-loader").addClass("ishop-loading");
        // await writeDB(userId, itemData); // function in content/firebase.ligb.js
        // $(target).find(".ishop-loader").removeClass("ishop-loading");

        // let items = window.localStorage.getItem("items")
        //     ? JSON.parse(window.localStorage.getItem("items"))
        //     : [];
        // items.push(itemData);
        // window.localStorage.setItem("items", JSON.stringify(items));
        $("#ishopModal").css({ display: "block" });
    };
    // $(".ishop-save").on("click", save_action);

    window.onclick = function (event) {
        const modal = document.getElementById("ishopModal");
        if (event.target == modal) {
            $("#ishopModal").css({ display: "none" });
        }
    };

    window.addEventListener(
        "message",
        (event) => {
            const origin_host = "http://localhost:4200";
            if (event.origin != origin_host) {
                return;
            }
            if (event.data == "close_modal") {
                $("#ishopModal").css({ display: "none" });
            }
        },
        false
    );

    $(".ishop-close").click(() => {
        $("#ishopModal").css({ display: "none" });
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
