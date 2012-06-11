<?php
define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');

// can be anything ...
if (IS_AJAX) {
    echo
    '<b>CUSTOM URL! this is test.php</b>
    <span>custom</span>
    <br />new line<br />new line<br />new line<br />new line<br />new line<br />
    new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />
    new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />
    new line<br />new line';

    exit();
}