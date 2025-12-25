// ====== CONSTANTS ======
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";

var connToken = "90934836|-31949264799814172|90957877";
var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";
$('#rollNo').focus();


function enableFields() {
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate")
            .prop("disabled", false);
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getRollnoAsJsonObj() {
    var rollNo = $("#rollNo").val();
    return JSON.stringify({rollNo: rollNo});
}


function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#fullName").val(data.fullName);
    $("#studentClass").val(data.studentClass);
    $("#birthDate").val(data.birthDate);
    $("#address").val(data.address);
    $("#enrollDate").val(data.enrollDate);
}


function getStudent() {
    var rollNoJsonObj = getRollnoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, rollNoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        if (resJsonObj.status === 400) {
            // New record
            enableFields();

            $("#save").prop("disabled", false);
            $("#change").prop("disabled", true);
            $("#reset").prop("disabled", false);

            $("#fullName").focus();
            return;
        }

    } else if (resJsonObj.status === 200) {
        $("#rollNo").prop("disabled", true);

        fillData(resJsonObj);
        enableFields();               // ⭐ THIS WAS MISSING

        $("#save").prop("disabled", true);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
    }

}
function validateData() {
    var rollNo = $("#rollNo").val();
    var fullName = $("#fullName").val();
    var studentClass = $("#studentClass").val();
    var birthDate = $("#birthDate").val();
    var address = $("#address").val();
    var enrollDate = $("#enrollDate").val();

    if (
            rollNo === "" ||
            fullName === "" ||
            studentClass === "" ||
            birthDate === "" ||
            address === "" ||
            enrollDate === ""
            ) {
        alert("All fields are required");
        return "";
    }

    var jsonStrObj = {
        rollNo: rollNo,
        fullName: fullName,
        studentClass: studentClass,
        birthDate: birthDate,
        address: address,
        enrollDate: enrollDate
    };

    return JSON.stringify(jsonStrObj);
}

function saveStudent() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return;
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollNo').focus();
}

function updateStudent() {
    var jsonChg = validateData(); 
    if (jsonChg === "") return;

    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonChg,
        dbName,
        relName,
        localStorage.getItem("recno")
    );

    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Student record updated successfully");
    resetForm();
    $("#rollNo").focus();
}


function resetForm() {
    $('#rollNo').val("");
    $('#fullName').val("");
    $('#studentClass').val("");
    $('#birthDate').val("");
    $('#address').val("");
    $('#enrollDate').val("");
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate")
        .prop("disabled", true);
    $("#rollNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollNo").focus();
}

