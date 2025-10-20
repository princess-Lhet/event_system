<?php
require_once __DIR__ . '/../models/Notification.php';

class NotificationController {
    private $db;
    private $model;

    public function __construct($db) {
        $this->db = $db;
        $this->model = new NotificationModel($db);
    }

    public function listByUser($userId, $onlyUnread = false) {
        try {
            return $this->model->readByUser($userId, $onlyUnread);
        } catch (Throwable $e) {
            http_response_code(500);
            return ['success' => false, 'error' => 'Failed to fetch notifications'];
        }
    }

    public function markRead($id) {
        try {
            $ok = $this->model->markRead($id);
            return ['success' => (bool)$ok];
        } catch (Throwable $e) {
            http_response_code(400);
            return ['success' => false, 'error' => 'Failed to mark as read'];
        }
    }
}
?>
