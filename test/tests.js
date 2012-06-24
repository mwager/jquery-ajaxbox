/**
 * jquery-ajaxbox QUnit Tests
 *
 * @author Michael Wager
 */

module('jquery-ajaxbox');

asyncTest("jquery-ajaxbox", function() {

    expect(15);

    ok(! ! jQuery().ajaxbox, "ajaxbox present");

    $('#demo1').ajaxbox({
        width:           400,
        height:          200,
        event:           'click', // show event - default click
        sel:             null, // optional selector to support "live" binding
        url:             null, // optional url, if null href attr is used
        beforeOpen:      function() {
            ok(! ! true, 'beforeOpen callback success');
        },
        afterClose:      function() {
            ok(! ! true, 'afterClose callback success');
        },
        // after content loaded
        onContentLoaded: function() {
            start();
            ok(! ! true, 'onContentLoaded callback success');
        },
        debug:           false
    });

    ok($('#ajax_box_overlay').length > 0, 'overlay present');

    $('#demo1').trigger('click');

    ok($('#ajax_box_overlay').is(':visible'), 'overlay visible');
    ok($('.ajax_box').length > 0, '.ajax_box present');
    ok($('.ajax_box_body').length > 0, '.ajax_box_body present');
    ok($('.ajax_box_close_button').length > 0, '.ajax_box_close_button present');

    ok($('.ajax_box').width() === 400, 'width');
    ok($('.ajax_box').height() === 200, 'height');

    $('.ajax_box_close_button').trigger('click');

    // demo 2 custom url
    $('#demo2').ajaxbox({
        url:             '../test.php', // custom URL
        onContentLoaded: function(html) {
            ok(html, 'returned html from custom url');

            start();
        }
    });

    $('#demo2').trigger('click');
    $('.ajax_box_close_button').trigger('click');


    // demo 3 custom content instead of ajax
    $('#demo3').ajaxbox({
        content: '<div id="custom">Custom <strong>content</strong></div>'
    });

    $('#demo3').trigger('click');
    ok($('#custom').length > 0, 'custom content present');
    $('.ajax_box_close_button').trigger('click');
});