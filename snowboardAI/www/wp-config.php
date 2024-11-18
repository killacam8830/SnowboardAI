<?php
define( 'WP_CACHE', true );



























/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'snowqjji_wp207' );

/** Database username */
define( 'DB_USER', 'snowqjji_wp207' );

/** Database password */
define( 'DB_PASSWORD', '44]S[7]hp[!C487I' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'xw8u2biiatcl1epyb1yox3uqaxyfp2gphaelhh86rjffrmtudsfyebf3efpygakf' );
define( 'SECURE_AUTH_KEY',  '0mddrmr7ouzpn38lhtrzv1qteuzdmtzgeevdsst3frncelybjjntfml4jl6rwey1' );
define( 'LOGGED_IN_KEY',    '6s0kereppsgzljcbkbebghen7nanxua2vtor34oxa2baysq49bz7flvs20guhqam' );
define( 'NONCE_KEY',        't9ftn8jx3smpd3hv86f2cleahu5aohvc2k1yg5eoemfqoo96e8ltclnrrq1b7k6f' );
define( 'AUTH_SALT',        'f4oyy8kmr62cz0emwioromg6ulenbpqucccvto6rylsmgyadcjc27sus7a5orkbr' );
define( 'SECURE_AUTH_SALT', 'dxs1zycklonjphku5izqu2dknr8nfyjcgzjhhrie5v1zrjlwazyi1cimkwve2rcl' );
define( 'LOGGED_IN_SALT',   'nclqt4ym3towxvbbcsdduj652tlb0qwhk4qe631sewztc1dvwp8jl3sow9iwuaa9' );
define( 'NONCE_SALT',       '1ugka8eawtizgsq6byvorhdrpjofqahx0lwlwe9dnvggiidiuiezd4xfd3cyadfn' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wpxv_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
