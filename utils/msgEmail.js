import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "info.karir.impian@gmail.com",
      pass: "kyih dpog idol gyer", // Use an app-specific password for better security
    },
});

// Function to send a welcome email
export const joinWeb = async (email, fullname) => {
    try {
        const info = await transporter.sendMail({
            from: '"Karir-Impian" <info.karir.impian@gmail.com>',
            to: email,
            subject: `Selamat Datang di Karir-Impian, ${fullname}`,
            text: `Selamat datang, ${fullname}! Terima kasih telah bergabung di Karir-Impian.`,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <div style="background-color: #007bff; color: white; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0;">Selamat Datang, ${fullname}!</h1>
                  </div>
                  <div style="padding: 20px;">
                    <p>Terima kasih telah mendaftar. Kami sangat senang menyambut Anda ke dalam komunitas kami.</p>
                    <p>Mulailah menjelajahi berbagai kesempatan karir dan sumber daya yang kami tawarkan.</p>
                    <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami di <a href="mailto:info.karir.impian@gmail.com" style="color: #007bff;">info.karir.impian@gmail.com</a>.</p>
                    <p>Selamat berpetualang dalam mencari karir impian Anda!</p>
                    <p>Salam hangat,<br>Tim Karir-Impian</p>
                  </div>
                </div>
              </div>
            `,
        });          
        console.log(info);
    } catch (error) {
        console.log(error);
    }
};

export const jobBaruMsg = async ({ title, companyName, location, salary, logo }, recipientEmails) => {
  const emailSubject = `Lowongan Kerja Baru: ${title}`;
  const emailText = `Hai, kami punya rekomendasi lowongan kerja baru untuk Anda: ${title} di ${companyName}.`;

  const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; padding: 20px;">
                  <img src="${logo}" alt="${companyName} Logo" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-right: 20px;" />
                  <div>
                      <h3 style="color: #007bff; margin: 0;">${title}</h3>
                      <p style="margin: 5px 0;">${companyName}</p>
                      <p style="margin: 5px 0;"><strong>Lokasi:</strong> ${location}</p>
                      <p style="margin: 5px 0;"><strong>Gaji:</strong> ${salary}</p>
                  </div>
              </div>
              <div style="padding: 0 20px 20px;">
                  <h2 style="color: #333;">Hai, kami punya rekomendasi lowongan kerja baru untuk Anda</h2>
                  <p>Kami ingin membantumu menemukan lowongan kerja yang tepat, dan posisi berikut mungkin cocok untukmu.</p>
                  <p>Kami menyarankan lowongan kerja ini berdasarkan profilmu serta lowongan dan lamaran kerja yang pernah dilihat.</p>
                  
                  <hr style="border: 1px solid #007bff;" />

                  <p>Silakan cek aplikasi Anda untuk detail lebih lanjut.</p>
                  <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami di <a href="mailto:info.karir.impian@gmail.com" style="color: #007bff;">info.karir.impian@gmail.com</a>.</p>
                  <p>Selamat berpetualang dalam mencari karir impian Anda!</p>
                  <p style="margin-top: 20px;">Salam hangat,<br>Tim Karir-Impian</p>
              </div>
          </div>
      </div>
  `;

  await Promise.all(recipientEmails.map(email => {
      const mailOptions = {
          from: '"Karir-Impian" <info.karir.impian@gmail.com>',
          to: email,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
      };

      return transporter.sendMail(mailOptions);
  }));
};
