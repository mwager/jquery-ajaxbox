<?php
define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');

// can be anything ...
if (IS_AJAX) {
    echo
    "<b>content for ajaxbox !</b><br />new line<br />new line<br />new line<br />new line<br />new line<br />
    new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />
    new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />
    new line<br />new line";

    exit();
}
?>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8">

    <title>jquery ajaxbox</title>
    <meta name="description" content="">

    <meta name="viewport" content="width=device-width">

    <link rel="stylesheet" href="css/jquery.ajaxbox.css">
</head>
<body>
<header>
    <h1>jquery ajaxbox plugin</h1>
</header>

<div role="main" class="container">
    <h2>demo</h2>
    <ul id="demolinks">
        <li>
            <a id="demo1" href="index.php">demo1 (minimal)</a>
        </li>
        <li>
            <a id="demo2" href="index.php">demo2 (width and height options)</a>
        </li>
        <li>
            <a id="demo3" href="index.php">demo3 (callbacks)</a>
        </li>

        <li>
            <a id="demo4" href="#">demo4 (custom url)</a>
        </li>

        <li>
            <a class="ajaxbox" href="index.php">demo5 (live)</a>
        </li>

        <li>
            <a id="demo6" href="#">demo6 (custom content)</a>
        </li>

        <li>
            <a id="demo7" href="#">demo7 (server error)</a>
        </li>
    </ul>

    <pre id="log"></pre>

    <h2>docs</h2>

    <p>view source</p>

    <h2>QUnit Tests</h2>
    <a href="test">click</a>
</div>

<footer>
    &copy; Michael Wager
</footer>

<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript" src="js/jquery.ajaxbox.js"></script>
<script type="text/javascript">
    (function() {
        var demolinks = $('#demolinks');

        // straightforward some demos ...
        $(function() {
            $('#demo1').ajaxbox();

            $('#demo2').ajaxbox({
                width:  700,
                height: 400
            });

            $('#demo3').ajaxbox({
                beforeOpen:      function() {
                    log('beforeOpen callback');
                },
                afterClose:      function() {
                    log('afterClose callback');
                },
                onContentLoaded: function() {
                    log('onContentLoaded callback');
                }
            });

            $('#demo4').ajaxbox({
                debug: true,
                url:   'test.php' // custom URL
            });

            $('body').ajaxbox({
                debug:      true, // add some debug output
                sel:        '.ajaxbox',
                afterClose: function() {
                    log('afterClose callback');
                    demolinks.append('<li><a class="ajaxbox" href="index.php">harhar click me again</a></li>');
                }
            });

            $('#demo6').ajaxbox({
                content: '<div>hello world</div>' // custom content
            });

            $('#demo7').ajaxbox({
                debug: true,
                url:   'broken.php'
            });
        });

        // logging helper
        function log(str) {
            if(window.console && console.log) {
                console.log(str);
            }
            var log = $('#log');
            log.append(str + '<br />');
        }
    })();
</script>
</body>
</html>