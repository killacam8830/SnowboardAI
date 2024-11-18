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
define( 'DB_NAME', 'snowqjji_wp445' );

/** Database username */
define( 'DB_USER', 'snowqjji_wp445' );

/** Database password */
define( 'DB_PASSWORD', 'i[p]!F7-bNJ.9m6S' );

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
define( 'AUTH_KEY',         'xonx1taioutnxmqcs5ottvb9ogehhixmgtoi3a9gzorrhojzvnwwjiulcgbqtet4' );
define( 'SECURE_AUTH_KEY',  '0ozcvlbkbbrmaeczpayto8dgquxthhshzttvxfhmf53msltzkeexqtivndqtwtnz' );
define( 'LOGGED_IN_KEY',    'sv7ohvk8ygt2btsaf3a6o5znib6ot0vitigjsp5sowssopcegxuphprz38lckim2' );
define( 'NONCE_KEY',        'eqlitbhs8xeuif8bl0juo5zq4dhnma95w8yvjplugn4ujtmpbvkz1lqn4mk60djw' );
define( 'AUTH_SALT',        'abjvjpztvqphsn9hk2tcbmplop8y6plb81x64jyqy2p1qpzm5rtixlpgbwho558q' );
define( 'SECURE_AUTH_SALT', 'aemumf7zl4j2pffhy4tc4pns0mxtpqp8vuruoq1lrl9ag7h75ztq2af3fqwlz4mp' );
define( 'LOGGED_IN_SALT',   'ulenhlbpg8w6gtxj5goeljnlca2ioqxrnmr2nuxixevloca3gvfqkncjmafmft2t' );
define( 'NONCE_SALT',       'whdw3zllzyd6kz9njjpolozaembqds4fdq7xxsdtaxuvmfnaxkhpngtx3b7etenc' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wpv9_';

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
