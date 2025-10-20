<?php
require_once __DIR__ . '/../models/Event.php';

class EventController {
    private $db;
    private $model;

    public function __construct($db) {
        $this->db = $db;
        $this->model = new EventModel($db);
    }

    public function readAll() {
        try {
            return $this->model->readAll();
        } catch (Throwable $e) {
            http_response_code(500);
            return ['success' => false, 'error' => 'Failed to fetch events'];
        }
    }

    public function create($data) {
        try {
            $result = $this->model->create($data ?? []);
            return ['success' => true, 'id' => $result['id'] ?? null];
        } catch (Throwable $e) {
            http_response_code(400);
            return ['success' => false, 'error' => 'Failed to create event'];
        }
    }

    public function update($id, $data) {
        try {
            $ok = $this->model->update($id, $data ?? []);
            return ['success' => (bool)$ok];
        } catch (Throwable $e) {
            http_response_code(400);
            return ['success' => false, 'error' => 'Failed to update event'];
        }
    }

    public function delete($id) {
        try {
            $ok = $this->model->delete($id);
            return ['success' => (bool)$ok];
        } catch (Throwable $e) {
            http_response_code(400);
            return ['success' => false, 'error' => 'Failed to delete event'];
        }
    }

    public function getStats() {
        try {
            $stats = $this->model->stats();
            return ['success' => true, 'stats' => $stats];
        } catch (Throwable $e) {
            http_response_code(500);
            return ['success' => false, 'error' => 'Failed to fetch stats'];
        }
    }

    // Handle POST /events/{id}/upload (multipart/form-data, field name: image)
    public function upload($id) {
        try {
            if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
                http_response_code(400);
                return ['success' => false, 'error' => 'No image uploaded'];
            }

            $file = $_FILES['image'];
            if ($file['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                $err = 'Unknown upload error';
                switch ($file['error']) {
                    case UPLOAD_ERR_INI_SIZE: $err = 'File exceeds upload_max_filesize in php.ini'; break;
                    case UPLOAD_ERR_FORM_SIZE: $err = 'File exceeds MAX_FILE_SIZE in form'; break;
                    case UPLOAD_ERR_PARTIAL: $err = 'File was only partially uploaded'; break;
                    case UPLOAD_ERR_NO_FILE: $err = 'No file was uploaded'; break;
                    case UPLOAD_ERR_NO_TMP_DIR: $err = 'Missing a temporary folder'; break;
                    case UPLOAD_ERR_CANT_WRITE: $err = 'Failed to write file to disk'; break;
                    case UPLOAD_ERR_EXTENSION: $err = 'A PHP extension stopped the file upload'; break;
                }
                return ['success' => false, 'error' => $err];
            }

            // Validate size (max 5MB)
            $maxBytes = 5 * 1024 * 1024;
            if ($file['size'] > $maxBytes) {
                http_response_code(400);
                return ['success' => false, 'error' => 'File too large (max 5MB)'];
            }

            // Validate type (MIME or extension fallback)
            $allowedMime = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
            $mime = null;
            if (function_exists('finfo_open')) {
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                if ($finfo) {
                    $mime = finfo_file($finfo, $file['tmp_name']);
                    finfo_close($finfo);
                }
            }
            $ext = null;
            if ($mime && isset($allowedMime[$mime])) {
                $ext = $allowedMime[$mime];
            } else {
                $nameExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $allowedExt = ['jpg','jpeg','png','webp'];
                if (!in_array($nameExt, $allowedExt, true)) {
                    http_response_code(400);
                    return ['success' => false, 'error' => 'Unsupported image type'];
                }
                $ext = $nameExt === 'jpeg' ? 'jpg' : $nameExt;
            }
            $uploadsDir = __DIR__ . '/../uploads';
            if (!is_dir($uploadsDir)) {
                if (!@mkdir($uploadsDir, 0775, true)) {
                    http_response_code(500);
                    return ['success' => false, 'error' => 'Cannot create uploads directory'];
                }
            }

            $safeName = 'event-' . ((int)$id) . '-' . time() . '.' . $ext;
            $destFs = $uploadsDir . '/' . $safeName;
            if (!move_uploaded_file($file['tmp_name'], $destFs)) {
                http_response_code(500);
                return ['success' => false, 'error' => 'Failed to save image'];
            }

            // Relative path used by frontend
            $relPath = 'uploads/' . $safeName;
            $ok = $this->model->setImagePath($id, $relPath);
            if (!$ok) {
                http_response_code(500);
                return ['success' => false, 'error' => 'Failed to update event image'];
            }

            return ['success' => true, 'image_path' => $relPath];
        } catch (Throwable $e) {
            http_response_code(500);
            return ['success' => false, 'error' => 'Unexpected error while uploading image: ' . $e->getMessage()];
        }
    }
}
?>
