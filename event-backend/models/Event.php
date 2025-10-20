<?php
class EventModel {
    private $conn;
    private $table = 'events';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $sql = "SELECT * FROM {$this->table} ORDER BY date ASC, time ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (title, description, date, time, location, capacity, organizer_id)
                VALUES (:title, :description, :date, :time, :location, :capacity, :organizer_id)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':date', $data['date'] ?? date('Y-m-d'));
        $stmt->bindValue(':time', $data['time'] ?? null);
        $stmt->bindValue(':location', $data['location'] ?? null);
        $stmt->bindValue(':capacity', isset($data['capacity']) ? (int)$data['capacity'] : null, PDO::PARAM_INT);
        $stmt->bindValue(':organizer_id', isset($data['organizer_id']) ? (int)$data['organizer_id'] : null, PDO::PARAM_INT);
        $stmt->execute();
        return ['id' => $this->conn->lastInsertId()];
    }

    public function update($id, $data) {
        $sql = "UPDATE {$this->table} SET title=:title, description=:description, date=:date, time=:time, location=:location, capacity=:capacity WHERE id=:id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->bindValue(':title', $data['title'] ?? '');
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':date', $data['date'] ?? date('Y-m-d'));
        $stmt->bindValue(':time', $data['time'] ?? null);
        $stmt->bindValue(':location', $data['location'] ?? null);
        $stmt->bindValue(':capacity', isset($data['capacity']) ? (int)$data['capacity'] : null, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id=:id");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function stats() {
        $total = (int)$this->conn->query("SELECT COUNT(*) FROM {$this->table}")->fetchColumn();
        $capacity = (int)$this->conn->query("SELECT COALESCE(SUM(capacity),0) FROM {$this->table}")->fetchColumn();
        return ['total_events' => $total, 'total_capacity' => $capacity];
    }

    // Update only image_path for a given event id
    public function setImagePath($id, $path) {
        try {
            $sql = "UPDATE {$this->table} SET image_path=:image_path WHERE id=:id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
            $stmt->bindValue(':image_path', $path);
            return $stmt->execute();
        } catch (PDOException $e) {
            // Auto-migrate: add image_path column if missing, then retry once
            if ($e->getCode() === '42S22') { // Column not found
                try {
                    $this->conn->exec("ALTER TABLE {$this->table} ADD COLUMN image_path VARCHAR(255) NULL AFTER capacity");
                    $stmt = $this->conn->prepare("UPDATE {$this->table} SET image_path=:image_path WHERE id=:id");
                    $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
                    $stmt->bindValue(':image_path', $path);
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
