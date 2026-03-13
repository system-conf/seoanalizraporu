<?php
// En İyi SEO Hizmeti - Database Bridge
// Bu dosya, denerken 3306 portu kapalı olduğunda veritabanı işlemlerini yapmak için kullanılır.

header('Content-Type: application/json');

$db_host = 'localhost';
$db_user = 'eniyiseohizmeti_seo';
$db_pass = 'diNKN.gRA)~u';
$db_name = 'eniyiseohizmeti_seo';

try {
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    if ($conn->connect_error) {
        throw new Exception("Bağlantı hatası: " . $conn->connect_error);
    }
    
    // Test sorgusu
    $result = $conn->query("SELECT 1 + 1 AS res");
    $row = $result->fetch_assoc();
    
    echo json_encode([
        "status" => "success",
        "message" => "Veritabanı bağlantısı başarılı (Localhost üzerinden)",
        "test_result" => $row['res']
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
