<?php
// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');
header('Content-Type: application/json');
header('Access-Control-Max-Age: 3600');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// For security
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once 'config/database.php';
$db = (new Database())->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
// Derive path segments; PATH_INFO may be empty depending on Apache/PHP configuration
$pathInfo = $_SERVER['PATH_INFO'] ?? '';
if ($pathInfo === '' || $pathInfo === null) {
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    // Remove the directory of index.php from the request URI
    $baseDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
    if (strpos($requestUri, $baseDir) === 0) {
        $pathInfo = substr($requestUri, strlen($baseDir));
    } else {
        $pathInfo = $requestUri;
    }
}
$request = explode('/', trim($pathInfo, '/'));
$controller = $request[0] ?? 'auth';
$action = $request[1] ?? 'index';
$id = $request[2] ?? null;
// If second segment is numeric (e.g., /events/12 or /events/12/upload), set $id and shift action to third segment if present
if ($action && ctype_digit((string)$action)) {
    $id = (int)$action;
    $action = $request[2] ?? 'index';
}

switch ($controller) {
    case 'auth':
        require_once 'controllers/AuthController.php';
        $ctrl = new AuthController($db);
        if ($method == 'POST' && $action == 'register') {
            echo json_encode($ctrl->register(json_decode(file_get_contents('php://input'), true)));
        } elseif ($method == 'POST' && $action == 'login') {
            echo json_encode($ctrl->login(json_decode(file_get_contents('php://input'), true)));
        }
        break;
    case 'events':
        require_once 'controllers/EventController.php';
        $ctrl = new EventController($db);
        if ($method == 'GET' && $action == 'stats') {
            echo json_encode($ctrl->getStats());
        } elseif ($method == 'GET' && ($action === 'index' || $action === null)) {
            echo json_encode($ctrl->readAll());
        } elseif ($method == 'POST' && $action === 'upload' && $id) {
            echo json_encode($ctrl->upload($id));
        } elseif ($method == 'POST') {
            echo json_encode($ctrl->create(json_decode(file_get_contents('php://input'), true)));
        } elseif ($method == 'PUT' && $id) {
            echo json_encode($ctrl->update($id, json_decode(file_get_contents('php://input'), true)));
        } elseif ($method == 'DELETE' && $id) {
            echo json_encode($ctrl->delete($id));
        }
        break;
    case 'reservations':
        require_once 'controllers/ReservationController.php';
        $ctrl = new ReservationController($db);
        if ($method == 'GET') {
            echo json_encode($ctrl->readAll());
        } elseif ($method == 'POST') {
            echo json_encode($ctrl->create(json_decode(file_get_contents('php://input'), true)));
        } elseif ($method == 'PUT' && $id) {
            echo json_encode($ctrl->update($id, json_decode(file_get_contents('php://input'), true)));
        } elseif ($method == 'DELETE' && $id) {
            echo json_encode($ctrl->delete($id));
        }
        break;
    case 'notifications':
        require_once 'controllers/NotificationController.php';
        $ctrl = new NotificationController($db);
        if ($method == 'GET') {
            $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
            $onlyUnread = isset($_GET['unread']) && (int)$_GET['unread'] === 1;
            echo json_encode($ctrl->listByUser($userId, $onlyUnread));
        } elseif ($method == 'PUT' && $id && $action === 'read') {
            echo json_encode($ctrl->markRead($id));
        }
        break;
}
?>