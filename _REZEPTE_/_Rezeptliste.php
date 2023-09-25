<?php

$files = scandir(getcwd());

function endsWith($string, $endString) {
  $len = strlen($endString);
  if($len == 0) {
    return true;
  }
  return (substr($string, -$len) === $endString);
}

foreach($files as $file){
  if(endsWith($file, ".rezept.txt")){
    $ext = explode(".rezept.txt",$file)[0];
    $timestamp = filemtime($file);
    echo $ext . "?" . $timestamp . "\n";
  }
}

?>
