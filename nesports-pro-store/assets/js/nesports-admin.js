(function($) {
    'use strict';

    $(document).ready(function() {
        var $btnRegenerate = $('#btn-regenerate-pages');
        var $notice = $('#nesports-ajax-notice');
        var $noticeMsg = $('#nesports-ajax-message');

        $btnRegenerate.on('click', function(e) {
            e.preventDefault();
            
            var originalText = $btnRegenerate.html();
            $btnRegenerate.prop('disabled', true).html('<span class="dashicons dashicons-update spin"></span> Deploying Pages...');

            $.ajax({
                url: nesports_admin_obj.ajax_url,
                type: 'POST',
                data: {
                    action: 'nesports_regenerate_pages',
                    nonce: nesports_admin_obj.nonce
                },
                success: function(response) {
                    $btnRegenerate.prop('disabled', false).html(originalText);
                    if (response.success) {
                        $notice.removeClass('notice-error').addClass('notice-success').show();
                        $noticeMsg.text(response.data.message);
                        setTimeout(function() {
                            location.reload();
                        }, 1200);
                    } else {
                        $notice.removeClass('notice-success').addClass('notice-error').show();
                        $noticeMsg.text(response.data.message || 'Error deploying pages.');
                    }
                },
                error: function() {
                    $btnRegenerate.prop('disabled', false).html(originalText);
                    $notice.removeClass('notice-success').addClass('notice-error').show();
                    $noticeMsg.text('Connection error while contacting server.');
                }
            });
        });
    });
})(jQuery);

