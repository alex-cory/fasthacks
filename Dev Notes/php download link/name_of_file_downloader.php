<?php // pwd: ~/Downloads  (this should be placed in the Downloads directory on your server)

/**
 * DOWNLOAD A FILE INSTANTLY VIA URL:
 *
 * This file will automatically download whatever file is specified below.
 * This file should be placed in the 'Downloads/' directory on your server.
 *
 * Local: refers to files locally to server
 * Author: AleXander (aka: Alex Cory)
 * Github: alex-cory
 */

/**
 * Define Files:
 */
$local_filename1 = 'path/to/file/in/local_gitRepo/file1.java';
$local_filename2 = '../../../docs/java_101b/Assignment6/MyCircle.java'; // from: "alexcory/downloads/" to: "alexcory/docs"
$github_raw_file1 = 'https://raw.githubusercontent.com/alex-cory/repo-name/branch(i.e. master)/path/to/file1.java';
$github_raw_file2 = 'https://raw.githubusercontent.com/alex-cory/java_101b/master/Assignment6/MyCircle.java';
// $github_raw_file3 = 'https://raw.githubusercontent.com/' . $userName . '/' . $repo . '/' . $branch . '/' . $git_file_path . '/' . $filename;



// $file_execute = $current_directory . // DELETE THIS LINE I think?
/**
 * Update Local Files:
 */
// If the files exist locally (in the Documents Directory)
if (file_exists($local_filename1) || file_exists($local_filename2)) { // remove file2 if you are only using 1
	// update the first local file with the contents from the newer file on github
    exec( 'curl -sL "' . $github_raw_file1 . '" > "' . $local_filename1 . '"' );
	// update the second local file with the contents from the newer file on github
    exec( 'curl -sL "' . $github_raw_file2 . '" > "' . $local_filename2 . '"' ); // comment out if no file2
} else {
	// Otherwise one of the files isn't getting included correctly
    die('one of the files doesn\'t exist');
}

/**
 * Download the file:
 */
// Options:
// header('Pragma: public');
// header('Expires: 0');
// header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
// header('Cache-Control: private', false); // required for certain browsers
// header('Content-Transfer-Encoding: binary');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="'. basename($local_filename1) . '";');
header('Content-Length: ' . filesize($local_filename1));

readfile($local_filename1);

exit;




/**
 * IGNORE WHAT'S BELOW :)
 */
// $files = array(
// 	'Assignment6.1' => 'MyCircle.java',
// 	'Assignment6.2' => 'MyCircleTester.java'
// );
// // Download File Variables
// $filename1 = $files['Assignment6.1'];
// $path = 'Assignment6';

// $downloads = pathinfo(__FILE__, PATHINFO_DIRNAME); // path to downloads directory on server
// if (!) {
// 	# code...
// }
// // Documents File Variables
// $docs = '../../'; // path to docs directory on server (I used relative path from this file)
// $docs_file_location = $docs . $filename;


// // Github Variables
// $userName = 'alex-cory';
// $repo = 'java_101b';
// $branch = 'master'; // typically 'master'
// $git_file_path = 'Assignment6';

// public function displayDownloadLink($files, $path)
// {

// 	for ($i=0; $i < count($files); $i++) {
// 		$filename . $i + 1 = $files[$path . '.' . $i]; // $filename1 = MyCircle.java, $filename2 = MyCircleTester.java
// 		$file_downloader_name . $i + 1 = $filename[$i + 1] . '_downloader.php'; // $file_downloader_name1 = MyCircle_downloader.php
// 		$link . $i + 1 = '<a href="' . $downloads . '/' . $filename . $i + 1 '" class="btn btn-success btn-outline btn-lg">' . $local_filename . '</a>';
// 	}
// }
