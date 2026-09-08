<?php
// (ไฟล์นี้คือ: connect.php - ใช้สำหรับเชื่อมต่อกับฐานข้อมูล MySQL)

$host = "localhost";    // (1. ตัวแปรเก็บที่อยู่ของระบบ Server ในเครื่องคอมพิวเตอร์ของเรา)
$user = "root";         // (2. ตัวแปรเก็บชื่อผู้ใช้ฐานข้อมูล Default ของระบบ Laragon / XAMPP)
$pass = "";             // (3. ตัวแปรเก็บรหัสผ่านฐานข้อมูล ปกติถ้าเปิดในเครื่องตัวเองจะเว้นว่างไว้)
$dbname = "squishy_db"; // (4. ตัวแปรเก็บชื่อฐานข้อมูลที่เราต้องการเชื่อมต่อ)

// (5. เริ่มต้นการเชื่อมต่อฐานข้อมูลแบบ PDO - PHP Data Objects ซึ่งเป็นวิธีที่ปลอดภัยที่สุด)
try {
    // (สร้าง Object การเชื่อมต่อด้วย PDO พร้อมตั้งค่าให้รองรับภาษาไทย charset=utf8)
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    
    // (กำหนดโหมดการแจ้งเตือนข้อผิดพลาด ให้แสดง Exception เมื่อเกิดปัญหา SQL)
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $e) {
    // (ถ้าเกิดข้อผิดพลาดในการเชื่อมต่อ เช่น ชื่อ DB ผิด ให้หยุดทำงานและแจ้งเตือนทันที)
    die("เชื่อมต่อฐานข้อมูลล้มเหลว: " . $e->getMessage());
}
?>
