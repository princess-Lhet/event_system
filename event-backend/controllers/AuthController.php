<?php
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function register($data) {
        // Server-side validation
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'error' => 'All fields are required'];
        }
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'error' => 'Invalid email format'];
        }

        if (strlen($data['password']) < 6) {
            return ['success' => false, 'error' => 'Password must be at least 6 characters'];
        }

        $this->user->name = htmlspecialchars(strip_tags($data['name']));
        $this->user->email = $data['email'];
        $this->user->password = $data['password'];
        $this->user->role = $data['role'] ?? 'attendee';
        
        if ($this->user->create()) {
            return ['success' => true, 'message' => 'User registered successfully'];
        }
        return ['success' => false, 'error' => 'Email already exists or registration failed'];
    }

    public function login($data) {
        if (empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'error' => 'Email and password are required'];
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'error' => 'Invalid email format'];
        }

        $this->user->email = $data['email'];
        $user = $this->user->login();
        
        if ($user && password_verify($data['password'], $user['password'])) {
            unset($user['password']); // Remove password from response
            return [
                'success' => true,
                'message' => 'Logged in successfully',
                'user' => $user
            ];
        }
        return ['success' => false, 'error' => 'Invalid email or password'];
    }
}
?>