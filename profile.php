<?php
// (1. เริ่มต้นการใช้งาน Session เพื่อดึงข้อมูลคนที่ล็อกอินค้างไว้)
session_start();

// (2. เรียกใช้ไฟล์เชื่อมต่อฐานข้อมูล connect.php)
require_once 'connect.php';

// (3. ตรวจสอบว่าผู้ใช้ล็อกอินเข้ามาหรือยัง ถ้ายังไม่ได้ล็อกอิน ให้เด้งไปหน้า login.php)
if (!isset($_SESSION['user_id'])) {
    // (คำสั่ง header ใช้สำหรับเปลี่ยนหน้าไปยัง login.php)
    header("Location: login.php");
    exit(); // (หยุดการทำงานของโค้ดในบรรทัดถัดไปทันที)
}

// (4. ดึงข้อมูลของผู้ใช้ที่ล็อกอินอยู่ จาก Session ID)
$user_id = $_SESSION['user_id']; // (รับค่า ID ของผู้ใช้งานที่บันทึกไว้ในตัวแปร Session)

// (5. เขียนคำสั่ง SQL เพื่อเตรียมดึงข้อมูลผู้ใช้จากตาราง users)
$stmt = $conn->prepare("SELECT * FROM users WHERE id = :id"); // (ใช้ :id เพื่อป้องกันการโจมตีทาง SQL Injection)
$stmt->execute(['id' => $user_id]); // (ส่งค่า $user_id เข้าไปแทนที่ :id)
$user = $stmt->fetch(PDO::FETCH_ASSOC); // (แปลงข้อมูลที่ได้จากฐานข้อมูลให้อยู่ในรูปแบบ Array)

// (6. ตรวจสอบเมื่อมีการกดปุ่มกดบันทึกแก้ไขข้อมูลส่วนตัว POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // (รับค่าจากฟอร์ม HTML ที่ส่งมา)
    $fullname = $_POST['fullname']; // (รับค่าชื่อ-นามสกุล)
    $phone    = $_POST['phone'];    // (รับค่าเบอร์โทรศัพท์)
    $address  = $_POST['address'];  // (รับค่าที่อยู่จัดส่ง)

    // (เตรียมคำสั่ง SQL อัปเดตข้อมูลผู้ใช้)
    $updateStmt = $conn->prepare("UPDATE users SET fullname = :fullname, phone = :phone, address = :address WHERE id = :id");
    
    // (ประมวลผลคำสั่งอัปเดต)
    $updateStmt->execute([
        'fullname' => $fullname,
        'phone'    => $phone,
        'address'  => $address,
        'id'       => $user_id
    ]);

    // (แจ้งเตือนผู้ใช้เมื่อบันทึกสำเร็จและรีเฟรชหน้า)
    $success_msg = "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!";
}
?>

<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>โปรไฟล์ผู้ใช้งาน (PHP) - สกุชชี่ Boutique</title>
    <!-- (ดึงใช้งาน Tailwind CSS สำหรับตกแต่งความสวยงาม) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style> body { font-family: 'Prompt', sans-serif; } </style>
</head>
<body class="bg-[#FAFAFA] text-[#5C433B]">

    <!-- (ส่วน Navigation Bar แถบเมนูด้านบน) -->
    <nav class="bg-white py-4 shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-6 flex justify-between items-center">
            <a href="index.php" class="text-3xl font-bold text-[#5C433B]">สกุชชี่ Boutique</a>
            <div class="flex space-x-6 font-medium">
                <a href="index.php" class="hover:text-[#8B5A58]">หน้าแรก</a>
                <a href="products.php" class="hover:text-[#8B5A58]">สินค้าทั้งหมด</a>
                <a href="profile.php" class="text-[#8B5A58] font-bold">โปรไฟล์ของฉัน</a>
                <a href="logout.php" class="text-red-500 font-semibold hover:underline">ออกจากระบบ</a>
            </div>
        </div>
    </nav>

    <!-- (ส่วนเนื้อหาหลักของหน้าโปรไฟล์) -->
    <main class="container mx-auto px-6 py-8">
        
        <!-- (แสดงข้อความแจ้งเตือนสำเร็จ เมื่อกดบันทึกข้อมูล) -->
        <?php if (isset($success_msg)): ?>
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl mb-6">
                <!-- (แสดงข้อความจากตัวแปร $success_msg) -->
                <?php echo $success_msg; ?>
            </div>
        <?php endif; ?>

        <!-- (การ์ดแสดงข้อมูลสรุปผู้ใช้งาน) -->
        <div class="bg-gradient-to-r from-[#8B5A58] to-[#5C433B] rounded-3xl p-8 text-white shadow-xl mb-8 flex items-center justify-between">
            <div class="flex items-center space-x-5">
                <img src="<?php echo htmlspecialchars($user['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'); ?>" class="w-20 h-20 rounded-full border-4 border-white/30 object-cover">
                <div>
                    <!-- (แสดงชื่อผู้ใช้จากฐานข้อมูล) -->
                    <h1 class="text-2xl font-bold"><?php echo htmlspecialchars($user['fullname']); ?></h1>
                    <!-- (แสดงอีเมลจากฐานข้อมูล) -->
                    <p class="text-sm text-pink-100 opacity-90"><?php echo htmlspecialchars($user['email']); ?></p>
                    <span class="inline-block mt-2 bg-amber-400 text-[#5C433B] text-xs font-bold px-3 py-1 rounded-full">🌟 VIP Gold Member</span>
                </div>
            </div>
        </div>

        <!-- (ฟอร์มสำหรับแก้ไขข้อมูลส่วนตัว ส่งค่าด้วยวิธี POST ไปยังตัวเอง) -->
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-6 text-[#5C433B]">แก้ไขข้อมูลส่วนตัว (PHP Managed Form)</h2>

            <form action="profile.php" method="POST" class="space-y-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">ชื่อ-นามสกุล (Full Name)</label>
                    <!-- (ดึงค่าชื่อจากฐานข้อมูลมาแสดงในกรอบ input) -->
                    <input type="text" name="fullname" value="<?php echo htmlspecialchars($user['fullname']); ?>" required class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">เบอร์โทรศัพท์ (Phone Number)</label>
                    <!-- (ดึงค่าเบอร์โทรจากฐานข้อมูลมาแสดงในกรอบ input) -->
                    <input type="tel" name="phone" value="<?php echo htmlspecialchars($user['phone'] ?? '081-234-5678'); ?>" required class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">ที่อยู่จัดส่ง (Shipping Address)</label>
                    <!-- (ดึงค่าที่อยู่จากฐานข้อมูลมาแสดงใน textarea) -->
                    <textarea name="address" rows="3" required class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none"><?php echo htmlspecialchars($user['address'] ?? '99/9 กรุงเทพฯ 10110'); ?></textarea>
                </div>

                <div class="flex justify-end">
                    <button type="submit" class="bg-[#8B5A58] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-md">
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </form>
        </div>
    </main>

</body>
</html>
