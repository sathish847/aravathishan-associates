/*
*
* Contact JS with EmailJS
* @ThemeEaster
*/
$(function() {
    // Initialize EmailJS with your user ID
    const userID = $('#ajax_contact').data('emailjs-user-id');
    if (userID && userID !== 'YOUR_USER_ID') {
        emailjs.init(userID);
    }

    // Get the form.
    var form = $('#ajax_contact');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function(event) {
        // Stop the browser from submitting the form.
        event.preventDefault();

        // Get EmailJS parameters from form data attributes
        const serviceID = $(form).data('emailjs-service-id');
        const templateID = $(form).data('emailjs-template-id');

        // Check if EmailJS is properly configured
        if (!serviceID || !templateID || !userID || serviceID === 'YOUR_SERVICE_ID' || templateID === 'YOUR_TEMPLATE_ID' || userID === 'YOUR_USER_ID') {
            $(formMessages).removeClass('alert-success').addClass('alert alert-danger');
            $(formMessages).text('EmailJS is not properly configured. Please set your Service ID, Template ID, and User ID.');
            return;
        }

        // Update the hidden select with the nice-select value
        if ($('.nice-select .current').text() !== 'Service Types') {
            $('select[name="service_type"]').val($('.nice-select .current').text());
        }

        // Get form data
        const formData = {
            fullname: $('#fullname').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            service_type: $('select[name="service_type"]').val() || $('.nice-select .current').text(),
            message: $('#message').val().trim()
        };

        // Validation
        let isValid = true;
        let errorMessage = '';

        if (!formData.fullname) {
            isValid = false;
            errorMessage = 'Please enter your name.';
        } else if (!formData.email) {
            isValid = false;
            errorMessage = 'Please enter your email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        } else if (!formData.phone) {
            isValid = false;
            errorMessage = 'Please enter your phone number.';
        } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        } else if (formData.service_type === 'Service Types' || !formData.service_type) {
            isValid = false;
            errorMessage = 'Please select a service type.';
        } else if (!formData.message) {
            isValid = false;
            errorMessage = 'Please enter your message.';
        }

        if (!isValid) {
            $(formMessages).removeClass('alert-success').addClass('alert alert-danger');
            $(formMessages).text(errorMessage);
            return;
        }

        // Disable submit button and show loading
        const submitBtn = $('#submit');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Sending...');

        // Send email using EmailJS
        emailjs.send(serviceID, templateID, formData)
            .then(function(response) {
                // Success
                $(formMessages).removeClass('alert-danger').addClass('alert alert-success');
                $(formMessages).text('Thank you! Your message has been sent successfully.');

                // Clear the form
                $('#fullname').val('');
                $('#email').val('');
                $('#phone').val('');
                $('#message').val('');
                // Reset select dropdown
                $('.nice-select .current').text('Service Types');
                $('.nice-select .option').removeClass('selected focus');
                $('.nice-select .option').first().addClass('selected focus');
                $('select[name="service_type"]').val('');

                // Re-enable submit button
                submitBtn.prop('disabled', false).text(originalText);

                console.log('SUCCESS!', response.status, response.text);
            })
            .catch(function(error) {
                // Error
                $(formMessages).removeClass('alert-success').addClass('alert alert-danger');
                $(formMessages).text('Oops! An error occurred and your message could not be sent. Please try again.');

                // Re-enable submit button
                submitBtn.prop('disabled', false).text(originalText);

                console.log('FAILED...', error);
            });
    });

    // Handle nice-select change to update hidden select
    $(document).on('click', '.nice-select .option', function() {
        const selectedValue = $(this).data('value');
        const selectedText = $(this).text();
        $('select[name="service_type"]').val(selectedText);
    });
});
