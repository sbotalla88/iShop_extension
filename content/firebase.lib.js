// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// let db = firebase.database();

async function writeDB(user_id, data) {
    let db_items = await readDB(user_id);
    const itemId = data.item_id;
    if (db_items) {
        let db_items_arr = Object.keys(db_items);
        for (let i = 0; i < db_items_arr.length; i++) {
            if (db_items_arr[i] == itemId) {
                return;
            } else {
                db.ref("items/" + user_id + "/" + itemId).set(data);
                break;
            }
        }
    } else {
        db.ref("items/" + user_id + "/" + itemId).set(data);
    }
}

async function readDB(user_id) {
    let result = await db.ref("items/" + user_id).once("value");
    return result.val();
}
