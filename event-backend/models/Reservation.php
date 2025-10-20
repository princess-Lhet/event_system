<?php
class ReservationModel {
    private $conn;
    private $table = 'reservations';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $sql = "SELECT r.*, 
                       u.name AS user_name, u.email AS user_email,
                       e.title AS event_title, e.date AS event_date, e.time AS event_time
                FROM {$this->table} r
                LEFT JOIN users u ON u.id = r.user_id
                LEFT JOIN events e ON e.id = r.event_id
                ORDER BY r.created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $eventId = isset($data['event_id']) ? (int)$data['event_id'] : null;
        if (!$eventId) {
            return ['error' => 'Missing event_id'];
        }

        // Validate event is not past (combine date and time; if no time, consider end of day)
        $q = $this->conn->prepare('SELECT date, time FROM events WHERE id = :id');
        $q->bindValue(':id', $eventId, PDO::PARAM_INT);
        $q->execute();
        $ev = $q->fetch(PDO::FETCH_ASSOC);
        if (!$ev) {
            return ['error' => 'Event not found'];
        }
        $date = $ev['date'] ?? null;
        $time = $ev['time'] ?? null;
        $dtStr = $date ? ($date . ' ' . ($time ?: '23:59:59')) : null;
        if ($dtStr) {
            $now = new DateTime('now');
            $evt = new DateTime($dtStr);
            if ($evt < $now) {
                return ['error' => 'Event already ended'];
            }
        }

        $sql = "INSERT INTO {$this->table} (event_id, user_id, status) VALUES (:event_id, :user_id, :status)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':event_id', $eventId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', isset($data['user_id']) ? (int)$data['user_id'] : null, PDO::PARAM_INT);
        $stmt->bindValue(':status', $data['status'] ?? 'pending');
        $stmt->execute();
        return ['id' => $this->conn->lastInsertId()];
    }

    public function update($id, $data) {
        $sql = "UPDATE {$this->table} SET status=:status WHERE id=:id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->bindValue(':status', $data['status'] ?? 'pending');
        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id=:id");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id=:id");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function setApprovalCode($id, $code) {
        try {
            $stmt = $this->conn->prepare("UPDATE {$this->table} SET approval_code=:code WHERE id=:id");
            $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
            $stmt->bindValue(':code', $code);
            return $stmt->execute();
        } catch (PDOException $e) {
            if ($e->getCode() === '42S22') {
                try {
                    $this->conn->exec("ALTER TABLE {$this->table} ADD COLUMN approval_code VARCHAR(32) NULL AFTER status");
                    $stmt = $this->conn->prepare("UPDATE {$this->table} SET approval_code=:code WHERE id=:id");
                    $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
                    $stmt->bindValue(':code', $code);
                    return $stmt->execute();
                } catch (Throwable $e2) {
                    return false;
                }
            }
            return false;
        }
    }
}
?>
