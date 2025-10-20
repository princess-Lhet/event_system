<?php
class NotificationModel {
    private $conn;
    private $table = 'notifications';

    public function __construct($db) {
        $this->conn = $db;
        $this->ensureTable();
    }

    private function ensureTable() {
        try {
            $this->conn->query("SELECT 1 FROM {$this->table} LIMIT 1");
        } catch (Throwable $e) {
            $sql = "CREATE TABLE IF NOT EXISTS {$this->table} (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        type VARCHAR(50) NOT NULL,
                        title VARCHAR(150) NOT NULL,
                        message TEXT,
                        data_json TEXT NULL,
                        is_read TINYINT(1) DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX(user_id), INDEX(is_read)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
            $this->conn->exec($sql);
        }
    }

    public function create($userId, $type, $title, $message = '', $data = null) {
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (user_id, type, title, message, data_json) VALUES (:user_id, :type, :title, :message, :data_json)");
        $stmt->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
        $stmt->bindValue(':type', $type);
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':message', $message);
        $stmt->bindValue(':data_json', $data ? json_encode($data) : null);
        $stmt->execute();
        return ['id' => $this->conn->lastInsertId()];
    }

    public function readByUser($userId, $onlyUnread = false) {
        $sql = "SELECT * FROM {$this->table} WHERE user_id = :user_id" . ($onlyUnread ? " AND is_read=0" : "") . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function markRead($id) {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET is_read=1 WHERE id=:id");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
