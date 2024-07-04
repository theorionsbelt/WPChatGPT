<?php
/*
Plugin Name: WPML ChatGPT Translate
Description: A plugin to translate content using ChatGPT API via a custom interface in the WordPress editor.
Version: 1.0
Author: Your Name
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

function wpml_chatgpt_enqueue_scripts() {
    wp_enqueue_script( 'wpml-chatgpt-script', plugins_url( 'js/wpml-chatgpt.js', __FILE__ ), array( 'wp-blocks', 'wp-element', 'wp-edit-post' ), '1.0', true );
    wp_enqueue_style( 'wpml-chatgpt-style', plugins_url( 'css/wpml-chatgpt.css', __FILE__ ), array(), '1.0' );

    wp_localize_script( 'wpml-chatgpt-script', 'wpmlChatgpt', array(
        'apiKey' => get_option( 'wpml_chatgpt_api_key' ),
    ));
}
add_action( 'enqueue_block_editor_assets', 'wpml_chatgpt_enqueue_scripts' );






function wpml_chatgpt_settings_menu() {
    add_options_page(
        'ChatGPT API Settings',
        'ChatGPT API',
        'manage_options',
        'wpml-chatgpt-settings',
        'wpml_chatgpt_settings_page'
    );
}
add_action( 'admin_menu', 'wpml_chatgpt_settings_menu' );

function wpml_chatgpt_settings_page() {
    ?>
    <div class="wrap">
        <h1>ChatGPT API Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields( 'wpml_chatgpt_settings_group' );
            do_settings_sections( 'wpml_chatgpt_settings_group' );
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">API Key</th>
                    <td><input type="text" name="wpml_chatgpt_api_key" value="<?php echo esc_attr( get_option('wpml_chatgpt_api_key') ); ?>" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function wpml_chatgpt_register_settings() {
    register_setting( 'wpml_chatgpt_settings_group', 'wpml_chatgpt_api_key' );
}
add_action( 'admin_init', 'wpml_chatgpt_register_settings' );
