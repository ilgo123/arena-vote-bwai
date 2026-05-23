import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

// KITA BUAT KONEKSI KHUSUS MENGGUNAKAN MASTER KEY (Bypass RLS)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error("❌ ERROR: VITE_SUPABASE_SERVICE_ROLE_KEY belum dipasang di .env!");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const ADMIN_EMAILS = [
  'lutfihanif1806@gmail.com', 
  'prayogoilham27@gmail.com'
];

async function seedDatabase() {
  console.log('📁 Membaca file CSV...');
  const fileText = await Bun.file('hasil_pembagian_tim_bwai.csv').text();

  Papa.parse(fileText, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const data = results.data as Record<string, string>[];
      const headers = Object.keys(data[0]);
      const teamCol = headers.find(k => k.toLowerCase().includes('tim') || k.toLowerCase().includes('kelompok'));
      const emailCol = headers.find(k => k.toLowerCase().includes('email'));

      if (!teamCol || !emailCol) return console.error("❌ ERROR: Kolom 'Tim' atau 'Email' tidak ditemukan di CSV!");

      // 1. OLAH DATA KELOMPOK
      const uniqueTeams = [...new Set(data.map(row => row[teamCol]).filter(Boolean))];
      console.log(`\n🏗️ Menyimpan ${uniqueTeams.length} tim ke tabel 'kelompok'...`);

      for (let i = 0; i < uniqueTeams.length; i++) {
        const teamName = uniqueTeams[i];
        const teamId = `TIM-${(i + 1).toString().padStart(2, '0')}`;

        const { error } = await supabaseAdmin.from('kelompok').upsert({
          id_kelompok: teamId,
          nama_kelompok: teamName,
          deskripsi: 'Finalis The AI Agent Arena'
        });

        if (error) console.error(`❌ Gagal simpan tim ${teamName}:`, error.message);
      }

      // 2. OLAH DATA PESERTA & SET ROLE ADMIN
      console.log('\n👥 Menyimpan data peserta...');
      let successCount = 0;

      for (const row of data) {
        const email = row[emailCol]?.trim();
        const teamName = row[teamCol];

        if (!email || !teamName) continue;

        const teamId = `TIM-${(uniqueTeams.indexOf(teamName) + 1).toString().padStart(2, '0')}`;
        const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'voter';

        const { error } = await supabaseAdmin.from('peserta').upsert({
          email: email,
          id_kelompok: teamId,
          role: role
        });

        if (error) {
          console.error(`❌ Gagal simpan email ${email}:`, error.message);
        } else {
          successCount++;
        }
      }

      console.log(`\n🎉 SEEDING SELESAI! ${successCount} Peserta berhasil masuk ke Database! 🔥`);
    }
  });
}

seedDatabase();