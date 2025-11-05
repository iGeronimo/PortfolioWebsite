<?php
// Simple flat-file leaderboard storage for Type Racer
// Methods:
//  - GET: returns { ok:true, top:[{name,score,wpm,correct,mistakes,time,ts}] }
//  - POST JSON: { name, score, wpm, correct, mistakes, time }
// Stores data in leaderboard.json next to this script.

header('Content-Type: application/json; charset=UTF-8');

$storage = __DIR__ . DIRECTORY_SEPARATOR . 'leaderboard.json';
$maxKeep = 100; // keep last/best 100 entries to cap file size
$maxReturn = 20; // return top 20

function read_entries($path) {
    if (!file_exists($path)) { return []; }
    $json = @file_get_contents($path);
    if ($json === false || $json === '') { return []; }
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function write_entries($path, $entries) {
    // Pretty print for easier manual inspection
    $json = json_encode($entries, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    return @file_put_contents($path, $json, LOCK_EX) !== false;
}

function sanitize_name($name) {
    $name = trim($name);
    if ($name === '') $name = 'Anonymous';
    // Remove control chars and limit length
    $name = preg_replace('/[\x00-\x1F\x7F]/u', '', $name);
    $name = mb_substr($name, 0, 24, 'UTF-8');
    return $name;
}

function sort_and_trim(&$arr, $maxKeep) {
    usort($arr, function($a, $b){
        $sa = isset($a['score']) ? (int)$a['score'] : 0;
        $sb = isset($b['score']) ? (int)$b['score'] : 0;
        if ($sa === $sb) {
            // Secondary: higher WPM first
            $wa = isset($a['wpm']) ? (int)$a['wpm'] : 0;
            $wb = isset($b['wpm']) ? (int)$b['wpm'] : 0;
            return $wb <=> $wa;
        }
        return $sb <=> $sa; // desc by score
    });
    if (count($arr) > $maxKeep) {
        $arr = array_slice($arr, 0, $maxKeep);
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode([ 'ok' => false, 'error' => 'Invalid JSON' ]);
        exit;
    }

    $name = sanitize_name($data['name'] ?? 'Anonymous');
    $score = (int)($data['score'] ?? 0);
    $wpm = (int)($data['wpm'] ?? 0);
    $correct = (int)($data['correct'] ?? 0);
    $mistakes = (int)($data['mistakes'] ?? 0);
    $time = (int)($data['time'] ?? 0); // seconds

    // Basic bounds
    if ($score < 0) $score = 0;
    if ($wpm < 0) $wpm = 0;
    if ($correct < 0) $correct = 0;
    if ($mistakes < 0) $mistakes = 0;
    if ($time < 0) $time = 0;

    // Simple anti-abuse caps (tune as needed)
    if ($wpm > 1000) $wpm = 1000;
    if ($correct > 20000) $correct = 20000;
    if ($score > 20000000) $score = 20000000;

    // Acquire lock via file handle during read-modify-write
    $fp = fopen($storage, 'c+');
    if ($fp === false) {
        http_response_code(500);
        echo json_encode([ 'ok' => false, 'error' => 'Storage unavailable' ]);
        exit;
    }
    flock($fp, LOCK_EX);
    $size = filesize($storage);
    $raw = $size > 0 ? fread($fp, $size) : '';
    $entries = $raw ? json_decode($raw, true) : [];
    if (!is_array($entries)) $entries = [];

    $entries[] = [
        'name' => $name,
        'score' => $score,
        'wpm' => $wpm,
        'correct' => $correct,
        'mistakes' => $mistakes,
        'time' => $time,
        'ts' => time(),
    ];

    sort_and_trim($entries, $maxKeep);

    // Write back
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($entries, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    $top = array_slice($entries, 0, $maxReturn);
    echo json_encode([ 'ok' => true, 'top' => $top ]);
    exit;
}

// GET: return top list
$entries = read_entries($storage);
if (!is_array($entries)) { $entries = []; }
sort_and_trim($entries, $maxKeep);
$top = array_slice($entries, 0, $maxReturn);

echo json_encode([ 'ok' => true, 'top' => $top ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
