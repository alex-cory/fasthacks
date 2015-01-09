<!DOCTYPE html>
<html lang="english">
	<head>
		<title>Downloads</title>
		<meta charset="UTF-8">
		<meta name=description content="">
		<meta name=viewport content="width=device-width, initial-scale=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<!-- Bootstrap CSS -->
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css" rel="stylesheet" media="screen">
		<style>
			.btn-outline {
			    background-color: transparent;
			    color: inherit;
			    transition: all .5s;
			}

			.btn-primary.btn-outline {
			    color: #428bca;
			}

			.btn-success.btn-outline {
			    color: #5cb85c;
			}

			.btn-info.btn-outline {
			    color: #5bc0de;
			}

			.btn-warning.btn-outline {
			    color: #f0ad4e;
			}

			.btn-danger.btn-outline {
			    color: #d9534f;
			}

			.btn-primary.btn-outline:hover,
			.btn-success.btn-outline:hover,
			.btn-info.btn-outline:hover,
			.btn-warning.btn-outline:hover,
			.btn-danger.btn-outline:hover {
			    color: #fff;
			}
		</style>
	</head>
	<body>
		<?php
			$local_filename1 = "file1.java";
			$local_filename2 = "MyCircle.java";
		?>
		<h1 class="text-center">Quick Downloads</h1>

		<?php
			/**
			 * DOWNLOAD LINKS:
			 *
			 * Need 3 files:
			 * 		1 index.php 					- this displays links that point to name_of_file#_downloader.php
			 * 		2 name_of_file#_downloader.php 	- this updates the files from the corresponding git repo, then downloads the actual file
			 * 		3 file_to_be_downloaded.java    - this is the file that will be updated and downloaded
			 */
		?>
		<!-- DOWNLOAD LINKS: -->
		<a href="path/to/downloads/repoOrProjectName/name_of_file1_downloader.php" class="btn btn-success btn-outline btn-lg"><?php echo $local_filename1; ?></a>
		<a href="path/to/downloads/repoOrProjectName/name_of_file2_downloader.php" class="btn btn-success btn-outline btn-lg"><?php echo $local_filename2; ?></a>

		<!-- jQuery -->
		<script src="//code.jquery.com/jquery.js"></script>
		<!-- Bootstrap JavaScript -->
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.0/js/bootstrap.min.js"></script>
	</body>
</html>