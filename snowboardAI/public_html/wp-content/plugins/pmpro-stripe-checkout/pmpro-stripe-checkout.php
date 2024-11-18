<?php
/*
Plugin Name: PMPro Stripe Checkout Integration
Description: Custom endpoint for creating Stripe Checkout sessions and linking to PMPro orders.
Version: 1.0
Author: Your Name
*/

function create_stripe_checkout_session() {
    if (!isset($_POST['order_id']) || !isset($_POST['amount'])) {
        wp_send_json_error('Missing parameters', 400);
        return;
    }

    $order_id = intval($_POST['order_id']);
    $amount = intval($_POST['amount']); // Amount in cents

    \Stripe\Stripe::setApiKey('pk_test_51OkbRuAjeFDmwp9CQAMFiRRPaYWG1rRFaX2akFdn05RLmET20TcsbEGycLjtGPH8WRrqKqTiuOKJ9cyfUzVyUvYm00OkmOSp6t');
    
    try {
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Membership Plan',
                    ],
                    'unit_amount' => $amount,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => site_url('/checkout-success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => site_url('/checkout-cancel'),
        ]);

        // Save session ID to PMPro order meta
        update_pmpro_membership_order_meta($order_id, 'stripe_checkout_session_id', $session->id);

        wp_send_json_success(['sessionId' => $session->id]);

    } catch (Exception $e) {
        wp_send_json_error($e->getMessage(), 500);
    }
}
add_action('wp_ajax_create_stripe_checkout_session', 'create_stripe_checkout_session');
add_action('wp_ajax_nopriv_create_stripe_checkout_session', 'create_stripe_checkout_session');
?>
