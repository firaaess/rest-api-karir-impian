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

// Function to send an acceptance email to the applicant
export const sendAcceptanceEmail = async ({ to, jobTitle,jobCompany,jobLocation ,applicantName }) => {
  try {
      const mailOptions = {
          from: '"Karir-Impian" <info.karir.impian@gmail.com>',
          to,
          subject: `Selamat, Anda diterima untuk posisi ${jobTitle}`,
          text: `Hai ${applicantName},\n\nSelamat! Anda telah diterima untuk posisi ${jobTitle}. Kami akan segera menghubungi Anda untuk proses selanjutnya.\n\nTerima kasih!`,
          html: `
              <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                      <div style="background-color: #28a745; color: white; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                          <h1 style="margin: 0;">Selamat, ${applicantName}!</h1>
                      </div>
                      <div style="padding: 20px;">
                          <p>Selamat! Anda telah diterima untuk posisi <strong>${jobTitle}</strong>.</p>
                          <p>berlokasi di ${jobLocation}</p>
                          <p>pada perusahaan ${jobCompany}</p>
                          <p>Kami akan segera menghubungi Anda untuk langkah selanjutnya.</p>
                          <p>Jika Anda memiliki pertanyaan, silakan hubungi kami di <a href="mailto:info.karir.impian@gmail.com" style="color: #28a745;">info.karir.impian@gmail.com</a>.</p>
                          <p>Selamat memulai perjalanan karir Anda bersama kami!</p>
                          <p>Salam hangat,<br>Tim Karir-Impian</p>
                      </div>
                  </div>
              </div>
          `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Acceptance email sent:', info.response);
  } catch (error) {
      console.error('Error sending acceptance email:', error);
  }
};

// Function to send a rejection email to the applicant
export const sendRejectionEmail = async ({ to, jobTitle, jobCompany, applicantName }) => {
    try {
        const mailOptions = {
            from: '"Karir-Impian" <info.karir.impian@gmail.com>',
            to,
            subject: `Update Lamaran: Posisi ${jobTitle} di ${jobCompany}`,
            text: `Halo ${applicantName},\n\nTerima kasih atas ketertarikan Anda untuk posisi ${jobTitle} di ${jobCompany}. Sayangnya, kami telah memutuskan untuk melanjutkan proses dengan kandidat lain. Kami menghargai waktu dan usaha Anda dalam melamar.\n\nKami berharap Anda sukses dalam perjalanan karir Anda.\n\nSalam hangat,\nTim Karir-Impian`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="background-color: #dc3545; color: white; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="margin: 0;">Halo, ${applicantName}</h1>
                        </div>
                        <div style="padding: 20px;">
                            <p>Terima kasih atas ketertarikan Anda untuk posisi <strong>${jobTitle}</strong> di ${jobCompany}.</p>
                            <p>Setelah mempertimbangkan beberapa kandidat, kami telah memutuskan untuk melanjutkan proses dengan kandidat lain.</p>
                            <p>Kami menghargai waktu dan usaha yang telah Anda berikan dan berharap Anda menemukan kesempatan yang sesuai dengan karir impian Anda.</p>
                            <p>Jika ada pertanyaan lebih lanjut, silakan hubungi kami di <a href="mailto:info.karir.impian@gmail.com" style="color: #dc3545;">info.karir.impian@gmail.com</a>.</p>
                            <p>Salam hangat,<br>Tim Karir-Impian</p>
                        </div>
                    </div>
                </div>
            `,
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log('Rejection email sent:', info.response);
    } catch (error) {
        console.error('Error sending rejection email:', error);
    }
  };
  
  // Function to send email notifications to administrators
export const sendNewCompanyNotification = async (adminEmails, companyName) => {
    try {
        const mailOptions = {
            from: '"Karir-Impian" <info.karir.impian@gmail.com>',
            to: adminEmails,
            subject: `New Company Waiting for Approval`,
            text: `A new company named "${companyName}" has been added and is waiting for approval.`,
            html: `<p>A new company named <strong>${companyName}</strong> has been added and is currently waiting for approval. Please review it at your earliest convenience.</p>`,
        };

        // Sending email to all administrators
        await Promise.all(adminEmails.map(email => transporter.sendMail({ ...mailOptions, to: email })));
        console.log('Notification email sent to administrators.');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email notification.');
    }
};

// Function to send a notification email about a new job waiting for approval
export const jobMenungguPersetujuan = async (jobDetails, adminEmails) => {
    try {
        const { title, companyName, logo, salary, position, location } = jobDetails;
        const mailOptions = {
            from: '"Karir-Impian" <info.karir.impian@gmail.com>',
            to: adminEmails,
            subject: `New Job Waiting for Approval: ${title}`,
            text: `A new job titled "${title}" from "${companyName}" is waiting for approval.`,
            html: `
                <p>A new job titled <strong>"${title}"</strong> from <strong>${companyName}</strong> is waiting for approval.</p>
                <ul>
                    <li>Position: ${position}</li>
                    <li>Salary: ${salary}</li>
                    <li>Location: ${location}</li>
                    <li><img src="${logo}" alt="${companyName} Logo" /></li>
                </ul>
                <p>Please review and approve it as soon as possible.</p>
            `,
        };

        // Send email to each administrator
        await Promise.all(adminEmails.map(email => transporter.sendMail({ ...mailOptions, to: email })));
        console.log('Notification email sent to administrators.');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send job approval notification.');
    }
};
