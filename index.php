<?php
$IS_AJAX = (static::server('HTTP_X_REQUESTED_WITH') !== null) and strtolower(static::server('HTTP_X_REQUESTED_WITH')) === 'xmlhttprequest';

if($IS_AJAX) {
    echo "<b>content for ajaxbox !<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line<br />new line</b>";
}
?>
<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8">

    <title>jquery ajaxbox</title>
    <meta name="description" content="">

    <meta name="viewport" content="width=device-width">

    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<header>
    jquery ajaxbox demo
</header>

<div role="main">
    <a id="demo1" href="index.php"></a>
</div>

<footer>
    &copy; Michael Wager
</footer>


<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

<script type="text/javascript">
    // straightforward some demos...
    $(function() {
        $('#demo1').ajaxbox();
    });
</script>
</body>
</html>