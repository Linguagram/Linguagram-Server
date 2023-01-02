## Input
1. Backend perlu tahu data apa yang dibutuhkan oleh Frontend.

## Endpoint
1. POST: Register, Login, Verify (Kukuh)
	1. Register: user mengirim data registrasi ke server -> sekalian post UserLanguages
	2. Verify: saat sign up, akan mengirimkan link verifikasi ke user. User perlu "mengunjungi" link verifikasi agar akunnya dapat digunakan.

2. POST: Avatar
	1. Digunakan user untuk mengubah avatar.
	2. User tidak perlu menekan tombol save saat mengubah avatar; avatar berubah secara otomatis setelah user mengunggah image avatarnya yang baru.
	3. Perlu ada endpoint untuk menghapus avatar.

3. GET /groups/:groupId/messages/
	1. Perlu autentikasi
	2. Params: groupId
	3. Mengembalikan array of messages

4. POST /groups/:groupId/messages/
	1. req body: perlu **content** dan/atau **attachment**. Attachment berbentuk file.
	2. response: mengembalikan new message. Berisi user id, user(object), content, media (kalau ada attachment)

Bentuk kembalian dari server (untuk user yang nge-post message):
```json
	{
		messageId: INTEGER,
		userId: INTEGER,
		content: TEXT,
		User: {object},
		Media: {object},
		Group: {object}
	}
```

Saat seorang user nge-post, itu akan men-trigger event di socket io; User yang ngepost akan mendapat kembalian dari server, sedangkan socket io akan mengumumkan event tersebut ke member lain (user selain yang ngepost tadi).

5. PUT Message
	1. req: content
	2. response: object message

6. DELETE Message
	1. response: object berisi id message

7. Video Call
	1. Request:
		1. Header
		2. params: groupId
	2. Response: twilio token
	3. Alur:
		1. Client -> Server -> Twilio -> ngecek apakah ada room
		2. Kalau enggak ada room, maka akan dibuatkan oleh Twillio.
		3. Twilio memberi response ke server
		4. Server mengembalikan token ke client.
		5. Syarat video call: mesti temenan (termasuk dalam friendships).

---

![[Screenshot 2022-12-29 at 16.53.46.png]]

Catatan:
1. UserId adalah id dari pengirim permintaan pertemanan.
2. FriendId adalah id dari penerima permintaan pertemanan.

GET friendships
1. Headers: access token

PATCH friendships/:friendshipId
1. Headers: access token
2. response: Object friendships yang `isAccepted`-nya `true`.

---

8. GET Group
	1. Headers: access token
	2. params: user id
	3. response: object group
	4. alur:
		1. Explore
		2. Ketemu orang yang mau diajak chat. Ketika orang itu diklik, masuk ke tampilan chat.
		3. Saat masuk ke page chat, client akan meminta server mencari group yang terkait dengan kedua user.
			1. Di client, mungkin bisa pakai endpoint seperti `/groups/userId` (?)
		4. Server mencari group yang terkait dengan kedua user. Kalau enggak ada, akan dibuatkan group.
		5. Setelah ada grup, user bisa mengirim pesan menggunakan POST message tadi.

---

### GET /users (Explore)
1. Mengembalikan array of users:
	1. yang mempunyai language native -- membawa relasi dengan tabel languages -> untuk mengecek apakah dia native atau enggak.
	2. belum menjadi teman

### GET /languages

### GET /users/:id
1. request:
	1. headers: access token
2. response:
	1. User {Object}
		1. include: UserLanguage
			1. include Language

### PUT /users (Edit Profile)
1. request:
	1. headers: access token
	2. body: username, password, phone number, country; user languages (array of objects dari user language). (Semangat tim server)

### Schedules (Optional)

## Client (Todo)
1. Perlu menambahkan satu page untuk menunjukkan verifikasi berhasil.
2. Bikin modal saat user hendak menambahkan, mengubah, dan/atau menghapus avatar.
3. Perlu belajar socket.io
4. Untuk mengecek apakah message pernah diedit atau tidak, bisa pakai metode:
	1. Membandingkan createdAt dan updatedAt; kalau enggak sama, berarti sudah diedit.
	2. Menambahkan field baru.

## Target
1. API Docs
2. Layouting (Sebelum minggu ke-4)