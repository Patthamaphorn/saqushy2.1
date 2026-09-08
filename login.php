<?php
// (ไฟล์นี้คือ: login.php - ใช้สำหรับหน้าเข้าสู่ระบบของผู้ใช้งานด้วย PHP Session)

session_start(); // (1. เปิดใช้งานระบบ Session เพื่อบันทึกสถานะการเข้าสู่ระบบ)
require_once 'connect.php'; // (2. ดึงไฟล์เชื่อมต่อฐานข้อมูลมาใช้งาน)

// (3. ตรวจสอบเมื่อผู้ใช้กดปุ่มส่งฟอร์มเข้าสู่ระบบด้วยวิธี POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = $_POST['email'];    // (รับค่าอีเมลที่ผู้ใช้กรอกมา)
    $password = $_POST['password']; // (รับค่ารหัสผ่านที่ผู้ใช้กรอกมา)

    // (4. เขียนคำสั่ง SQL ค้นหาผู้ใช้จากอีเมลในฐานข้อมูล)
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC); // (ดึงข้อมูลผู้ใช้ออกมาเปรียบเทียบ)

    // (5. ตรวจสอบว่าพบผู้ใช้หรือไม่ และรหัสผ่านถูกต้องหรือไม่)
    if ($user && password_verify($password, $user['password'])) {
        // (ถ้ารหัสผ่านถูกต้อง ให้บันทึกข้อมูลเข้า Session)
        $_SESSION['user_id'] = $user['id'];         // (เก็บ ID ของผู้ใช้ไว้ในระบบ)
        $_SESSION['fullname'] = $user['fullname'];   // (เก็บชื่อของผู้ใช้ไว้แสดงผล)
        
        // (ส่งผู้ใช้ไปยังหน้าโปรไฟล์หลักทันที)
        header("Location: profile.php");
        exit();
    } else {
        // (กรณีใส่อีเมลหรือรหัสผ่านผิด ให้แจ้งเตือน)
        $error_msg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง!";
    }
}
?>

<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เข้าสู่ระบบ (PHP Login) - สกุชชี่ Boutique</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style> body { font-family: 'Prompt', sans-serif; } </style>
</head>
<body class="bg-[#FAFAFA] flex items-center justify-center min-h-screen p-4">

    <div class="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <h1 class="text-2xl font-bold text-center text-[#5C433B] mb-2">เข้าสู่ระบบ (PHP Form)</h1>
        <p class="text-xs text-center text-gray-400 mb-6">กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน</p>

        <!-- (แสดงข้อความผิดพลาดเมื่อใส่อีเมล/รหัสผ่านผิด) -->
        <?php if (isset($error_msg)): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-2xl mb-4 text-xs font-semibold text-center">
                <?php echo $error_msg; ?>
            </div>
        <?php endif; ?>

        <!-- (ฟอร์มส่งข้อมูลด้วยวิธี POST ไปที่หน้า login.php) -->
        <form action="login.php" method="POST" class="space-y-4">
            <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">อีเมล (Email)</label>
                <input type="email" name="email" required placeholder="customer@example.com" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
            </div>

            <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">รหัสผ่าน (Password)</label>
                <input type="password" name="password" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
            </div>

            <button type="submit" class="w-full bg-[#8B5A58] text-white py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-md">
                เข้าสู่ระบบ
            </button>
        </form>
    </div>

</body>
</html>
