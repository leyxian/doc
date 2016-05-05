<?php
header( 'Content-Type: text/csv' );
header( 'Content-Disposition: attachment;filename=test.csv');
$fp = fopen('php://output', 'w');
fputcsv($fp, array());
fclose($fp);
?>