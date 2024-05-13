import axios from "axios";

const host = "https://provinces.open-api.vn/api/";

export const callAPI = async () => {
    const response = await axios.get(host + '?depth=1');
    return response.data
    // renderData(response.data, "province");
}

export const callApiDistrict = async (api) => {
    const response = await axios.get(api);
    renderData(response.data.districts, "district");
}
export const callApiWard = async (api) => {
    const response = await axios.get(api);
    renderData(response.data.wards, "ward");
}

export const renderData = (array, select) => {
    let row = ' <option disable value="">chọn</option>';
    array.forEach(element => {
        row += `<option value="${element.code}">${element.name}</option>`
    });
    document.querySelector("#" + select).innerHTML = row
}

// $("#province").change(() => {
//     callApiDistrict(host + "p/" + $("#province").val() + "?depth=2");
//     printResult();
// });
// $("#district").change(() => {
//     callApiWard(host + "d/" + $("#district").val() + "?depth=2");
//     printResult();
// });
// $("#ward").change(() => {
//     printResult();
// })

// var printResult = () => {
//     if ($("#district").val() != "" && $("#province").val() != "" &&
//         $("#ward").val() != "") {
//         let result = $("#province option:selected").text() +
//             " | " + $("#district option:selected").text() + " | " +
//             $("#ward option:selected").text();
//         $("#result").text(result)
//     }

// }