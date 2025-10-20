<?php
// controllers/ReservationController.php (User CRUD)
require_once '../config/Database.php';
require_once '../models/ReservationModel.php';
require_once '../models/EventModel.php';

class ReservationController {
    private $db;
    private $reservationModel;
    private $eventModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->reservationModel = new ReservationModel($this->db);
        $this->eventModel = new EventModel($this->db);
    }

    public function create($data) {
        if (session_status() === PHP_SESSION_NONE) session_start();
        $data['user_id'] = $_SESSION['user_id'];
        if (!$this->reservationModel->isAvailable($data['event_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No slots available']);
            return;
        }
        if ($this->reservationModel->create($data) && $this->eventModel->decrementSlots($data['event_id'])) {
            echo json_encode(['message' => 'Reservation confirmed']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Reservation failed']);
        }
    }

    public function readUserReservations() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        $query = "SELECT r.*, e.title FROM reservations r JOIN events e ON r.event_id = e.id WHERE r.user_id = :user_id";

    }
}