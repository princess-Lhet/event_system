<?php
require_once __DIR__ . '/../models/Reservation.php';
require_once __DIR__ . '/../models/Notification.php';

class ReservationController {
    private $db;
    private $model;
    private $notif;

    public function __construct($db) {
        $this->db = $db;
        $this->model = new ReservationModel($db);
        $this->notif = new NotificationModel($db);
    }

    public function readAll() {
        try {
            return $this->model->readAll();
        } catch (Throwable $e) {
            http_response_code(500);
            return ['success' => false, 'error' => 'Failed to fetch reservations'];
        }
    }

    public function create($data) {
        try {
            $result = $this->model->create($data ?? []);
            if (isset($result['error'])) {
                http_response_code(400);
                return ['success' => false, 'error' => $result['error']];
            }
            return ['success' => true, 'id' => $result['id'] ?? null];
        } catch (Throwable $e) {
            http_response_code(400);
            return ['success' => false, 'error' => 'Failed to create reservation'];
        }
    }

    public function update($id, $data) {
        try {
            $ok = $this->model->update($id, $data ?? []);
            if ($ok) {
                // Fetch reservation to know user and status
                $res = $this->model->getById($id);
                if ($res && isset($res['user_id'])) {
                    $status = strtolower($data['status'] ?? $res['status'] ?? 'pending');
                    $title = 'Reservation Updated';
                    $message = 'Your reservation status has been updated.';
                    $extra = [];
                    if ($status === 'approved') {
                        // Generate simple 6-char code A-Z0-9
                        $pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                        $code = '';
                        for ($i=0; $i<6; $i++) { $code .= $pool[random_int(0, strlen($pool)-1)]; }
                        $this->model->setApprovalCode($id, $code);
                        $title = 'Reservation Approved';
                        $message = 'Your reservation is approved. Present this code on entry: ' . $code;
                        $extra['code'] = $code;
                    } elseif ($status === 'cancelled') {
                        $title = 'Reservation Cancelled';
                        $message = 'Your reservation has been cancelled by the organizer.';
                    }
                    $this->notif->create((int)$res['user_id'], 'reservation_status', $title, $message, array_merge(['reservation_id' => (int)$id], $extra));
                }
            }
            return ['success' => (bool)$ok];
        } catch (Throwable $e) {
            http_response_code(400);
            return ['success' => false, 'error' => 'Failed to update reservation'];
        }
    }

    public function delete($id) {
        try {
            $ok = $this->model->delete($id);
            return ['success' => (bool)$ok];
        } catch (Throwable $e) {
            http_response_code(400);
            return ['success' => false, 'error' => 'Failed to delete reservation'];
        }
    }
}
?>
