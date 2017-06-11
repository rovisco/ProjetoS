
$(document).ready(function(){ 
	
	$("#EditButtons").hide();
    
    
    $("#createForm").validate({
		rules: {
			title: {
				required: true,
				minlength: 2
			}
		},
		messages: {
			title: {
				required: "Please enter a title",
				minlength: jQuery.format("Your title must be at least {0} characters long")
			}
		},
		submitHandler: function(form) {
			$.ajax({
				type: "POST",
                url: "/survey/create",
				data: $(form).serialize(),
				success: function(res){
					console.log("res=",JSON.stringify(res));
					$("#surveyCreateButton").removeAttr('disabled');
					
					if (res.result == 'error'){
						var contents = new EJS({url: 'templates/message.ejs'}).render(res);
						$('#modalMessageBody').html(contents);
						$('#messageModal').modal('show');
					}else{		
						$("#surveyCreateButton").removeAttr('disabled');

						window.location.replace("/");
						//location.reload();
					}

				}
			});
			
			$('.form-group').removeClass('has-success').removeClass('has-error');
			$('#userRegisterButton').attr('disabled','disabled');
			form.reset();
		},
		 highlight: function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
		},
		success: function(element) {
			element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
		}
	});
});
    