$("form[name=signup_form").submit(function(e) {

    var $form = $(this);
    var $error = $form.find(".error");
    var data = $form.serialize();

    $.ajax({
        url: "/register",
        type : "POST",
        data: data,
        dataType: "json",
        success: function(resp) {
            const HOSTNAME = window.location.hostname;
            const url = `http://${HOSTNAME}:${resp}/welcome/lists`;
            window.location.href = url;  
        },
        error: function(resp){    
            $error.text(resp.responseJSON.error).removeClass("error--hidden");
        }
    });
    e.preventDefault();
});

$("form[name=login_form").submit(function(e) {

    var $form = $(this);
    var $error = $form.find(".error");
    var data = $form.serialize();

    $.ajax({
        url: "/",
        type : "POST",
        data: data,
        dataType: "json",   
        success: function(resp) {
            const HOSTNAME = window.location.hostname;
            const url = `http://${HOSTNAME}:${resp}/welcome/lists`;
            window.location.href = url;  
        },
        error: function(resp){    
            $error.text(resp.responseJSON.error).removeClass("error--hidden");
        }
    });
    e.preventDefault();
});
