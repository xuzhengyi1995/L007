<!DOCTYPE html>
<html lang="en">
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <!-- jQuery -->
        <script src="../vendor/jquery/jquery.min.js"></script>
        <script src="../js/index.js"></script>

        <!-- Bootstrap Core JavaScript -->
        <script src="../vendor/bootstrap/js/bootstrap.min.js"></script>

        <!-- Metis Menu Plugin JavaScript -->
        <script src="../vendor/metisMenu/metisMenu.min.js"></script>
        <script src="../vendor/datatables/js/jquery.dataTables.min.js"></script>
        <script src="../vendor/datatables-plugins/dataTables.bootstrap.min.js"></script>
        <script src="../vendor/datatables-responsive/dataTables.responsive.js"></script>

        <!-- Custom Theme JavaScript -->
        <script src="../dist/js/sb-admin-2.js"></script>
        <script src='https://www.google.com/recaptcha/api.js'></script>
        <script src="../js/sha512.min.js"></script>
        <script src="../js/login.js"></script>
        <script src="../js/reg.js"></script>
        <script src="../js/cursus.js"></script>
        <script src="../js/import_csv.js"></script>
        <script src="../js/error_handle.js"></script>
        <script src="../js/cursus_modify.js"></script>
        <script src="../js/n_detail.js"></script>
        <script src="../js/check_cursus.js"></script>
        <script src="../js/pre_tables.js"></script>
		<script src="../js/cours.js"></script>
        <script language="javascript">
            $(function () {
                $.get('welcome.php', '', function (result) {
                    $('#page-wrapper').html(result);
					if(document.getElementById("my_cursus")!=undefined)
					{
						display_table('/api/cursus');
					}
                });
            });
        </script>
        <title>UTT Etudiant profile</title>
        <link rel="stylesheet" href="../dist/css/bootstrap-select.css">
        <!-- Bootstrap Core CSS -->
        <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

        <!-- MetisMenu CSS -->
        <link href="../vendor/metisMenu/metisMenu.min.css" rel="stylesheet">

        <!-- Custom CSS -->
        <link href="../dist/css/sb-admin-2.css" rel="stylesheet">

        <!-- Custom Fonts -->
        <link href="../vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->

        </head>

        <body>
<div id="wrapper"> 
          
          <!-- Navigation -->
          <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
    <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
              <a class="navbar-brand" href="index.php">Management de votre profile</a> </div>
    <!-- /.navbar-header -->
    
    <ul class="nav navbar-top-links navbar-right">
              <!-- /.dropdown -->
              <li class="dropdown"> <a class="dropdown-toggle" data-toggle="dropdown" href="#"> <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i> </a>
        <ul class="dropdown-menu dropdown-user">
                  <li>
            <?php
                                include_once "../PHP_www/Auth.php";
                                if (User_logged_in()) {
                                    echo '<a href="index.php"><i class="fa fa-user fa-fw"></i> ' . logged_get_username();
                                } else {
                                    echo '<a href="#" onClick="log_in()"><i class="fa fa-user fa-fw"></i> Login';
                                }
                                ?>
            </a> </li>
                  <li>
            <?php
                                include_once "../PHP_www/Auth.php";
                                if (!User_logged_in()) {
                                    echo '<a href="#" onClick="new_account()" ><i class="fa fa-plus fa-fw"></i> New account';
                                }
                                ?>
            </a> </li>
                  <?php
                                include_once "../PHP_www/Auth.php";
                                if (User_logged_in()&&logged_get_type()=='student') {
                            		echo '<li><a href="#" onClick="account_info()"><i class="fa fa-gear fa-fw"></i> Account</a></li>';
								}
							?>
                  <?php
                            include_once "../PHP_www/Auth.php";
                            if (User_logged_in()) {
                                echo'
                        <li class="divider"></li>
                        <li><a href="#" onclick="log_out()"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                        </li>';
                            }
                            ?>
                </ul>
        <!-- /.dropdown-user --> 
      </li>
              <!-- /.dropdown -->
            </ul>
    <!-- /.navbar-top-links -->
    
    <div class="navbar-default sidebar" role="navigation">
              <div class="sidebar-nav navbar-collapse">
        <ul class="nav" id="side-menu">
                  <?php
								include_once "../PHP_www/Auth.php";
                                if (logged_get_type()=='staff') {
									echo '<li class="sidebar-search" style="display:none">';
								}
								else
								{
									echo '<li class="sidebar-search">';
								}
							?>
                  <div class="input-group custom-search-form">
            <input id="index_search_input" type="text" class="form-control" placeholder="Search...">
            <span class="input-group-btn">
                    <button class="btn btn-default" type="button" onClick="index_search_nom()"> <i class="fa fa-search"></i> </button>
                    </span> </div>
                  <!-- /input-group -->
                  </li>
                  <li> <a href="index.php"><i class="fa fa-dashboard fa-fw"></i> Acueil</a> </li>
                  <?php
								include_once "../PHP_www/Auth.php";
                                if (logged_get_type()=='staff') {
									echo '<li style="display:none">';
								}
								else
								{
									echo '<li>';
								}
							?>
                  <?php
                                include_once "../PHP_www/Auth.php";
                                if (!User_logged_in()) {
                                    echo '<a href="javascript:void(0)" onClick="log_in()" ><i class="fa fa-book fa-fw"></i> Mon cursus </a>';
                                } else {
                                    echo '<a href="#"><i class="fa fa-book fa-fw"></i> Mon cursus<span class="fa arrow"></span></a>';
                                    echo '<ul class="nav nav-second-level">
                                    <li>
                                        <a href="javascript:void(0)" onClick="cursus_general()" >Visualiser votre cursus generale</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)" onClick="import_csv()" >Import un nouveau cursus</a>
                                    </li>
                                    </ul>';
                                }
                                ?>
                  </li>
                  <?php
								include_once "../PHP_www/Auth.php";
                                if (logged_get_type()=='staff') {
									echo '<li style="display:none">';
								}
								else
								{
									echo '<li>';
								}
							?>
                  <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> Charts of notes<span class="fa arrow"></span></a>
                  <ul class="nav nav-second-level">
            <li> <a href="javascript:void(0)" onClick="index_avg()">Average notes for your cursus</a> </li>
            <li> <a href="javascript:void(0)" onClick="index_sum()">Sum credits</a> </li>
          </ul>
                  <!-- /.nav-second-level -->
                  </li>
                  <li> <a href="#"><i class="fa fa-table fa-fw"></i> Tables of UE<span class="fa arrow"></span></a>
            <ul class="nav nav-second-level">
                      <li class="sidebar-search">
                <div class="input-group custom-search-form">
                          <input  id="s_UE" type="text" class="form-control" placeholder="Search a UE">
                          <span class="input-group-btn">
                  <button id="on_search_ue" class="btn btn-default" type="button" onClick="index_search_ue()"> <i class="fa fa-search"></i> </button>
                  </span> </div>
                <!-- /input-group --> 
              </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('')">All</a> </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('/CS')">CS</a> </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('/TM')">TM</a> </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('/ST')">ST</a> </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('/EC')">EC</a> </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('/ME')">ME</a> </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('/CT')">CT</a> </li>
                      <li> <a href="javascript:void(0)" onClick="index_get_ue('/HP')">HP</a> </li>
                    </ul>
          </li>
                  <?php
								include_once "../PHP_www/Auth.php";
                                if (!User_logged_in()||logged_get_type()=='student') {
									echo '<li style="display:none">';
								}
								else
								{
									echo '<li>';
								}
							?>
                  <a href="#"><i class="fa fa-database fa-fw"></i> Management<span class="fa arrow"></span></a>
                  <ul class="nav nav-second-level">
            <li> <a href="javascript:void(0)" onClick="index_add_rules()">Add rules</a> </li>
            <li> <a href="javascript:void(0)" onClick="index_add_cours()">Add cours</a> </li>
          </ul>
                  <!-- /.nav-second-level -->
                  </li>
                </ul>
      </div>
              <!-- /.sidebar-collapse --> 
            </div>
    <!-- /.navbar-static-side --> 
  </nav>
          <div id="page-wrapper"> </div>
          <!-- /#page-wrapper --> 
          
        </div>
<!-- /#wrapper -->
<form hidden="true" id="key_f">
          <?php
            include_once '../api/get_key/index.php';
            echo '<input type="text" id="key" name="key" readonly hidden="true" value="' . set_xss() . '">';
            ?>
        </form>
</body>
</html>
